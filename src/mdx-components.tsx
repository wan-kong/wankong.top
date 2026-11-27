import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { Callout } from "@/components/mdx/callout";
import { CodeBlock } from "@/components/mdx/code-block";
import { ConsoleView } from "@/components/mdx/console-view";
import {
	ScrollFadeDemo,
	ShimmerDemo,
} from "@/components/mdx/css-scroll-fade-shimmer-demo";
import { ExpenseBreakdown } from "@/components/mdx/expense-breakdown";
import { FlightCard } from "@/components/mdx/flight-card";
import { GithubCard } from "@/components/mdx/github-card";
import { GithubRelease } from "@/components/mdx/github-release";
import { HikingRoute } from "@/components/mdx/hiking-route";
import { ImageZoom } from "@/components/mdx/image-zoom";
import { Kbd } from "@/components/mdx/kbd";
import { NetworkInspector } from "@/components/mdx/network-inspector";
import { NetworkPanel } from "@/components/mdx/network-panel";
import { Notice } from "@/components/mdx/notice";
import {
	PhotoGallery,
	type PhotoGalleryProps,
} from "@/components/mdx/photo-gallery";
import { JourneyTimeline } from "@/components/mdx/project-story";
import { ScriptInstall } from "@/components/mdx/script-install";
import { Step, Steps } from "@/components/mdx/steps";
import { TravelMap } from "@/components/mdx/travel-map";
import { TravelOverview } from "@/components/mdx/travel-overview";

const components: MDXComponents = {
	a: (props: ComponentPropsWithoutRef<"a">) => (
		<a {...props} target="_blank" rel="noreferrer" />
	),
	img: ImageZoom,
	pre: CodeBlock,
	ScriptInstall,
	GithubCard,
	GithubRelease,
	ImageZoom,
	Callout,
	Steps,
	Step,
	Kbd,
	NetworkPanel,
	NetworkInspector,
	ConsoleView,
	Notice,
	JourneyTimeline,
	ScrollFadeDemo,
	ShimmerDemo,
	PhotoGallery,
	TravelOverview,
	TravelMap,
	FlightCard,
	HikingRoute,
	ExpenseBreakdown,
};

export function useMDXComponents(album?: string): MDXComponents {
	if (!album) {
		return components;
	}

	return {
		...components,
		PhotoGallery: (props: PhotoGalleryProps) => (
			<PhotoGallery album={album} {...props} />
		),
	};
}
