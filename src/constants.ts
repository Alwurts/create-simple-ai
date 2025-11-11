import type { ProjectConfig } from "./types";

// Default configuration for Phase 1
export const DEFAULT_CONFIG_BASE = {
	projectName: "my-app",
	relativePath: "my-app",
	framework: "nextjs" as const,
	database: "sqlite" as const,
	auth: "better-auth" as const,
	examples: [] as const,
	git: true,
	install: true,
} as const;

// Get default config with package manager detection
export function getDefaultConfig(): Omit<ProjectConfig, "projectDir"> {
	return {
		...DEFAULT_CONFIG_BASE,
		packageManager: "npm", // Will be detected at runtime
	};
}

export const DEFAULT_CONFIG = getDefaultConfig();

// CLI branding
export const CLI_NAME = "create-simple-ai";
export const CLI_DESCRIPTION =
	"Create simple AI-powered full-stack applications";

// Version (would be managed by build process in real project)
export const CLI_VERSION = "0.1.0";

// Template paths
export const TEMPLATES_DIR = "templates";
export const BASE_TEMPLATES_DIR = "templates/base";
export const FRAMEWORK_TEMPLATES_DIR = "templates/frameworks";
export const LIBRARY_TEMPLATES_DIR = "templates/libraries";

// Package manager commands
export const PACKAGE_MANAGER_COMMANDS = {
	npm: {
		install: ["npm", ["install"]],
		add: (deps: string[], dev = false) => [
			"npm",
			["install", ...(dev ? ["-D"] : []), ...deps],
		],
		run: (script: string) => ["npm", ["run", script]],
	},
	pnpm: {
		install: ["pnpm", ["install"]],
		add: (deps: string[], dev = false) => [
			"pnpm",
			["add", ...(dev ? ["-D"] : []), ...deps],
		],
		run: (script: string) => ["pnpm", ["run", script]],
	},
	bun: {
		install: ["bun", ["install"]],
		add: (deps: string[], dev = false) => [
			"bun",
			["add", ...(dev ? ["-D"] : []), ...deps],
		],
		run: (script: string) => ["bun", ["run", script]],
	},
} as const;

// Library dependencies
export const LIBRARY_DEPENDENCIES = {
	nextjs: {
		deps: {
			next: "15.0.0",
			react: "18.0.0",
			"react-dom": "18.0.0",
		},
		devDeps: {
			"@types/react": "18.0.0",
			"@types/react-dom": "18.0.0",
			"@types/node": "20.0.0",
			typescript: "5.0.0",
		},
	},
	shadcn: {
		deps: {
			"class-variance-authority": "0.7.0",
			clsx: "2.0.0",
			"lucide-react": "0.294.0",
			"tailwind-merge": "2.0.0",
			"tailwindcss-animate": "1.0.7",
		},
		devDeps: {
			tailwindcss: "3.4.0",
			autoprefixer: "10.4.16",
			postcss: "8.4.32",
		},
	},
	drizzle: {
		deps: {
			drizzle: "0.29.0",
			"drizzle-kit": "0.20.0",
		},
		devDeps: {},
	},
	"better-auth": {
		deps: {
			"better-auth": "0.2.0",
		},
		devDeps: {},
	},
	hono: {
		deps: {
			hono: "4.0.0",
		},
		devDeps: {},
	},
	biome: {
		devDeps: {
			"@biomejs/biome": "1.5.0",
		},
	},
} as const;
