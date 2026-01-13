# Complete Setup Guide 📦

Step-by-step guide to build and deploy the Conventional Commit CLI tool.

## Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0
- Git installed

## 🏗️ Building from Source

### 1. Clone or Create Project

```bash
mkdir conventional-commit-cli
cd conventional-commit-cli
```

### 2. Create Project Structure

```bash
# Create directories
mkdir -p bin src/core src/prompts src/git src/config src/utils tests/unit

# Create files
touch bin/commit.js
touch src/index.js
touch src/core/{parser.js,validator.js,formatter.js,templates.js}
touch src/prompts/{interactive.js,questions.js}
touch src/git/{operations.js,hooks.js}
touch src/config/{loader.js,defaults.js}
touch src/utils/{logger.js,helpers.js}
touch tests/unit/validator.test.js
touch package.json README.md .gitignore
```

### 3. Initialize Package

```bash
npm init -y
```

### 4. Install Dependencies

```bash
# Production dependencies
npm install chalk@4.1.2 commander@11.0.0 inquirer@8.2.5 simple-git@3.19.0 boxen@5.1.2 ora@5.4.1 cosmiconfig@8.3.0

# Development dependencies
npm install --save-dev jest@29.0.0 @types/node@20.0.0 eslint@8.0.0
```

### 5. Copy All Source Files

Copy the content from all the artifacts I've created above into their respective files:

- `src/config/defaults.js` - Default configuration
- `src/utils/logger.js` - Logger utility
- `src/core/validator.js` - Validation logic
- `src/core/formatter.js` - Formatting logic
- `src/prompts/questions.js` - Question configurations
- `src/prompts/interactive.js` - Interactive prompts
- `src/git/operations.js` - Git operations
- `src/index.js` - Main orchestrator
- `bin/commit.js` - CLI entry point
- `package.json` - Package configuration
- `README.md` - Documentation
- `.gitignore` - Git ignore rules
- `tests/unit/validator.test.js` - Unit tests

### 6. Make CLI Executable

```bash
chmod +x bin/commit.js
```

### 7. Link Locally

```bash
npm link
```

Now you can use `commit` command globally on your system!

## 🧪 Testing the Installation

### 1. Check if it works

```bash
commit --help
```

You should see the help menu.

### 2. Test in a Git Repository

```bash
# Go to any git repository
cd ~/your-project

# Make some changes
echo "test" >> test.txt
git add test.txt

# Run the tool
commit
```

### 3. Run Unit Tests

```bash
cd conventional-commit-cli
npm test
```

## 📦 Publishing to npm

### 1. Create npm Account

Go to [npmjs.com](https://www.npmjs.com) and create an account.

### 2. Login via CLI

```bash
npm login
```

### 3. Update Package Info

Edit `package.json`:

- Change `name` to something unique (check on npm)
- Update `author`
- Update `repository` URLs
- Update `bugs` URL
- Update `homepage` URL

### 4. Publish

```bash
# First, test the package locally
npm pack

# Then publish
npm publish
```

### 5. Update Version

For future updates:

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major

# Then publish
npm publish
```

## 🔧 Development Setup

### Hot Reload Development

```bash
# Use nodemon for auto-restart
npm install -g nodemon

# Watch and run
nodemon bin/commit.js
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### Linting

```bash
# Add ESLint config
cat > .eslintrc.json << 'EOF'
{
  "env": {
    "node": true,
    "es2021": true,
    "jest": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12
  },
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "off"
  }
}
EOF

# Run linter
npx eslint src/
```

## 🚀 Distribution

### Creating Releases

1. **Update Version**

   ```bash
   npm version patch -m "Release v%s"
   ```

2. **Create Git Tag**

   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

3. **Publish to npm**

   ```bash
   npm publish
   ```

4. **Create GitHub Release**
   - Go to GitHub repository
   - Click "Releases"
   - Create new release with tag
   - Add release notes

### Binary Distribution (Optional)

To create standalone binaries:

```bash
# Install pkg
npm install -g pkg

# Create binaries
pkg package.json --targets node14-linux-x64,node14-macos-x64,node14-win-x64

# Creates:
# - commit-linux
# - commit-macos
# - commit-win.exe
```

## 🐛 Troubleshooting

### "Command not found: commit"

```bash
# Unlink and relink
npm unlink -g conventional-commit-cli
npm link
```

### "Permission denied"

```bash
# Make sure binary is executable
chmod +x bin/commit.js

# On Windows, make sure Node.js has proper permissions
```

### "Module not found"

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Tests failing

```bash
# Make sure all files are created
ls -la src/core/
ls -la src/prompts/
ls -la src/git/

# Check Node version
node --version  # Should be >= 14.0.0
```

## 📊 Project Checklist

Before releasing:

- [ ] All source files created
- [ ] Dependencies installed
- [ ] Tests pass (`npm test`)
- [ ] README.md complete
- [ ] package.json updated with correct info
- [ ] .gitignore in place
- [ ] Binary is executable
- [ ] Tested in real git repository
- [ ] npm login completed
- [ ] Unique package name chosen
- [ ] Version set correctly

## 🎯 Next Steps

1. **Enhance Features**

   - Add git hook installation
   - Add more commit types
   - Add emoji support
   - Add commit templates

2. **Improve Testing**

   - Add integration tests
   - Add E2E tests
   - Increase coverage to 90%+

3. **Better UX**

   - Add spinner for git operations
   - Add progress indicators
   - Better error messages
   - Add color themes

4. **Documentation**
   - Add video tutorials
   - Create blog post
   - Add more examples
   - Create contribution guide

## 📚 Resources

- [Conventional Commits Spec](https://www.conventionalcommits.org/)
- [npm Publishing Guide](https://docs.npmjs.com/cli/v8/commands/npm-publish)
- [Commander.js Docs](https://github.com/tj/commander.js)
- [Inquirer.js Docs](https://github.com/SBoudrias/Inquirer.js)
- [Simple-git Docs](https://github.com/steveukx/git-js)

## 🤝 Need Help?

If you encounter any issues during setup:

1. Check Node.js version: `node --version`
2. Check npm version: `npm --version`
3. Clear npm cache: `npm cache clean --force`
4. Delete `node_modules` and reinstall
5. Check file permissions
6. Open an issue on GitHub

---

**You're all set!** 🎉 Happy building!
