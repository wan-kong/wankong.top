import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { CodeBlock } from "@/components/mdx/code-block";
import { ImageZoom } from "@/components/mdx/image-zoom";

const components: MDXComponents = {
	a: (props: ComponentPropsWithoutRef<"a">) => (
		<a {...props} target="_blank" rel="noreferrer" />
	),
	img: ImageZoom,
	pre: CodeBlock,
};

export function useMDXComponents(): MDXComponents {
	return components;
}
