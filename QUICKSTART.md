# Quick Start Guide 🚀

Get up and running with Conventional Commit CLI in under 5 minutes!

## Step 1: Install

```bash
npm install -g conventional-commit-cli
```

## Step 2: Navigate to Your Git Repository

```bash
cd your-project
```

## Step 3: Stage Your Changes

```bash
git add .
# or
git add specific-file.js
```

## Step 4: Run the Tool

```bash
commit
```

## What Happens Next?

You'll see an interactive prompt like this:

```
? Select the type of change:
❯ ✨ feat:     A new feature
  🐛 fix:      A bug fix
  📚 docs:     Documentation changes
  💎 style:    Code style changes
  📦 refactor: Code restructuring
  🚀 perf:     Performance improvements
  🚨 test:     Adding tests
```

### Example Walkthrough

Let's say you fixed a login bug:

```
? Select the type of change: fix
? What is the scope of this change? (optional): auth
? Write a short description: resolve login timeout issue
? Provide a longer description: (optional, press Enter to skip)
? Is this a BREAKING CHANGE? No
? Reference issues: Closes #42

Preview:
┌─────────────────────────────────────────┐
│ fix(auth): resolve login timeout issue │
│                                         │
│ Closes #42                              │
└─────────────────────────────────────────┘

? Commit this message? Yes

✓ Committed: abc1234
✓ Successfully committed! 🎉
```

## Quick Mode (Faster)

If you want speed:

```bash
commit -m "fixed login bug"
```

Auto-formatted to:
```
fix: fixed login bug
```

Or be explicit:

```bash
commit -t fix -o auth -s "resolve login timeout"
```

Result:
```
fix(auth): resolve login timeout
```

## Common Commands

```bash
# Interactive mode (recommended for first-time users)
commit

# Quick commit with auto-formatting
commit -m "your message"

# Fix your last commit
commit amend

# Check if your recent commits follow conventions
commit validate

# Smart suggestions based on your changes
commit auto

# Show git status
commit status

# Get help
commit --help
```

## Tips for Success

1. **Use Imperative Mood**
   - ✅ "add feature" (correct)
   - ❌ "added feature" (wrong)
   - ❌ "adds feature" (wrong)

2. **Keep Subject Short**
   - Maximum 72 characters
   - Be concise and clear

3. **Don't End with Period**
   - ✅ "fix login bug"
   - ❌ "fix login bug."

4. **Start with Lowercase**
   - ✅ "add dark mode"
   - ❌ "Add dark mode"

5. **Choose the Right Type**
   - New feature? → `feat`
   - Bug fix? → `fix`
   - Documentation? → `docs`
   - Just maintaining? → `chore`

## Real-World Examples

### Adding a Feature
```bash
commit
# Select: feat
# Scope: ui
# Subject: add dark mode toggle
# Body: Users can now switch between light and dark themes
# Footer: Closes #156
```

Result:
```
feat(ui): add dark mode toggle

Users can now switch between light and dark themes.

Closes #156
```

### Fixing a Bug
```bash
commit -t fix -o api -s "handle null response from database"
```

Result:
```
fix(api): handle null response from database
```

### Updating Documentation
```bash
commit -m "update README with new examples"
```

Result:
```
docs: update README with new examples
```

## Troubleshooting

### "Not a git repository"
```bash
git init
```

### "No staged changes"
```bash
git add .
# or
git add <file>
```

### Tool not found after install
```bash
# Make sure it's installed globally
npm list -g conventional-commit-cli

# Or reinstall
npm install -g conventional-commit-cli
```

### Permission denied
```bash
# On Linux/Mac, you might need sudo
sudo npm install -g conventional-commit-cli
```

## Next Steps

1. **Customize Configuration**
   ```bash
   commit init
   # Edit .commitrc.json to your liking
   ```

2. **Setup Git Hooks** (Coming Soon)
   - Automatically validate commits before they're created

3. **Integrate with CI/CD**
   - Use conventional commits for automated changelog generation
   - Setup semantic-release for auto-versioning

4. **Team Adoption**
   - Share `.commitrc.json` in your repository
   - Add to team documentation
   - Run `commit validate` in code reviews

## Advanced Usage

### Auto Mode with Smart Suggestions
```bash
git add src/auth/*.js
commit auto
```

The tool will:
- Detect you modified auth files
- Suggest "auth" as scope
- Show what changed
- Help you create the perfect commit

### Validating Team Commits
```bash
# Check last 50 commits
commit validate --count 50

# Use in CI/CD
npm run validate-commits
```

### Amending Mistakes
```bash
# Just committed but message is wrong?
commit amend

# Choose: Reformat or Edit
```

## Need Help?

- 📚 Full docs: [README.md](./README.md)
- 🐛 Report issues: GitHub Issues
- 💬 Ask questions: GitHub Discussions
- 📧 Email support: your.email@example.com

---

**Congratulations!** You're now ready to write professional, conventional commits. 

Happy committing! 🎉