# Contributing to create-simple-ai

Thank you for your interest in contributing to `create-simple-ai`! This document provides guidelines and information for contributors.

## Development Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run typecheck
```

## Project Structure

- `packages/cli/` - The main CLI package that gets published to npm
- `packages/templates/` - Project templates that get bundled with the CLI
- `scripts/` - Build and utility scripts

## Testing

See [TESTING.md](./TESTING.md) for detailed testing instructions.

## Contributing Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Add a changeset: `npm run changeset`
4. Make your changes
5. Run tests: `npm test`
6. Submit a pull request

## Changesets

We use [Changesets](https://github.com/changesets/changesets) for version management and changelogs. When making changes that affect the published package:

```bash
npm run changeset
```

Follow the prompts to describe your changes. This will create a changeset file that will be used when releasing new versions.

## Release Process

See [RELEASING.md](./RELEASING.md) for detailed release instructions.

## Code Style

- We use [Biome](https://biomejs.dev/) for linting and formatting
- TypeScript is required for all code
- Follow existing patterns and conventions

## Need Help?

- Check existing issues and pull requests
- Join our discussions
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
