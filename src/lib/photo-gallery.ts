import fs from "node:fs";
import path from "node:path";
import type { GalleryPhoto } from "@/components/mdx/photo-gallery-types";

const POSTS_DIR = path.join(process.cwd(), "public", "imgs", "posts");
const IMAGE_EXTENSIONS = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]);
const fileCollator = new Intl.Collator("zh-CN", {
	numeric: true,
	sensitivity: "base",
});

type CaptionEntry = string | { alt?: string; caption?: string };

function readCaptions(dir: string): Record<string, CaptionEntry> {
	const file = path.join(dir, "captions.json");

	if (!fs.existsSync(file)) {
		return {};
	}

	try {
		const parsed: unknown = JSON.parse(fs.readFileSync(file, "utf8"));

		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
			return parsed as Record<string, CaptionEntry>;
		}
	} catch {
		// A broken captions file should never break the build.
	}

	return {};
}

/**
 * Photos are discovered from `public/imgs/posts/<album>/<id>/` at build time.
 * Pass an empty id and a list of filenames to select photos from the album root.
 * `captions.json` in the same folder optionally maps filenames to alt text:
 *
 *   { "01-airport.webp": "抵达济州国际机场" }
 */
export function getGalleryPhotos(
	album: string,
	id: string,
	fallbackAlt = "旅行照片",
	selectedFiles?: readonly string[],
): GalleryPhoto[] {
	const albumDir = path.resolve(POSTS_DIR, album);
	const galleryDir = path.resolve(albumDir, id);

	if (
		galleryDir !== albumDir &&
		!galleryDir.startsWith(`${albumDir}${path.sep}`)
	) {
		return [];
	}

	if (!fs.existsSync(galleryDir) || !fs.statSync(galleryDir).isDirectory()) {
		return [];
	}

	const captions = readCaptions(galleryDir);
	const availableFiles = fs
		.readdirSync(galleryDir, { withFileTypes: true })
		.filter(
			(entry) =>
				entry.isFile() &&
				IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()),
		)
		.map((entry) => entry.name);
	const files = selectedFiles
		? selectedFiles.filter((file) => availableFiles.includes(file))
		: availableFiles.sort(fileCollator.compare);

	return files.map((file, index) => {
		const entry = captions[file];
		const alt = typeof entry === "string" ? entry : entry?.alt;
		const caption =
			typeof entry === "object" && entry !== null ? entry.caption : undefined;
		const src = ["/imgs", "posts", album, id, file]
			.filter(Boolean)
			.map((segment) => encodeURI(segment))
			.join("/");

		return {
			src,
			alt: alt ?? `${fallbackAlt} ${index + 1}`,
			...(caption ? { caption } : {}),
		};
	});
}
