import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import { shikiOptions } from "./src/lib/mdx-shiki";

const nextConfig: NextConfig = {
	/* config options here */
	output: "export",
	pageExtensions: ["ts", "tsx", "md", "mdx"],
	typedRoutes: true,
	reactCompiler: true,
	images: {
		unoptimized: true,
		remotePatterns: [new URL("https://api.microlink.io")],
	},
};

export default createMDX({
	extension: /\.(md|mdx)$/,
	options: {
		remarkPlugins: ["remark-gfm"],
		rehypePlugins: [["@shikijs/rehype", shikiOptions]],
	},
})(nextConfig);
