import fs from 'fs-extra';
import type { PackageManager } from '../types.js';

export async function detectPackageManager(): Promise<PackageManager> {
  // Check for lock files in priority order
  if (await fs.pathExists('bun.lockb')) return 'bun';
  if (await fs.pathExists('pnpm-lock.yaml')) return 'pnpm';
  if (await fs.pathExists('yarn.lock')) return 'npm'; // yarn uses npm-compatible lock
  if (await fs.pathExists('package-lock.json')) return 'npm';

  return 'npm'; // default fallback
}

export async function getPackageManagerCommand(packageManager: PackageManager, command: 'install' | 'run', script?: string): Promise<string[]> {
  const commands = {
    npm: {
      install: ['npm', 'install'],
      run: ['npm', 'run', script || ''],
    },
    pnpm: {
      install: ['pnpm', 'install'],
      run: ['pnpm', 'run', script || ''],
    },
    bun: {
      install: ['bun', 'install'],
      run: ['bun', 'run', script || ''],
    },
  };

  return commands[packageManager][command];
}
