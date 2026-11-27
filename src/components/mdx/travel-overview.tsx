import { cn } from "@/lib/utils";
import { formatDateRange } from "./travel-utils";

type TravelOverviewProps = {
	destination: string;
	startDate?: string;
	endDate?: string;
	duration?: string;
	travelers?: number;
	luggage?: string;
	transportation?: string;
	className?: string;
};

export function TravelOverview({
	destination,
	startDate,
	endDate,
	duration,
	travelers,
	luggage,
	transportation,
	className,
}: TravelOverviewProps) {
	const meta: { label: string; value: string }[] = [];

	if (duration) {
		meta.push({ label: "DURATION / 时长", value: duration });
	}

	if (travelers !== undefined) {
		meta.push({
			label: "TRAVELERS / 人数",
			value: travelers === 1 ? "1 人 · 独自" : `${travelers} 人`,
		});
	}

	if (luggage) {
		meta.push({ label: "LUGGAGE / 行李", value: luggage });
	}

	if (transportation) {
		meta.push({ label: "TRANSPORT / 交通", value: transportation });
	}

	return (
		<section
			aria-label="旅行概览"
			className={cn("not-prose my-8 border border-border bg-card", className)}
		>
			<header className="flex items-center justify-between gap-4 border-b bg-muted/30 px-4 py-3">
				<span className="font-data text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
					TRIP FILE
				</span>
				{startDate || endDate ? (
					<span className="font-data text-[11px] text-muted-foreground tabular-nums">
						{formatDateRange(startDate, endDate)}
					</span>
				) : null}
			</header>

			<div className="px-4 py-5 sm:px-5">
				<span className="font-data text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
					DESTINATION / 目的地
				</span>
				<p className="mt-2 font-semibold font-ui text-2xl leading-tight sm:text-3xl">
					{destination}
				</p>
			</div>

			{meta.length > 0 ? (
				<dl className="grid grid-cols-2 gap-px border-border border-t bg-border sm:grid-cols-4">
					{meta.map((item) => (
						<div className="bg-card px-4 py-3" key={item.label}>
							<dt className="font-data text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
								{item.label}
							</dt>
							<dd className="mt-1 font-ui text-foreground/90 text-sm">
								{item.value}
							</dd>
						</div>
					))}
				</dl>
			) : null}
		</section>
	);
}
