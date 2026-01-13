# Complete Build & Run Guide 🚀

This guide will take you from zero to a working Conventional Commit CLI tool in 15 minutes.

## 📋 Table of Contents

1. [Quick Start (5 minutes)](#quick-start)
2. [Detailed Build Process](#detailed-build)
3. [Testing](#testing)
4. [Usage Examples](#usage)
5. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Option 1: Copy-Paste Setup (Fastest)

```bash
# 1. Create project
mkdir commit-cli && cd commit-cli

# 2. Create all directories
mkdir -p bin src/{core,prompts,git,config,utils} tests/unit

# 3. Initialize npm
npm init -y

# 4. Install dependencies (this takes ~2 minutes)
npm install chalk@4.1.2 commander@11.0.0 inquirer@8.2.5 simple-git@3.19.0 boxen@5.1.2 ora@5.4.1 cosmiconfig@8.3.0

npm install --save-dev jest@29.0.0

# 5. Copy all the code files from the artifacts I created
# (You'll need to create each file and paste the content)

# 6. Make executable
chmod +x bin/commit.js

# 7. Link globally
npm link

# 8. Test it!
cd /tmp
mkdir test-repo && cd test-repo
git init
echo "test" > file.txt
git add .
commit
```

### Option 2: Clone from Repository (Once Published)

```bash
npm install -g conventional-commit-cli
commit --help
```

---

## Detailed Build Process

### Step 1: Project Setup

```bash
# Create project directory
mkdir commit-cli
cd commit-cli

# Initialize git
git init

# Initialize npm
npm init -y
```

### Step 2: Install All Dependencies

```bash
# Core dependencies
npm install \
  chalk@4.1.2 \
  commander@11.0.0 \
  inquirer@8.2.5 \
  simple-git@3.19.0 \
  boxen@5.1.2 \
  ora@5.4.1 \
  cosmiconfig@8.3.0

# Dev dependencies
npm install --save-dev \
  jest@29.0.0 \
  @types/node@20.0.0
```

### Step 3: Create Directory Structure

```bash
# Create all directories at once
mkdir -p bin
mkdir -p src/core
mkdir -p src/prompts
mkdir -p src/git
mkdir -p src/config
mkdir -p src/utils
mkdir -p tests/unit
```

### Step 4: Create All Files

Create each file with the content from the artifacts:

#### Core Files

1. **package.json** - Copy from artifact
2. **.gitignore** - Copy from artifact
3. **README.md** - Copy from artifact

#### Source Files

4. **bin/commit.js** - CLI entry point
5. **src/index.js** - Main orchestrator
6. **src/config/defaults.js** - Default configuration
7. **src/utils/logger.js** - Logger utility
8. **src/core/validator.js** - Validation logic
9. **src/core/formatter.js** - Formatting logic
10. **src/prompts/questions.js** - Question configurations
11. **src/prompts/interactive.js** - Interactive prompts
12. **src/git/operations.js** - Git operations

#### Test Files

13. **tests/unit/validator.test.js** - Unit tests

### Step 5: Update package.json

Make sure your package.json has these key sections:

```json
{
  "name": "conventional-commit-cli",
  "version": "1.0.0",
  "bin": {
    "commit": "./bin/commit.js"
  },
  "scripts": {
    "test": "jest",
    "dev": "node bin/commit.js"
  }
}
```

### Step 6: Make Binary Executable

```bash
chmod +x bin/commit.js
```

### Step 7: Link for Development

```bash
npm link
```

This creates a global symlink to your local project.

---

## Testing

### Run Unit Tests

```bash
npm test
```

Expected output:

```
PASS  tests/unit/validator.test.js
  Validator
    ✓ should validate a correct commit message
    ✓ should reject empty message
    ✓ should reject invalid type
    ...

Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
```

### Manual Testing

```bash
# 1. Create a test repository
cd /tmp
mkdir test-commit && cd test-commit
git init

# 2. Make some changes
echo "console.log('hello');" > index.js
git add index.js

# 3. Run the tool
commit

# 4. Follow the prompts and commit

# 5. Check the result
git log --oneline
```

---

## Usage Examples

### Example 1: First Time User - Interactive Mode

```bash
$ commit

Repository Status
Branch      : main
Staged      : 2
Modified    : 0
Untracked   : 0
Status      : Dirty

? Select the type of change:
❯ ✨ feat:     A new feature
  🐛 fix:      A bug fix
  📚 docs:     Documentation changes
  ...

? What is the scope of this change? (optional): auth

? Write a short description: add JWT authentication

? Provide a longer description: (Skip)

? Is this a BREAKING CHANGE?: No

? Reference issues: Closes #42

Preview:
┌──────────────────────────────────────┐
│ feat(auth): add JWT authentication  │
│                                      │
│ Closes #42                           │
└──────────────────────────────────────┘

? Commit this message? Yes

✓ Committed: a3f21bc
✓ Successfully committed! 🎉
```

### Example 2: Quick Mode

```bash
$ commit -m "fixed login bug"
✓ Formatted: fix: fixed login bug
✓ Committed! ✓
```

### Example 3: Explicit Type

```bash
$ commit -t feat -o ui -s "add dark mode toggle"
✓ Formatted: feat(ui): add dark mode toggle
✓ Committed! ✓
```

### Example 4: Amend Last Commit

```bash
$ commit amend

Current commit:
  fixed stuff

? What would you like to do?
❯ Reformat (convert to conventional)
  Edit and reformat
  Cancel

✓ Reformatted: fix: resolve issue with authentication
✓ Commit amended! ✓
```

### Example 5: Validate History

```bash
$ commit validate

Validating last 10 commits

✓ a3f21bc - feat(auth): add JWT authentication
✓ b7e89cd - fix(ui): resolve button alignment
✗ c1d45ef - Fixed stuff
    Subject must use imperative mood
✓ d2f56gh - docs: update README
✗ e3g67hi - WIP
    Invalid type "WIP"

──────────────────────────────────────
Valid: 3, Invalid: 2
```

### Example 6: Auto Mode with Suggestions

```bash
$ git add src/auth/*.js
$ commit auto

Analyzing changes...
Files changed: 3
+45 -12

  → Modified: src/auth/login.js
  → Modified: src/auth/middleware.js
  → Added: src/auth/utils.js

Suggested scope based on changes: auth

? Select the type of change: fix
? Use suggested scope "auth"? Yes
? Write a short description: resolve token validation issue
...
```

---

## Troubleshooting

### Issue: "command not found: commit"

**Solution:**

```bash
# Check if linked
npm list -g conventional-commit-cli

# Re-link
npm unlink -g conventional-commit-cli
npm link

# Verify
which commit
```

### Issue: "Not a git repository"

**Solution:**

```bash
# Initialize git
git init

# Or navigate to a git repo
cd /path/to/your/git/repo
```

### Issue: "No staged changes"

**Solution:**

```bash
# Stage your changes first
git add .

# Or stage specific files
git add file1.js file2.js

# Then run commit
commit
```

### Issue: Module import errors

**Solution:**

```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be >= 14.0.0
```

### Issue: Permission errors on Linux/Mac

**Solution:**

```bash
# Make binary executable
chmod +x bin/commit.js

# If npm link fails, try with sudo
sudo npm link
```

### Issue: Tests failing

**Solution:**

```bash
# Make sure all files exist
find src/ -type f

# Run tests with verbose output
npm test -- --verbose

# Run single test file
npm test validator.test.js
```

---

## Verification Checklist

Before considering the build complete:

- [ ] `commit --help` works
- [ ] `commit` opens interactive mode
- [ ] `commit -m "message"` works
- [ ] `commit validate` works
- [ ] `npm test` passes
- [ ] Can commit in a real repository
- [ ] Git log shows formatted commits
- [ ] No console errors

---

## Development Workflow

### Making Changes

```bash
# 1. Make your changes to source files
vim src/core/validator.js

# 2. Test locally
npm test

# 3. Try it in a test repo
cd /tmp/test-repo
commit

# 4. If linked globally, changes are immediate
# (No need to rebuild or relink)
```

### Adding New Features

```bash
# 1. Create new file
touch src/core/new-feature.js

# 2. Write code

# 3. Write tests
touch tests/unit/new-feature.test.js

# 4. Run tests
npm test

# 5. Update documentation
vim README.md
```

---

## Next Steps

### For Development

1. Add more commit types
2. Implement git hooks
3. Add configuration loader
4. Add emoji support
5. Add commit templates

### For Production

1. Increase test coverage
2. Add CI/CD pipeline
3. Create changelog
4. Publish to npm
5. Create website/docs

### For Users

1. Read QUICKSTART.md
2. Try all commands
3. Customize .commitrc.json
4. Share with team
5. Integrate with CI/CD

---

## Quick Command Reference

```bash
# Development
npm test                 # Run tests
npm run test:watch       # Watch mode
npm link                 # Link globally
npm unlink -g <name>     # Unlink

# Usage
commit                   # Interactive
commit -m "msg"          # Quick
commit amend             # Fix last
commit validate          # Check history
commit auto              # Smart mode
commit status            # Show status
commit init              # Create config
commit --help            # Help

# Git
git add .                # Stage all
git add file.js          # Stage file
git log --oneline        # View history
git commit --amend       # Amend (native)
```

---

## Success Indicators

You'll know it's working when:

1. ✅ You can type `commit` anywhere
2. ✅ Interactive prompts appear
3. ✅ Commits are formatted correctly
4. ✅ `git log` shows conventional commits
5. ✅ All tests pass
6. ✅ No console errors
7. ✅ Team members can use it too

---

## Resources

- **Source Code**: All artifacts provided above
- **Documentation**: README.md, QUICKSTART.md
- **Tests**: tests/unit/validator.test.js
- **Configuration**: .commitrc.json (generated)

---

**🎉 Congratulations!**

You've successfully built a production-ready CLI tool. Now go write some beautiful commits!

Need help? Check the troubleshooting section or create an issue on GitHub.

Happy coding! 💻✨
