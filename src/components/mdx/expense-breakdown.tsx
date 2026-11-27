import { cn } from "@/lib/utils";

type ExpenseItem = {
	name: string;
	amount: number;
};

type ExpenseBreakdownProps = {
	items: ExpenseItem[];
	currency?: string;
	title?: string;
	note?: string;
	className?: string;
};

const CURRENCY_SYMBOLS: Record<string, string> = {
	CNY: "¥",
	EUR: "€",
	JPY: "¥",
	KRW: "₩",
	USD: "$",
};

const amountFormatter = new Intl.NumberFormat("zh-CN", {
	maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("zh-CN", {
	style: "percent",
	minimumFractionDigits: 1,
	maximumFractionDigits: 1,
});

export function ExpenseBreakdown({
	items,
	currency = "CNY",
	title = "EXPENSE",
	note,
	className,
}: ExpenseBreakdownProps) {
	const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
	const formatAmount = (amount: number) =>
		`${symbol}${amountFormatter.format(amount)}`;

	const total = items.reduce((sum, item) => sum + item.amount, 0);
	const rows = [...items].sort((left, right) => right.amount - left.amount);

	return (
		<section
			aria-label="花费明细"
			className={cn("not-prose my-8 border border-border bg-card", className)}
		>
			<header className="flex items-center justify-between gap-4 border-b bg-muted/30 px-4 py-3">
				<span className="font-data text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
					{title}
				</span>
				<span className="font-data text-[10px] text-muted-foreground tabular-nums">
					{rows.length} ITEMS
				</span>
			</header>

			<div className="flex items-end justify-between gap-4 px-4 py-5">
				<div>
					<p className="font-data text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
						TOTAL / 合计
					</p>
					<p className="mt-1 font-data text-3xl text-foreground tabular-nums sm:text-4xl">
						{formatAmount(total)}
					</p>
				</div>
				<span className="font-data text-[11px] text-muted-foreground">
					{currency}
				</span>
			</div>

			<ul className="border-border border-t">
				{rows.map((item) => {
					const share = total > 0 ? item.amount / total : 0;

					return (
						<li className="px-4 py-3" key={item.name}>
							<div className="flex items-baseline justify-between gap-4">
								<span className="font-ui text-foreground/90 text-sm">
									{item.name}
								</span>
								<span className="flex items-baseline gap-2 font-data tabular-nums">
									<span className="text-[10px] text-muted-foreground">
										{percentFormatter.format(share)}
									</span>
									<span className="text-foreground text-sm">
										{formatAmount(item.amount)}
									</span>
								</span>
							</div>
							<div className="mt-2 h-1 bg-muted">
								<div
									className="h-full bg-foreground"
									style={{ width: `${share * 100}%` }}
								/>
							</div>
						</li>
					);
				})}
			</ul>

			{note ? (
				<p className="border-border border-t px-4 py-3 text-muted-foreground text-xs leading-6">
					{note}
				</p>
			) : null}
		</section>
	);
}
