# Releasing Guide

This document explains how to release new versions of `create-simple-ai` to npm.

## Overview

We use [Changesets](https://github.com/changesets/changesets) for version management and changelog generation, combined with custom release scripts for full control over the release process.

## Semver Guidelines

Follow [Semantic Versioning](https://semver.org/) when deciding on version bumps:

- **Patch** (`1.2.3` → `1.2.4`): Bug fixes, small improvements, documentation updates
- **Minor** (`1.2.3` → `1.3.0`): New features, new templates, new database support (backwards compatible)
- **Major** (`1.2.3` → `2.0.0`): Breaking changes, major refactors, removing features

### Examples

- **Patch**: Fixing a bug in template generation, updating package versions
- **Minor**: Adding MySQL support, adding new installer, new template files
- **Major**: Changing CLI API, removing database options, changing project structure

## Adding Changesets

Before making a release, you need to add a changeset describing your changes.

### Adding a Changeset

```bash
npm run changeset
```

This will:
1. Ask what type of change (patch/minor/major)
2. Ask for a summary of the change
3. Create a file in `.changeset/` directory

### Changeset Format

The changeset file will look like:
```markdown
---
"create-simple-ai": patch
---

Fixed bug in template processing
```

### When to Add Changesets

- When opening a PR with changes
- Before releasing (if you forgot)
- After merging PRs (if contributor didn't add one)

## Monorepo Setup

This project uses a monorepo structure with multiple packages:

- **`create-simple-ai-mono`** (root): Private workspace root, not published
- **`create-simple-ai`** (packages/cli): The main CLI package that gets published to npm
- **`project-starter-nextjs-vercel`** (packages/templates): Template package, bundled into CLI

### Important Monorepo Notes

1. **Only the CLI package gets versioned and published** - The root and template packages are ignored by changesets
2. **Template changes require changesets for the CLI package** - When you update templates, create a changeset for `create-simple-ai`
3. **When prompted by `npm run changeset`, always select `create-simple-ai`** - This is the only package that gets versioned
4. **Templates are bundled into the CLI package** - They don't need separate versioning

### Example: Updating Templates

```bash
# 1. Make changes to a template file
edit packages/templates/project-starter-nextjs-vercel/src/app/page.tsx

# 2. Create changeset for CLI package
npm run changeset
# Select: create-simple-ai
# Type: patch/minor/major depending on change
# Description: Updated landing page in Next.js template

# 3. Release CLI with updated templates inside
npm run release
```

## Release Process

### Step 1: Pre-Release Checks

Run the pre-release validation:

```bash
npm run pre-release
```

This checks:
- ✅ All tests pass
- ✅ Build succeeds
- ✅ Linting passes
- ✅ Type checking passes
- ✅ Git working directory is clean
- ✅ On correct branch (main/master)
- ✅ Authenticated with npm
- ✅ package.json is valid
- ✅ Templates directory exists

### Step 2: Dry-Run (Recommended)

**Always test with dry-run first!**

```bash
npm run release:dry-run
```

This will:
- Show what version would be released
- Show what files would change
- Show git commands that would run
- Show npm publish command
- **Not make any actual changes**

### Step 3: Release

Once dry-run looks good, run the actual release:

```bash
npm run release
```

This will:
1. Check for pending changesets (prompt to add if none)
2. Run pre-release validation
3. Ask for version type (patch/minor/major/custom)
4. Bump version using changesets
5. Generate changelog
6. Show changelog preview
7. Create git commit and tag
8. Ask for confirmation before publishing to npm
9. Publish to npm

### Step 4: Push to GitHub

After successful release:

```bash
git push
git push --tags
```

## Canary Releases

Canary releases are pre-release versions for testing. They use the format: `1.2.3-canary.abc1234`

### Creating a Canary Release

```bash
# Dry-run first
npm run canary:dry-run

# Actual canary release
npm run canary
```

This will:
1. Generate canary version from current version + commit hash
2. Build the project
3. Publish to npm with `canary` tag
4. Restore original version in package.json

### Installing Canary Versions

Users can install canary versions with:

```bash
npx create-simple-ai@canary my-app
```

## Dry-Run Testing

**All release commands support dry-run for safe testing. Always test with dry-run first!**

### Test Release Process

```bash
# Test full release process (interactive)
npm run release:dry-run

# Test canary release
npm run canary:dry-run

# Test pre-release checks only
npm run pre-release -- --dry-run
```

### What Dry-Run Shows

- ✅ Version changes (current → new)
- ✅ Files that would be modified
- ✅ Git commands that would run
- ✅ NPM publish command
- ✅ Changelog preview
- ✅ Validation results (won't fail even if checks fail)

### Dry-Run Examples

#### Example 1: Testing Patch Release

```bash
$ npm run release:dry-run

🔍 DRY RUN MODE - No changes will be made

Current version: 0.1.0

⚠ No changesets found. You should add a changeset before releasing.
Would you like to add a changeset now? [Yes/No]

# After adding changeset or selecting No:

✨ Will release version: 0.1.1

DRY RUN - Summary of what would happen:
  1. Version bump: 0.1.0 → 0.1.1
  2. Generate changelog
  3. Git commit: "chore(release): 0.1.1"
  4. Git tag: v0.1.1
  5. npm publish --access public

✅ Dry-run completed successfully
```

#### Example 2: Testing Canary Release

```bash
$ npm run canary:dry-run

🔍 DRY RUN MODE - No changes will be made

Current version: 0.1.0
Commit hash: abc1234
Canary version: 0.1.0-canary.abc1234

DRY RUN - Summary of what would happen:
  1. Update package.json version to 0.1.0-canary.abc1234
  2. Build project
  3. Publish to npm with tag "canary"
  4. Restore original version in package.json

✅ Dry-run completed successfully
```

#### Example 3: Testing Pre-Release Checks

```bash
$ npm run pre-release -- --dry-run

🔍 Running pre-release checks...

(DRY RUN MODE - Checks will run but won't fail)

✓ Tests pass
✓ Build succeeds
✓ Linting passes
✓ Type checking passes
✓ Git working directory clean
✓ On correct branch (main/master)
✓ NPM authenticated
✓ package.json is valid
✓ Templates directory exists

✅ All 9 checks passed!
```

### Why Use Dry-Run?

1. **Safety** - See what would happen without making changes
2. **Learning** - Understand the release process
3. **Debugging** - Identify issues before actual release
4. **Confidence** - Verify everything works before publishing

## Manual Release Steps

If you need to do a manual release:

### 1. Add Changeset

```bash
npm run changeset
```

### 2. Version Bump

```bash
npm run changeset:version
```

This updates:
- `package.json` version
- `CHANGELOG.md`

### 3. Review Changes

```bash
git diff
```

Review the changes to package.json and CHANGELOG.md

### 4. Commit and Tag

```bash
git add .
git commit -m "chore(release): 1.2.3"
git tag v1.2.3
```

### 5. Publish

```bash
npm publish --access public
```

### 6. Push

```bash
git push
git push --tags
```

## Troubleshooting

### "No changesets present"

**Problem:** Trying to release but no changesets found.

**Solution:**
```bash
npm run changeset
# Follow prompts to add a changeset
npm run release
```

### "Tests failed"

**Problem:** Pre-release checks fail.

**Solution:**
```bash
# Run tests to see errors
npm run test:run

# Fix issues, then retry
npm run release
```

### "Not authenticated with npm"

**Problem:** Not logged into npm.

**Solution:**
```bash
npm login
# Enter your npm credentials
npm run release
```

### "Uncommitted changes"

**Problem:** Git working directory has uncommitted changes.

**Solution:**
```bash
# Commit or stash changes
git add .
git commit -m "Your changes"
# OR
git stash

npm run release
```

### "Version already exists"

**Problem:** Trying to publish a version that's already on npm.

**Solution:**
- For regular releases: Bump to next version
- For canary: Make a new commit (changes commit hash)

### "Wrong branch"

**Problem:** Not on main/master branch.

**Solution:**
```bash
git checkout main
npm run release
```

### "Changeset asks for wrong package"

**Problem:** When running `npm run changeset`, you see packages you don't expect (like root or templates).

**Solution:**
```bash
# In monorepo setup, always select "create-simple-ai" when prompted
npm run changeset
# Select: create-simple-ai (the CLI package)
# Only this package gets versioned and published
```

### "Template changes don't appear in release"

**Problem:** You updated templates but they don't appear in the published package.

**Solution:**
Templates are bundled into the CLI package. Make sure to create a changeset for the CLI package:

```bash
# After updating templates
npm run changeset
# Select: create-simple-ai
# Type: patch/minor/major
# Description: Updated templates - [describe changes]
```

## CI/CD Integration (Optional)

You can set up GitHub Actions to automate releases:

### Example Workflow

```yaml
name: Release

on:
  push:
    branches:
      - main

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          registry-url: https://registry.npmjs.org/
      - run: npm ci
      - run: npm run build
      - run: npm run test:run
      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          publish: npm publish --access public
          version: npm run changeset:version
```

## Best Practices

1. **Always dry-run first** - Test releases before making them
2. **Add changesets early** - When opening PRs, not just before release
3. **Review changelog** - Check generated changelog before publishing
4. **Test canary releases** - Use canary releases to test before official release
5. **Keep main clean** - Only release from main/master branch
6. **Tag releases** - Always create git tags for releases
7. **Document breaking changes** - Clearly document in changeset if major release

## Quick Reference

```bash
# Add a changeset
npm run changeset

# Check pending changesets
npm run changeset:status

# Dry-run release
npm run release:dry-run

# Release
npm run release

# Dry-run canary
npm run canary:dry-run

# Canary release
npm run canary

# Pre-release checks only
npm run pre-release
```

## Questions?

If you have questions about the release process, please open an issue or check the [Changesets documentation](https://github.com/changesets/changesets).

