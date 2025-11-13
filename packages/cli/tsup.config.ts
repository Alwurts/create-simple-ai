import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "tsup";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	entry: ["src/cli.ts"],
	format: ["esm"],
	target: "node18",
	clean: true,
	banner: {
		js: "#!/usr/bin/env node",
	},
	shims: false,
	// Copy the templates directory into the dist folder
	publicDir: path.resolve(__dirname, "../../packages/templates"),
	// Ensure the file is executable
	outExtension() {
		return {
			js: ".js",
		};
	},
	// Copy dotfiles like .gitignore and .env.example that publicDir skips
	async onSuccess() {
		const fs = await import("fs-extra");
		const templateSrc = path.resolve(__dirname, "../../packages/templates");
		const templateDest = path.resolve(__dirname, "dist");

		// Copy important dotfiles that publicDir ignores
		const dotfiles = [".gitignore", ".env.example"];

		for (const dotfile of dotfiles) {
			const src = path.join(templateSrc, "project-starter-nextjs-vercel", dotfile);
			const dest = path.join(templateDest, "project-starter-nextjs-vercel", dotfile);

			if (await fs.pathExists(src)) {
				await fs.copy(src, dest);
				console.log(`✓ Copied ${dotfile} to dist`);
			}
		}
	},
});
