import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductIcon({
	product,
	className,
	iconClassName,
}: {
	product: Product;
	className?: string;
	iconClassName?: string;
}) {
	return (
		<span
			className={cn(
				"flex shrink-0 items-center justify-center border text-foreground",
				product.accentClassName,
				className,
			)}
		>
			<product.icon
				className={cn(iconClassName, product.iconClassName)}
				color={product.iconColor}
			/>
		</span>
	);
}
