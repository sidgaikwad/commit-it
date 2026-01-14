# Conventional Commit CLI 🚀

An interactive CLI tool that makes writing conventional commits fast, easy, and consistent.

## ✨ Features

- 🎯 **Interactive Mode** - Beautiful prompts guide you through creating perfect commits
- ⚡ **Quick Mode** - Fast commits with auto-formatting
- 🔧 **Auto-Detection** - Smart type detection based on your message
- 📝 **Validation** - Real-time validation against conventional commit rules
- 🎨 **Preview** - See formatted commit before committing
- 🔄 **Amend Support** - Fix and reformat your last commit
- 📊 **History Validation** - Check if your past commits follow conventions
- 🤖 **Smart Suggestions** - Suggests scope based on changed files
- ⚙️ **Configurable** - Customize types, scopes, and rules
- 🎨 **Beautiful Output** - Colorful, easy-to-read interface

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g conventional-commit-cli
```

### Local Installation

```bash
npm install --save-dev conventional-commit-cli
```

### From Source

```bash
git clone https://github.com/yourusername/conventional-commit-cli.git
cd conventional-commit-cli
npm install
npm link
```

## 🚀 Usage

### Interactive Mode (Default)

```bash
commit
```

This will:

1. Check for staged changes
2. Guide you through type, scope, subject, body, breaking changes, and footer
3. Show a preview of your formatted commit
4. Commit with the formatted message

### Quick Mode

```bash
# Auto-format a message
commit -m "fixed login bug"
# Output: fix: fixed login bug

# Specify type and subject
commit -t feat -s "add dark mode"
# Output: feat: add dark mode

# With scope
commit -t fix -o ui -s "button alignment issue"
# Output: fix(ui): button alignment issue
```

### Amend Last Commit

```bash
commit amend
```

This lets you:

- Reformat your last commit to conventional format
- Edit and reformat
- Preview changes before amending

### Validate Commit History

```bash
# Validate last 10 commits
commit validate

# Validate last 20 commits
commit validate --count 20
```

### Auto Mode (Smart Suggestions)

```bash
commit auto
```

Analyzes your staged changes and suggests:

- Appropriate commit type
- Scope based on changed files
- Shows file changes and diff stats

### Other Commands

```bash
# Show repository status
commit status

# Initialize config file
commit init

# Show help
commit --help
```

## 📖 Conventional Commits Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons)
- **refactor**: Code changes that neither fix bugs nor add features
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Changes to build system or dependencies
- **ci**: CI/CD configuration changes
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Example Commits

```bash
feat(auth): add JWT token validation

Implemented middleware to validate JWT tokens on protected routes.
Added tests for token expiration and invalid signatures.

Closes #123
```

```bash
fix(ui): resolve button click handler issue

The submit button wasn't responding to clicks on mobile devices.
Updated event listener to use touchstart as fallback.
```

```bash
docs: update installation instructions

Added section for npm global installation and troubleshooting.
```

## ⚙️ Configuration

Create a `.commitrc.json` file in your project root:

```bash
commit init
```

### Example Configuration

```json
{
  "types": [
    { "value": "feat", "name": "✨ feat: A new feature" },
    { "value": "fix", "name": "🐛 fix: A bug fix" }
  ],
  "scopes": ["api", "ui", "db", "auth"],
  "allowCustomScopes": true,
  "allowEmptyScopes": true,
  "rules": {
    "maxSubjectLength": 72,
    "minSubjectLength": 3,
    "enforceImperative": true,
    "subjectCase": "lowercase"
  },
  "prompts": {
    "skipQuestions": ["body"],
    "enableEmoji": true
  }
}
```

## 🎯 Why Use This?

### For Developers

- ⏱️ **Save Time**: 30 seconds vs 2 minutes per commit
- 📚 **Learn by Doing**: Interactive prompts teach conventional commits
- 🎨 **Better History**: Clean, searchable git log
- 🔍 **Easy Debugging**: Find that bug fix from 6 months ago in seconds

### For Teams

- 📊 **Automated Changelogs**: Generate release notes automatically
- 🤖 **Semantic Versioning**: Auto-bump versions based on commit types
- 👥 **Consistency**: Everyone writes commits the same way
- 📈 **Better Reviews**: Clear commit messages speed up code reviews

### For Projects

- 🔄 **CI/CD Integration**: Trigger different workflows based on commit type
- 📋 **Audit Trails**: Easy compliance and tracking
- 🎯 **Search & Filter**: `git log --grep="^fix(auth):"`
- 📊 **Project Insights**: What types of work are we doing?

## 🛠️ Development

### Setup

```bash
git clone https://github.com/yourusername/conventional-commit-cli.git
cd conventional-commit-cli
npm install
npm link
```

### Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Project Structure

```
commit-cli/
├── bin/
│   └── commit.js           # CLI entry point
├── src/
│   ├── core/
│   │   ├── parser.js       # Parse commits
│   │   ├── validator.js    # Validate commits
│   │   ├── formatter.js    # Format commits
│   │   └── templates.js    # Templates
│   ├── prompts/
│   │   ├── interactive.js  # Interactive prompts
│   │   └── questions.js    # Question configs
│   ├── git/
│   │   ├── operations.js   # Git commands
│   │   └── hooks.js        # Git hooks
│   ├── config/
│   │   ├── loader.js       # Load config
│   │   └── defaults.js     # Defaults
│   ├── utils/
│   │   ├── logger.js       # Console output
│   │   └── helpers.js      # Utilities
│   └── index.js            # Main orchestrator
├── tests/
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`commit -m "feat: add amazing feature"`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT © siddharth

## 🙏 Acknowledgments

- Inspired by [Commitizen](https://github.com/commitizen/cz-cli)
- Based on [Conventional Commits](https://www.conventionalcommits.org/)
- Built with [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)

## 📞 Support

- 🐛 [Report Issues](https://github.com/yourusername/conventional-commit-cli/issues)
- 💬 [Discussions](https://github.com/yourusername/conventional-commit-cli/discussions)
- 📧 Email: your.email@example.com

---

Made with ❤️ by developers, for developers
