import { defineConfig } from "tsup";

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
	publicDir: "../../packages/templates",
	// Ensure the file is executable
	outExtension() {
		return {
			js: ".js",
		};
	},
});
