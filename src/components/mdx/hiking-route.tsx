import { cn } from "@/lib/utils";

type HikingRouteProps = {
	mountain: string;
	ascent: string;
	descent: string;
	summit?: string;
	distance?: string | null;
	elevationGain?: string | null;
	duration?: string | null;
	note?: string;
	className?: string;
};

export function HikingRoute({
	mountain,
	ascent,
	descent,
	summit = "SUMMIT",
	distance,
	elevationGain,
	duration,
	note,
	className,
}: HikingRouteProps) {
	const stats = [
		distance ? { label: "DISTANCE / 距离", value: distance } : null,
		elevationGain ? { label: "ELEVATION / 爬升", value: elevationGain } : null,
		duration ? { label: "DURATION / 用时", value: duration } : null,
	].filter((item): item is { label: string; value: string } => item !== null);

	return (
		<section
			aria-label="徒步路线"
			className={cn("not-prose my-8 border border-border bg-card", className)}
		>
			<header className="flex items-center justify-between gap-4 border-b bg-muted/30 px-4 py-3">
				<span className="font-data text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
					TRAIL
				</span>
				<span className="font-ui text-foreground/90 text-sm">{mountain}</span>
			</header>

			<div className="px-4 pt-5 pb-3">
				<div className="relative h-16 sm:h-20">
					<svg
						aria-hidden="true"
						className="h-full w-full"
						preserveAspectRatio="none"
						viewBox="0 0 400 64"
					>
						<line
							className="text-border"
							stroke="currentColor"
							strokeDasharray="2 4"
							strokeWidth="1"
							vectorEffect="non-scaling-stroke"
							x1="4"
							x2="396"
							y1="58"
							y2="58"
						/>
						<path
							className="text-foreground/30"
							d="M 4 58 L 200 14 L 396 58"
							fill="none"
							stroke="currentColor"
							strokeLinejoin="round"
							strokeWidth="1.5"
							vectorEffect="non-scaling-stroke"
						/>
					</svg>
					<span className="-translate-x-1/2 -translate-y-1/2 absolute top-[86%] left-[1%] size-1.5 bg-foreground" />
					<span className="-translate-x-1/2 -translate-y-1/2 absolute top-[18%] left-1/2 size-1.5 bg-foreground" />
					<span className="-translate-x-1/2 -translate-y-1/2 absolute top-[86%] left-[99%] size-1.5 bg-foreground" />
				</div>

				<div className="mt-2 grid grid-cols-3 items-start gap-2">
					<span className="font-ui text-foreground/80 text-xs">↑ {ascent}</span>
					<span className="text-center font-data text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
						{summit}
					</span>
					<span className="text-right font-ui text-foreground/80 text-xs">
						{descent} ↓
					</span>
				</div>
			</div>

			{stats.length > 0 ? (
				<dl className="flex flex-wrap border-border border-t">
					{stats.map((stat) => (
						<div
							className="min-w-0 flex-1 border-border border-r px-4 py-3 last:border-r-0"
							key={stat.label}
						>
							<dt className="font-data text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
								{stat.label}
							</dt>
							<dd className="mt-1 font-data text-foreground/90 text-sm tabular-nums">
								{stat.value}
							</dd>
						</div>
					))}
				</dl>
			) : null}

			{note ? (
				<p className="border-border border-t px-4 py-3 text-muted-foreground text-xs leading-6">
					{note}
				</p>
			) : null}
		</section>
	);
}
