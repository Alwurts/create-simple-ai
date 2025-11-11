import * as p from "@clack/prompts";
import type { Auth } from "../types.js";

export async function getAuthChoice(): Promise<Auth> {
	const auth = await p.select({
		message: "What authentication provider would you like to use?",
		options: [
			{ value: "better-auth", label: "Better Auth (recommended)" },
			{ value: "none", label: "None - I'll handle auth myself" },
		],
		initialValue: "better-auth",
	});

	if (p.isCancel(auth)) {
		throw new Error("Operation cancelled");
	}

	return auth as Auth;
}
