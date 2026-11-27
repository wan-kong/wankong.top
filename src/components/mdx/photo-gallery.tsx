import { getGalleryPhotos } from "@/lib/photo-gallery";
import { cn } from "@/lib/utils";
import { PhotoGalleryClient } from "./photo-gallery-client";
import type { PhotoGalleryLayout } from "./photo-gallery-types";

export type PhotoGalleryProps = {
	/** Defaults to the post slug when rendered from a blog post. */
	album?: string;
	layout?: PhotoGalleryLayout;
	columns?: 2 | 3;
	caption?: string;
	className?: string;
} & ({ id: string; files?: never } | { id?: never; files: readonly string[] });

export function PhotoGallery({
	id = "",
	files,
	album = "",
	layout = "grid",
	columns = 2,
	caption,
	className,
}: PhotoGalleryProps) {
	const photos = getGalleryPhotos(album, id, caption ?? "旅行照片", files);

	if (photos.length === 0) {
		if (process.env.NODE_ENV !== "development") {
			return null;
		}

		return (
			<div
				className={cn(
					"not-prose my-8 border border-border border-dashed px-4 py-6 font-data text-[11px] text-muted-foreground",
					className,
				)}
			>
				PHOTO GALLERY · {[album, id].filter(Boolean).join("/")} · 暂无图片
			</div>
		);
	}

	return (
		<PhotoGalleryClient
			caption={caption}
			className={className}
			columns={columns}
			layout={layout}
			photos={photos}
		/>
	);
}
