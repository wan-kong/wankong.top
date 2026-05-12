import {
	SiGit,
	SiGitHex,
	SiGooglechrome,
	SiGooglechromeHex,
	SiNextdotjs,
	SiRaycast,
	SiRaycastHex,
	SiReact,
	SiReactHex,
	SiTailwindcss,
	SiTailwindcssHex,
	SiTypescript,
	SiTypescriptHex,
} from "@icons-pack/react-simple-icons";
import { RiAiGenerate, RiImageEditLine, RiSearchLine, RiShapesLine } from "@remixicon/react";
import {
	SkillBadge,
	type SkillBadgeItem,
} from "@/components/skill-badge/skill-badge";
import type { Product } from "@/lib/products";

const TECH_BADGES: Record<string, SkillBadgeItem> = {
	"Chrome API": {
		icon: <SiGooglechrome color={SiGooglechromeHex} />,
		name: "Chrome API",
	},
	Git: {
		icon: <SiGit color={SiGitHex} />,
		name: "Git",
	},
	"Icon Preview": {
		icon: <RiShapesLine />,
		name: "Icon Preview",
	},
	"Image Processing": {
		icon: <RiImageEditLine />,
		name: "Image Processing",
	},
	LLM: {
		icon: <RiAiGenerate />,
		name: "LLM",
	},
	"Next.js": {
		icon: <SiNextdotjs className="text-black dark:text-white" />,
		name: "Next.js",
	},
	Raycast: {
		icon: <SiRaycast color={SiRaycastHex} />,
		name: "Raycast",
	},
	React: {
		icon: <SiReact color={SiReactHex} />,
		name: "React",
	},
	Search: {
		icon: <RiSearchLine />,
		name: "Search",
	},
	"Tailwind CSS": {
		icon: <SiTailwindcss color={SiTailwindcssHex} />,
		name: "Tailwind CSS",
	},
	TypeScript: {
		icon: <SiTypescript color={SiTypescriptHex} />,
		name: "TypeScript",
	},
};

export function ProductTechStack({ product }: { product: Product }) {
	return (
		<ul className="flex flex-wrap gap-2">
			{product.stack.map((techName) => (
				<li key={techName}>
					<SkillBadge
						size="sm"
						skill={TECH_BADGES[techName] ?? fallbackSkill(techName)}
					/>
				</li>
			))}
		</ul>
	);
}

function fallbackSkill(name: string): SkillBadgeItem {
	return {
		icon: <RiShapesLine />,
		name,
	};
}
