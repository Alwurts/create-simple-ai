import * as p from "@clack/prompts";
import type { Example } from "../types.js";

export async function getExampleChoices(): Promise<Example[]> {
  const examples = await p.multiselect({
    message: "Would you like to include any example templates?",
    options: [
      { value: "todo", label: "Placholder for a todo app" },
      { value: "blog", label: "Placholder for a blog app" },
    ],
    required: false,
  });

  if (p.isCancel(examples)) {
    throw new Error("Operation cancelled");
  }

  return examples as Example[];
}
