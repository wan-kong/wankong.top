import {
	SiGooglechrome,
	SiGooglechromeHex,
	SiRaycast,
	SiRaycastHex,
} from "@icons-pack/react-simple-icons";
import { Doubao } from "@lobehub/icons";
import { RiShapesLine } from "@remixicon/react";
import type { ComponentType } from "react";

export type Product = {
	slug: string;
	name: string;
	status: string;
	statusTone: "live" | "beta";
	tagline: string;
	description: string;
	platform: string;
	year: string;
	stack: string[];
	githubUrl: string;
	liveUrl?: string;
	icon: ComponentType<{ className?: string; color?: string }>;
	iconColor?: string;
	iconClassName?: string;
	accentClassName: string;
};

const iconFrameClassName = "border-border bg-background";

export const products = [
	{
		slug: "doubao-nomark",
		name: "豆包去水印",
		status: "已上线",
		statusTone: "live",
		tagline: "一键去除豆包生成图片的水印",
		description:
			"在线工具，上传豆包生成的图片即可自动识别并去除水印，支持批量处理和本地处理，保护图片隐私。",
		platform: "Web Tool",
		year: "2026",
		stack: ["Next.js", "TypeScript", "Tailwind CSS", "Image Processing"],
		githubUrl: "https://github.com/wan-kong/doubao-nomark-online",
		liveUrl: "https://doubao.wankong.top",
		icon: Doubao,
		iconClassName: "text-sky-500",
		accentClassName: iconFrameClassName,
	},
	{
		slug: "find-your-repo",
		name: "Find Your Repo",
		status: "已上线",
		statusTone: "live",
		tagline: "从 Git 地址直接定位本地仓库",
		description:
			"一个 Raycast 插件，把复制来的 Git 地址变成可打开的本地路径，适合经常在多个代码目录之间切换的开发工作流。",
		platform: "Raycast Extension",
		year: "2025",
		stack: ["Raycast", "TypeScript", "Git"],
		githubUrl: "https://github.com/wan-kong/find-your-repo",
		icon: SiRaycast,
		iconColor: SiRaycastHex,
		accentClassName: iconFrameClassName,
	},
	{
		slug: "sf-symbols",
		name: "SF Symbols",
		status: "已上线",
		statusTone: "live",
		tagline: "在线预览 Apple's SF Symbols",
		description:
			"面向设计和前端实现的小工具，用更轻的方式检索、预览和确认 SF Symbols，在写界面时少打断一点节奏。",
		platform: "Web Tool",
		year: "2025",
		stack: ["Next.js", "Icon Preview", "Search"],
		githubUrl: "https://github.com/wan-kong/sf-symbols-online",
		liveUrl: "https://sf-symbols-online-web.vercel.app/",
		icon: RiShapesLine,
		iconClassName: "text-fuchsia-500",
		accentClassName: iconFrameClassName,
	},
	{
		slug: "can-i-chat",
		name: "Can I Chat",
		status: "Beta",
		statusTone: "beta",
		tagline: "基于浏览器原生能力的轻量 ChatBox",
		description:
			"用 Chrome 原生 API 和大模型能力做一个尽量直接的聊天入口，重点放在低摩擦交互和可被继续扩展的浏览器侧体验。",
		platform: "Chrome Extension",
		year: "2024",
		stack: ["Chrome API", "LLM", "React"],
		githubUrl: "https://github.com/wan-kong/cani.chat",
		liveUrl: "https://cani-chat.vercel.app/",
		icon: SiGooglechrome,
		iconColor: SiGooglechromeHex,
		accentClassName: iconFrameClassName,
	},
] satisfies Product[];

export function getFeaturedProducts(limit = products.length) {
	return products.slice(0, limit);
}
