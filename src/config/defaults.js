// src/config/defaults.js
// Default configuration for conventional commits

const defaults = {
  types: [
    {
      value: "feat",
      name: "✨ feat:     A new feature",
      emoji: "✨",
    },
    {
      value: "fix",
      name: "🐛 fix:      A bug fix",
      emoji: "🐛",
    },
    {
      value: "docs",
      name: "📚 docs:     Documentation only changes",
      emoji: "📚",
    },
    {
      value: "style",
      name: "💎 style:    Code style changes (formatting, semicolons, etc)",
      emoji: "💎",
    },
    {
      value: "refactor",
      name: "📦 refactor: Code change that neither fixes a bug nor adds a feature",
      emoji: "📦",
    },
    {
      value: "perf",
      name: "🚀 perf:     Performance improvements",
      emoji: "🚀",
    },
    {
      value: "test",
      name: "🚨 test:     Adding or updating tests",
      emoji: "🚨",
    },
    {
      value: "build",
      name: "🛠️  build:    Changes to build system or dependencies",
      emoji: "🛠️",
    },
    {
      value: "ci",
      name: "⚙️  ci:       CI/CD configuration changes",
      emoji: "⚙️",
    },
    {
      value: "chore",
      name: "♻️  chore:    Other changes that don't modify src or test files",
      emoji: "♻️",
    },
    {
      value: "revert",
      name: "⏪ revert:   Reverts a previous commit",
      emoji: "⏪",
    },
  ],

  scopes: [
    // Common scopes - can be customized per project
    "api",
    "ui",
    "db",
    "auth",
    "core",
    "config",
    "deps",
    "docs",
  ],

  // Allow users to enter custom scopes
  allowCustomScopes: true,

  // Allow empty scopes
  allowEmptyScopes: true,

  // Validation rules
  rules: {
    maxSubjectLength: 72,
    minSubjectLength: 3,
    maxLineLength: 100,
    enforceImperative: true,
    subjectCase: "lowercase", // 'lowercase' | 'uppercase' | 'camelcase' | 'none'
    allowBreakingChanges: ["feat", "fix"],
  },

  // Prompt settings
  prompts: {
    skipQuestions: [], // ['scope', 'body', 'breaking', 'footer']
    enableEmoji: true,
  },

  // Auto-detection keywords
  autoDetect: {
    feat: ["add", "create", "implement", "introduce", "new"],
    fix: ["fix", "resolve", "correct", "repair", "patch", "bug"],
    docs: ["document", "readme", "docs", "comment", "documentation"],
    refactor: ["refactor", "restructure", "reorganize", "cleanup"],
    test: ["test", "testing", "spec", "coverage"],
    style: ["format", "styling", "indent", "whitespace", "prettier"],
    chore: ["update", "upgrade", "dependency", "deps", "maintain"],
    perf: ["optimize", "performance", "faster", "speed"],
  },
};

module.exports = defaults;
