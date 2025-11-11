import path from "node:path";
import fs from "fs-extra";
import type { Installer } from "../types.js";

export const honoInstaller: Installer = async config => {
  // Create API directory structure
  const apiDir = path.join(config.projectDir, "app/api");
  await fs.ensureDir(apiDir);

  // Create a basic Hono API route
  const helloRouteDir = path.join(apiDir, "hello");
  await fs.ensureDir(helloRouteDir);

  const routeContent = `import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.json({ message: 'Hello from Hono!' });
});

export default app;
`;

  await fs.writeFile(path.join(helloRouteDir, "route.ts"), routeContent);

  // Create a lib/api directory for shared API utilities
  const libApiDir = path.join(config.projectDir, "lib/api");
  await fs.ensureDir(libApiDir);

  const apiUtils = `import { Hono } from 'hono';
import { cors } from 'hono/cors';

export function createHonoApp() {
  const app = new Hono();

  // Add CORS middleware
  app.use('*', cors());

  return app;
}
`;

  await fs.writeFile(path.join(libApiDir, "index.ts"), apiUtils);
};
