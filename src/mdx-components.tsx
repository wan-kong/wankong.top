import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "@/components/mdx/code-block";
import { ImageZoom } from "@/components/mdx/image-zoom";

const components: MDXComponents = {
	img: ImageZoom,
	pre: CodeBlock,
};

export function useMDXComponents(): MDXComponents {
	return components;
}
