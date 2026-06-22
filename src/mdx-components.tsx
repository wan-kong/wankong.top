import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { CodeBlock } from "@/components/mdx/code-block";
import { GithubCard } from "@/components/mdx/github-card";
import { ImageZoom } from "@/components/mdx/image-zoom";
import { ScriptInstall } from "@/components/mdx/script-install";

const components: MDXComponents = {
	a: (props: ComponentPropsWithoutRef<"a">) => (
		<a {...props} target="_blank" rel="noreferrer" />
	),
	img: ImageZoom,
	pre: CodeBlock,
	ScriptInstall,
	GithubCard,
};

export function useMDXComponents(): MDXComponents {
	return components;
}
