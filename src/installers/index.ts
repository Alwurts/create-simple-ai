import type { Installer } from "../types.js";
import { nextjsInstaller } from "./nextjs.js";

// Registry of all available installers
export const installers: Record<string, Installer> = {
  nextjs: nextjsInstaller,
};
