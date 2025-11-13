import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		testTimeout: 30000, // 30 seconds for integration tests
		pool: "threads", // Use threads instead of forks for better sandbox compatibility
		poolOptions: {
			threads: {
				singleThread: true, // Run all tests in a single thread
			},
		},
	},
});
