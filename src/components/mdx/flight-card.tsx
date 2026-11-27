import { RiFlightTakeoffLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { formatDateDots } from "./travel-utils";

type FlightCardProps = {
	flight: string;
	departure: string;
	arrival: string;
	departureTime: string;
	arrivalTime: string;
	date?: string;
	label?: string;
	note?: string;
	className?: string;
};

export function FlightCard({
	flight,
	departure,
	arrival,
	departureTime,
	arrivalTime,
	date,
	label = "FLIGHT",
	note,
	className,
}: FlightCardProps) {
	const displayDate = formatDateDots(date);

	return (
		<section
			aria-label="航班信息"
			className={cn("not-prose my-8 border border-border bg-card", className)}
		>
			<header className="flex items-center justify-between gap-4 border-b bg-muted/30 px-4 py-3">
				<span className="font-data text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
					{label}
				</span>
				<span className="font-data text-[11px] text-foreground tabular-nums">
					{flight}
				</span>
			</header>

			<div className="grid items-center gap-4 px-4 py-5 sm:grid-cols-[1fr_auto_1fr]">
				<div>
					<span className="font-data text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
						DEPARTURE / 出发
					</span>
					<p className="mt-1 font-data text-3xl tabular-nums">
						{departureTime}
					</p>
					<p className="mt-1 font-ui text-foreground/85 text-sm">{departure}</p>
				</div>

				<div className="flex items-center gap-3 sm:flex-col">
					<span className="h-px flex-1 bg-border sm:w-16 sm:flex-none" />
					<RiFlightTakeoffLine className="size-4 text-muted-foreground" />
					<span className="h-px flex-1 bg-border sm:w-16 sm:flex-none" />
				</div>

				<div className="sm:text-right">
					<span className="font-data text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
						ARRIVAL / 到达
					</span>
					<p className="mt-1 font-data text-3xl tabular-nums">{arrivalTime}</p>
					<p className="mt-1 font-ui text-foreground/85 text-sm">{arrival}</p>
				</div>
			</div>

			{displayDate || note ? (
				<footer className="flex flex-wrap items-center justify-between gap-2 border-border border-t px-4 py-2.5">
					{displayDate ? (
						<span className="font-data text-[11px] text-muted-foreground tabular-nums">
							{displayDate}
						</span>
					) : (
						<span />
					)}
					{note ? (
						<span className="font-data text-[11px] text-muted-foreground">
							{note}
						</span>
					) : null}
				</footer>
			) : null}
		</section>
	);
}
