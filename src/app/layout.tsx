import type { Metadata } from "next";
import {
	Doto,
	JetBrains_Mono,
	Space_Grotesk,
	Space_Mono,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-provider";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});

const displayFont = Doto({
	subsets: ["latin"],
	variable: "--font-display",
});

const uiFont = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-ui",
});

const dataFont = Space_Mono({
	subsets: ["latin"],
	weight: ["400", "700"],
	variable: "--font-data",
});

export const metadata: Metadata = {
	title: "晚空 / Wankong",
	description: "wankong的个人主页",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="zh-CN"
			suppressHydrationWarning
			className={cn(
				"h-full",
				"antialiased",
				displayFont.variable,
				uiFont.variable,
				dataFont.variable,
				"font-mono",
				jetbrainsMono.variable,
			)}
		>
			<body className="relative min-h-full">
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableColorScheme={false}
					enableSystem
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
