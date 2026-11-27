export type GalleryPhoto = {
	src: string;
	alt: string;
	caption?: string;
};

export type PhotoGalleryLayout = "grid" | "masonry" | "full-width" | "single";
