import { z } from "zod";

// Supported frameworks (extensible for Phase 2)
export type Framework = "nextjs";

// Supported databases
export type Database = "sqlite" | "postgres" | "mysql";

// Authentication options
export type Auth = "better-auth" | "none";

// Example templates
export type Example = "todo" | "blog" | "none";

// Package managers
export type PackageManager = "npm" | "pnpm" | "bun";

// CLI configuration (raw user input)
export interface CLIOptions {
	projectName?: string;
	database?: Database;
	auth?: Auth;
	examples?: Example[];
	git?: boolean;
	install?: boolean;
	packageManager?: PackageManager;
	yes?: boolean; // Skip prompts, use defaults
}

// Project configuration (processed/final)
export interface ProjectConfig {
	projectName: string;
	projectDir: string;
	framework: Framework;
	database: Database;
	auth: Auth;
	examples: Example[];
	git: boolean;
	install: boolean;
	packageManager: PackageManager;
}

// Installer function signature
export type Installer = (config: ProjectConfig) => Promise<void>;

// Template context for Handlebars
export interface TemplateContext extends ProjectConfig {
	// Additional template variables
	packageManagerCommand: string;
	databaseUrl: string;
	// Framework-specific variables
	nextjs?: {
		appRouter: boolean;
	};
}

// Validation schemas
export const DatabaseSchema = z.enum(["sqlite", "postgres", "mysql"]);
export const AuthSchema = z.enum(["better-auth", "none"]);
export const ExampleSchema = z.enum(["todo", "blog", "none"]);
export const PackageManagerSchema = z.enum(["npm", "pnpm", "bun"]);
export const ProjectNameSchema = z
	.string()
	.min(1, "Project name cannot be empty")
	.max(255, "Project name must be less than 255 characters")
	.refine(
		(name) => name === "." || !name.startsWith("."),
		"Project name cannot start with a dot (except for '.')",
	)
	.refine(
		(name) => name === "." || !name.startsWith("-"),
		"Project name cannot start with a dash",
	)
	.refine((name) => {
		const invalidChars = ["<", ">", ":", '"', "|", "?", "*"];
		return !invalidChars.some((char) => name.includes(char));
	}, "Project name contains invalid characters")
	.refine(
		(name) => name.toLowerCase() !== "node_modules",
		"Project name is reserved",
	);
