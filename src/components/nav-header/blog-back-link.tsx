"use client";

import { RiArrowLeftLine } from "@remixicon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BlogBackLink() {
	const pathname = usePathname();

	if (!pathname.startsWith("/blog/")) {
		return null;
	}

	return (
		<Link
			href="/blog"
			className="inline-flex items-center gap-1.5 border border-border px-2.5 py-1.5 font-data text-muted-foreground text-xs transition-colors hover:border-foreground hover:text-foreground"
		>
			<RiArrowLeftLine className="size-3.5" />
			返回博客列表
		</Link>
	);
}
