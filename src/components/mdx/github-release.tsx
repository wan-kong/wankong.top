/* biome-ignore-all lint/performance/noImgElement: next/image optimization is disabled for static export; plain img keeps the MDX asset portable. */
import { SiGithub } from "@icons-pack/react-simple-icons";
import {
	RiAppleFill,
	RiArrowRightUpLine,
	RiDownloadLine,
	RiFileZipLine,
	RiWindowsFill,
} from "@remixicon/react";
import type { ReactNode } from "react";

export type AssetPlatform = "macos" | "windows" | "archive";

export type ReleaseAsset = {
	name: string;
	label?: string;
	href?: string;
	platform?: AssetPlatform;
	featured?: boolean;
};

const platformIcons = {
	archive: RiFileZipLine,
	macos: RiAppleFill,
	windows: RiWindowsFill,
} as const;

function getAssetPlatform(asset: ReleaseAsset): AssetPlatform | undefined {
	if (asset.platform) {
		return asset.platform;
	}

	const key = `${asset.name} ${asset.label ?? ""}`.toLowerCase();

	if (key.includes(".tar") || key.includes(".tgz") || key.includes(".gz")) {
		return "archive";
	}

	if (key.includes("darwin") || key.includes("macos") || key.includes(".dmg")) {
		return "macos";
	}

	if (key.includes("windows") || key.includes(".exe")) {
		return "windows";
	}

	return undefined;
}

function AssetIcon({
	asset,
	className,
}: {
	asset: ReleaseAsset;
	className?: string;
}) {
	const platform = getAssetPlatform(asset);
	const Icon = platform ? platformIcons[platform] : RiDownloadLine;

	return <Icon className={className} />;
}

type GithubReleaseProps = {
	repo: string;
	tag?: string;
	name?: string;
	published?: string;
	latest?: boolean;
	icon?: string;
	href?: string;
	actionLabel?: string;
	assets?: ReleaseAsset[];
	children?: ReactNode;
};

export function GithubRelease({
	repo,
	name,
	icon,
	href,
	actionLabel = "下载",
	assets = [],
	children,
}: GithubReleaseProps) {
	const url = href ?? `https://github.com/${repo}/releases/latest`;

	const featured = assets.find((asset) => asset.featured);
	const others = assets.filter((asset) => !asset.featured);

	return (
		<section className="not-prose my-14 font-sans">
			<div className="flex flex-col items-center text-center">
				{icon ? (
					<img
						alt={`${name} 图标`}
						className="size-20 rounded-[22%]"
						height={80}
						src={icon}
						width={80}
					/>
				) : null}
				<h3 className="mt-5 font-semibold text-[28px] text-foreground leading-none tracking-tight">
					{name}
				</h3>

				{children ? (
					<div className="mt-3 max-w-sm text-[15px] text-foreground/70 leading-6 [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-3 [&_code]:font-mono [&_p:last-child]:mb-0 [&_p]:mb-2">
						{children}
					</div>
				) : null}
				{featured ? (
					<p className="mt-3 text-[12px] text-muted-foreground leading-none">
						{featured.label ?? featured.name}
					</p>
				) : null}
				{featured ? (
					<a
						className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-6 font-medium text-[15px] text-background transition-opacity hover:opacity-85"
						href={featured.href ?? url}
						rel="noreferrer"
						target="_blank"
					>
						<AssetIcon asset={featured} className="size-4 shrink-0" />
						{actionLabel}
					</a>
				) : null}
			</div>

			{others.length > 0 ? (
				<div className="mx-auto mt-10 max-w-md">
					{others.map((asset) => (
						<a
							aria-label={`查看 ${asset.name}`}
							className="group flex items-center justify-between gap-4 border-border/60 border-b py-3.5 first:border-t"
							href={asset.href ?? url}
							key={asset.name}
							rel="noreferrer"
							target="_blank"
						>
							<span className="flex min-w-0 items-center gap-2.5">
								<AssetIcon
									asset={asset}
									className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
								/>
								<span className="truncate text-[14px] text-foreground/85 transition-colors group-hover:text-foreground">
									{asset.label ?? asset.name}
								</span>
							</span>
							<RiArrowRightUpLine className="group-hover:-translate-y-0.5 size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
						</a>
					))}
				</div>
			) : null}

			<div className="mt-8 flex items-center justify-center gap-1.5">
				<SiGithub className="size-3.5 text-muted-foreground" />
				<a
					className="text-[12px] text-muted-foreground transition-colors hover:text-foreground"
					href={url}
					rel="noreferrer"
					target="_blank"
				>
					在 GitHub 查看 Release
				</a>
				<RiArrowRightUpLine className="size-3 text-muted-foreground" />
			</div>
		</section>
	);
}
