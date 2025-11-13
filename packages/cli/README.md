# create-simple-ai

Create simple AI-powered full-stack applications with Next.js, Drizzle, Better Auth, and more.

## Features

- 🚀 **Next.js** - Latest Next.js with App Router
- 🎨 **Tailwind CSS + Shadcn/ui** - Beautiful, accessible UI components
- 🗄️ **Drizzle ORM** - Type-safe database queries (PostgreSQL, MySQL, SQLite)
- 🔐 **Better Auth** - Modern authentication solution
- ⚡ **Hono** - Fast API framework
- 🛠️ **Biome** - Fast linter and formatter
- 📦 **Opinionated** - Sensible defaults, minimal configuration

## Quick Start

```bash
npx create-simple-ai my-app
```

Or with specific options:

```bash
npx create-simple-ai my-app --database postgres --yes
```

## Options

- `--database <type>` - Database type: `postgres` or `sqlite` (default: `postgres`)
- `--yes` - Skip prompts and use defaults
- `--no-git` - Skip Git initialization
- `--no-install` - Skip dependency installation
- `--package-manager <manager>` - Package manager: `npm`, `pnpm`, or `bun` (default: auto-detected)

## What Gets Created

- Next.js app with App Router
- Tailwind CSS configuration
- Drizzle ORM setup with database schema
- Better Auth configuration
- Hono API routes
- Biome configuration
- TypeScript configuration
- All necessary dependencies

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Lint
npm run lint

# Type check
npm run typecheck
```

## Testing

See [TESTING.md](./TESTING.md) for detailed testing instructions.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Add a changeset: `npm run changeset`
4. Make your changes
5. Run tests: `npm test`
6. Submit a pull request

## License

MIT