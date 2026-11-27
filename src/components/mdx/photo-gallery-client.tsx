"use client";

import {
	RiArrowLeftSLine,
	RiArrowRightSLine,
	RiCloseLine,
	RiZoomInLine,
} from "@remixicon/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import type { GalleryPhoto, PhotoGalleryLayout } from "./photo-gallery-types";

type PhotoTileProps = {
	photo: GalleryPhoto;
	index: number;
	onOpen: () => void;
	variant: "cover" | "natural" | "masonry";
};

function PhotoTile({ photo, index, onOpen, variant }: PhotoTileProps) {
	return (
		<button
			aria-label={`查看照片 ${index + 1}${photo.caption ? `：${photo.caption}` : ""}`}
			className={cn(
				"group relative block w-full overflow-hidden border border-border bg-muted",
				variant === "cover" && "aspect-[4/3]",
				variant === "masonry" && "break-inside-avoid",
			)}
			onClick={onOpen}
			type="button"
		>
			{/* biome-ignore lint/performance/noImgElement: Local gallery images are statically exported without fixed dimensions. */}
			<img
				alt={photo.alt}
				className={cn(
					"block w-full transition duration-500 motion-reduce:transition-none",
					variant === "cover"
						? "h-full object-cover group-hover:scale-[1.02]"
						: "h-auto",
				)}
				loading="lazy"
				src={photo.src}
			/>
			<span className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/5" />
			<span className="absolute right-2 bottom-2 grid size-7 place-items-center border border-border bg-background/85 text-muted-foreground opacity-0 backdrop-blur-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
				<RiZoomInLine className="size-3.5" />
			</span>
			<span className="absolute bottom-2 left-2 border border-border bg-background/85 px-1.5 py-0.5 font-data text-[9px] text-muted-foreground tabular-nums opacity-0 backdrop-blur-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
				{String(index + 1).padStart(2, "0")}
			</span>
		</button>
	);
}

type PhotoGalleryClientProps = {
	photos: GalleryPhoto[];
	layout: PhotoGalleryLayout;
	columns: 2 | 3;
	caption?: string;
	className?: string;
};

export function PhotoGalleryClient({
	photos,
	layout,
	columns,
	caption,
	className,
}: PhotoGalleryClientProps) {
	const [isMounted, setIsMounted] = useState(false);
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (activeIndex === null) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setActiveIndex(null);
			}

			if (event.key === "ArrowLeft") {
				setActiveIndex((current) =>
					current === null
						? null
						: (current - 1 + photos.length) % photos.length,
				);
			}

			if (event.key === "ArrowRight") {
				setActiveIndex((current) =>
					current === null ? null : (current + 1) % photos.length,
				);
			}
		};

		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = originalOverflow;
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [activeIndex, photos.length]);

	const activePhoto = activeIndex === null ? null : photos[activeIndex];

	const open = (index: number) => () => setActiveIndex(index);

	return (
		<div className={cn("not-prose my-8", className)}>
			{layout === "masonry" ? (
				<div className="columns-2 gap-2 sm:gap-3 [&>*]:mb-2 sm:[&>*]:mb-3">
					{photos.map((photo, index) => (
						<PhotoTile
							index={index}
							key={photo.src}
							onOpen={open(index)}
							photo={photo}
							variant="masonry"
						/>
					))}
				</div>
			) : null}

			{layout === "grid" ? (
				<div
					className={cn(
						"grid gap-2 sm:gap-3",
						columns === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2",
					)}
				>
					{photos.map((photo, index) => (
						<PhotoTile
							index={index}
							key={photo.src}
							onOpen={open(index)}
							photo={photo}
							variant="cover"
						/>
					))}
				</div>
			) : null}

			{layout === "full-width" ? (
				<div className="flex flex-col gap-2 sm:gap-3">
					{photos.map((photo, index) => (
						<PhotoTile
							index={index}
							key={photo.src}
							onOpen={open(index)}
							photo={photo}
							variant="natural"
						/>
					))}
				</div>
			) : null}

			{layout === "single" && photos[0] ? (
				<PhotoTile
					index={0}
					onOpen={open(0)}
					photo={photos[0]}
					variant="natural"
				/>
			) : null}

			{caption ? (
				<p className="mt-3 font-data text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
					{caption}
				</p>
			) : null}

			{isMounted && activeIndex !== null && activePhoto
				? createPortal(
						<div
							aria-label="照片预览"
							aria-modal="true"
							className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-8"
							role="dialog"
						>
							<button
								aria-label="关闭预览"
								className="absolute inset-0 cursor-zoom-out bg-background/90 backdrop-blur-md"
								onClick={() => setActiveIndex(null)}
								type="button"
							/>

							<button
								aria-label="关闭预览"
								className="fixed top-4 right-4 z-50 grid size-10 cursor-pointer place-items-center border border-border bg-background/90 text-foreground backdrop-blur-sm transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring/60 focus-visible:outline-offset-2"
								onClick={() => setActiveIndex(null)}
								type="button"
							>
								<RiCloseLine className="size-5" />
							</button>

							{photos.length > 1 ? (
								<>
									<button
										aria-label="上一张"
										className="-translate-y-1/2 fixed top-1/2 left-2 z-50 grid size-10 cursor-pointer place-items-center border border-border bg-background/90 text-foreground backdrop-blur-sm transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring/60 focus-visible:outline-offset-2 sm:left-4"
										onClick={() =>
											setActiveIndex(
												(activeIndex - 1 + photos.length) % photos.length,
											)
										}
										type="button"
									>
										<RiArrowLeftSLine className="size-5" />
									</button>
									<button
										aria-label="下一张"
										className="-translate-y-1/2 fixed top-1/2 right-2 z-50 grid size-10 cursor-pointer place-items-center border border-border bg-background/90 text-foreground backdrop-blur-sm transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring/60 focus-visible:outline-offset-2 sm:right-4"
										onClick={() =>
											setActiveIndex((activeIndex + 1) % photos.length)
										}
										type="button"
									>
										<RiArrowRightSLine className="size-5" />
									</button>
								</>
							) : null}

							<figure className="relative flex max-h-full max-w-6xl flex-col items-center gap-3">
								{/* biome-ignore lint/performance/noImgElement: The preview mirrors the gallery image without fixed dimensions. */}
								<img
									alt={activePhoto.alt}
									className="max-h-[min(82vh,52rem)] w-auto max-w-full border border-border bg-muted object-contain"
									src={activePhoto.src}
								/>
								<figcaption className="flex w-full items-center justify-between gap-4 font-data text-[11px] text-muted-foreground">
									<span className="tabular-nums">
										{String(activeIndex + 1).padStart(2, "0")} /{" "}
										{String(photos.length).padStart(2, "0")}
									</span>
									<span className="truncate text-right text-foreground/75">
										{activePhoto.caption ?? caption ?? activePhoto.alt}
									</span>
								</figcaption>
							</figure>
						</div>,
						document.body,
					)
				: null}
		</div>
	);
}
