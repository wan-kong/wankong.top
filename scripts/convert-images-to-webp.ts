import { access, readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DEFAULT_INPUT = "public/imgs";
const SUPPORTED_EXTENSIONS = new Set([
	".png",
	".jpg",
	".jpeg",
	".gif",
	".tif",
	".tiff",
]);

interface Options {
	inputs: string[];
	overwrite: boolean;
	quality: number;
}

function printUsage(): void {
	console.log(`Convert raster images to WebP.

Usage:
  pnpm run images:webp [paths...] [--quality <1-100>] [--overwrite]

Arguments:
  paths              Files or directories to process recursively.
                     Defaults to ${DEFAULT_INPUT}.

Options:
  --quality <value>  WebP quality. Defaults to 82.
  --overwrite        Replace existing .webp output files, then delete sources.
  --help             Show this help output.

Supported inputs: png, jpg, jpeg, gif, tif, tiff
Output files are written beside their source images. Successfully converted source files are deleted.`);
}

function parseOptions(args: string[]): Options {
	const inputs: string[] = [];
	let overwrite = false;
	let quality = 82;

	for (let index = 0; index < args.length; index += 1) {
		const argument = args[index];

		if (argument === "--help" || argument === "-h") {
			printUsage();
			process.exit(0);
		}

		if (argument === "--overwrite") {
			overwrite = true;
			continue;
		}

		if (argument === "--quality") {
			const value = args[index + 1];
			const parsed = Number(value);

			if (!value || !Number.isInteger(parsed) || parsed < 1 || parsed > 100) {
				throw new Error("--quality must be an integer between 1 and 100.");
			}

			quality = parsed;
			index += 1;
			continue;
		}

		if (argument.startsWith("-")) {
			throw new Error(`Unknown option: ${argument}`);
		}

		inputs.push(argument);
	}

	return {
		inputs: inputs.length > 0 ? inputs : [DEFAULT_INPUT],
		overwrite,
		quality,
	};
}

function isSupportedImage(filePath: string): boolean {
	return SUPPORTED_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

async function fileExists(filePath: string): Promise<boolean> {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function collectImages(inputPath: string): Promise<string[]> {
	const resolvedInput = path.resolve(inputPath);
	const inputStats = await stat(resolvedInput);

	if (inputStats.isFile()) {
		return isSupportedImage(resolvedInput) ? [resolvedInput] : [];
	}

	if (!inputStats.isDirectory()) {
		return [];
	}

	const entries = await readdir(resolvedInput, { withFileTypes: true });
	const results = await Promise.all(
		entries.map((entry) => collectImages(path.join(resolvedInput, entry.name))),
	);

	return results.flat();
}

async function main(): Promise<void> {
	const options = parseOptions(process.argv.slice(2));
	const imageGroups = await Promise.all(options.inputs.map(collectImages));
	const imagePaths = [...new Set(imageGroups.flat())].sort();

	if (imagePaths.length === 0) {
		console.log("No supported images found.");
		return;
	}

	const outputs = new Map<string, string>();
	for (const imagePath of imagePaths) {
		const outputPath = imagePath.replace(/\.[^.]+$/, ".webp");
		const existingInput = outputs.get(outputPath);

		if (existingInput) {
			throw new Error(
				`Two inputs would write the same output: ${existingInput} and ${imagePath}`,
			);
		}

		outputs.set(outputPath, imagePath);
	}

	let converted = 0;
	let skipped = 0;

	for (const [outputPath, imagePath] of outputs) {
		if (!options.overwrite && (await fileExists(outputPath))) {
			console.log(
				`skip    ${path.relative(process.cwd(), outputPath)} already exists`,
			);
			skipped += 1;
			continue;
		}

		await sharp(imagePath, { animated: true })
			.webp({ quality: options.quality })
			.toFile(outputPath);
		await unlink(imagePath);
		console.log(
			`convert ${path.relative(process.cwd(), imagePath)} -> ${path.relative(process.cwd(), outputPath)} (source deleted)`,
		);
		converted += 1;
	}

	console.log(
		`\nDone. Converted ${converted} image(s), skipped ${skipped} existing output(s).`,
	);
}

await main().catch((error: unknown) => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
