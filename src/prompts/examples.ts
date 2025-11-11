import * as p from '@clack/prompts';
import type { Example } from '../types.js';

export async function getExampleChoices(): Promise<Example[]> {
  const examples = await p.multiselect({
    message: 'Would you like to include any example templates?',
    options: [
      { value: 'todo', label: 'Todo App - Complete CRUD example' },
      { value: 'blog', label: 'Blog - Content management example' },
    ],
    required: false,
  });

  if (p.isCancel(examples)) {
    throw new Error('Operation cancelled');
  }

  return examples as Example[];
}
