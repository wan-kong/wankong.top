#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT_DIR/out"
ENV_FILE="$ROOT_DIR/.env"

if [[ -f "$ENV_FILE" ]]; then
	set -a
	# shellcheck disable=SC1090
	source "$ENV_FILE"
	set +a
fi

HOST="${OUT_SYNC_HOST:-${REMOTE_HOST:-}}"
USER="${OUT_SYNC_USER:-${REMOTE_USER:-}}"
PASSWORD="${OUT_SYNC_PASSWORD:-${REMOTE_PASSWORD:-}}"
REMOTE_PATH="${OUT_SYNC_PATH:-${REMOTE_PATH:-}}"
PORT="${OUT_SYNC_PORT:-${REMOTE_PORT:-22}}"

if [[ -z "$HOST" || -z "$USER" || -z "$PASSWORD" || -z "$REMOTE_PATH" ]]; then
	echo "Missing required .env values:"
	echo "OUT_SYNC_HOST, OUT_SYNC_USER, OUT_SYNC_PASSWORD, OUT_SYNC_PATH"
	exit 1
fi

if [[ ! -d "$OUT_DIR" ]]; then
	echo "Missing out directory. Run \`bun run build\` before syncing."
	exit 1
fi

if [[ "$REMOTE_PATH" == "/" || "$REMOTE_PATH" == "." || "$REMOTE_PATH" == "" ]]; then
	echo "Refusing to sync to unsafe remote path: $REMOTE_PATH"
	exit 1
fi

ASKPASS_FILE="$(mktemp)"
cleanup() {
	rm -f "$ASKPASS_FILE"
}
trap cleanup EXIT

cat >"$ASKPASS_FILE" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$OUT_SYNC_ASKPASS_PASSWORD"
EOF
chmod 700 "$ASKPASS_FILE"

SSH_OPTS=(
	-p "$PORT"
	-o StrictHostKeyChecking=accept-new
	-o PreferredAuthentications=password,keyboard-interactive
	-o PubkeyAuthentication=no
)
SCP_OPTS=(
	-P "$PORT"
	-o StrictHostKeyChecking=accept-new
	-o PreferredAuthentications=password,keyboard-interactive
	-o PubkeyAuthentication=no
)

export DISPLAY="${DISPLAY:-:0}"
export SSH_ASKPASS="$ASKPASS_FILE"
export SSH_ASKPASS_REQUIRE=force
export OUT_SYNC_ASKPASS_PASSWORD="$PASSWORD"

REMOTE="$USER@$HOST"

echo "Syncing $OUT_DIR/ to $REMOTE:$REMOTE_PATH"
ssh "${SSH_OPTS[@]}" "$REMOTE" "mkdir -p '$REMOTE_PATH' && find '$REMOTE_PATH' -mindepth 1 -maxdepth 1 ! -name '.user.ini' -exec rm -rf {} +"
scp "${SCP_OPTS[@]}" -r "$OUT_DIR"/. "$REMOTE:$REMOTE_PATH/"
