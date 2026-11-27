import { cn } from "@/lib/utils";

type TravelMapProps = {
	locations: string[];
	title?: string;
	className?: string;
};

export function TravelMap({
	locations,
	title = "ROUTE",
	className,
}: TravelMapProps) {
	return (
		<section
			aria-label="行程路线"
			className={cn("not-prose my-8 border border-border bg-card", className)}
		>
			<header className="flex items-center justify-between gap-4 border-b bg-muted/30 px-4 py-3">
				<span className="font-data text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
					{title}
				</span>
				<span className="font-data text-[10px] text-muted-foreground tabular-nums">
					{String(locations.length).padStart(2, "0")} STOPS
				</span>
			</header>

			<div className="relative">
				<ol className="flex items-center overflow-x-auto px-4 py-4">
					{locations.map((location, index) => (
						<li
							className="flex shrink-0 items-center"
							// biome-ignore lint/suspicious/noArrayIndexKey: static MDX list, order is meaningful and names may repeat
							key={`${location}-${index}`}
						>
							<div className="border border-border px-3 py-2">
								<div className="font-data text-[10px] text-muted-foreground tabular-nums">
									{String(index + 1).padStart(2, "0")}
								</div>
								<div className="mt-0.5 whitespace-nowrap font-ui text-foreground/90 text-sm">
									{location}
								</div>
							</div>
							{index < locations.length - 1 ? (
								<span aria-hidden="true" className="mx-1.5 flex items-center">
									<span className="h-px w-4 bg-border" />
									<span className="size-1 bg-foreground/30" />
								</span>
							) : null}
						</li>
					))}
				</ol>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-card to-transparent sm:hidden"
				/>
			</div>
		</section>
	);
}
