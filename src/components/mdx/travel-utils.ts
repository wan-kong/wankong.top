export function formatDateDots(value?: string) {
	if (!value) {
		return undefined;
	}

	const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);

	return match ? `${match[1]}.${match[2]}.${match[3]}` : value;
}

export function formatDateRange(start?: string, end?: string) {
	const from = formatDateDots(start);
	const to = formatDateDots(end);

	if (!from) {
		return to;
	}

	if (!to) {
		return from;
	}

	return from.slice(0, 4) === to.slice(0, 4)
		? `${from} — ${to.slice(5)}`
		: `${from} — ${to}`;
}
