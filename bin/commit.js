#!/usr/bin/env node

// bin/commit.js
// CLI entry point

const { program } = require("commander");
const CommitCLI = require("../src/index");
const logger = require("../src/utils/logger");
const pkg = require("../package.json");

// Initialize CLI
const cli = new CommitCLI();

// Setup commander
program
  .name("commit")
  .description("Interactive commit message formatter with conventional commits")
  .version(pkg.version || "1.0.0");

// Default command - interactive mode
program.action(async () => {
  await cli.interactive();
});

// Quick commit with message
program
  .option("-m, --message <message>", "Commit message (will be auto-formatted)")
  .option("-t, --type <type>", "Commit type (feat, fix, docs, etc.)")
  .option("-s, --subject <subject>", "Commit subject")
  .option("-o, --scope <scope>", "Commit scope");

// Amend last commit
program
  .command("amend")
  .description("Amend and reformat last commit")
  .action(async () => {
    await cli.amend();
  });

// Validate commit history
program
  .command("validate")
  .description("Validate recent commits")
  .option("-c, --count <number>", "Number of commits to check", "10")
  .action(async (options) => {
    const count = parseInt(options.count) || 10;
    await cli.validateHistory(count);
  });

// Auto mode with suggestions
program
  .command("auto")
  .description("Auto-suggest commit based on changes")
  .action(async () => {
    await cli.auto();
  });

// Show status
program
  .command("status")
  .description("Show repository status")
  .action(async () => {
    const GitOperations = require("../src/git/operations");
    const git = new GitOperations();
    await git.showStatus();
  });

// Initialize config
program
  .command("init")
  .description("Initialize commit-cli in current repository")
  .action(async () => {
    const fs = require("fs").promises;
    const path = require("path");
    const defaults = require("../src/config/defaults");

    try {
      const configPath = path.join(process.cwd(), ".commitrc.json");
      await fs.writeFile(configPath, JSON.stringify(defaults, null, 2));
      logger.success(`Created .commitrc.json`);
      logger.info("You can now customize the configuration");
    } catch (error) {
      logger.error("Failed to create config: " + error.message);
    }
  });

// Parse command line arguments
program.parse(process.argv);

// Handle options from default command
const options = program.opts();

// If message option provided, use quick mode
if (options.message) {
  (async () => {
    await cli.quick(options.message);
  })();
}

// If type and subject provided, use quick format
if (options.type && options.subject) {
  (async () => {
    const Formatter = require("../src/core/formatter");
    const GitOperations = require("../src/git/operations");

    const formatter = new Formatter();
    const git = new GitOperations();

    const message = formatter.format({
      type: options.type,
      scope: options.scope || null,
      subject: options.subject,
      body: null,
      breaking: null,
      footer: null,
    });

    logger.success(`Formatted: ${message}`);

    try {
      await git.commit(message);
      logger.success("Committed! ✓");
    } catch (error) {
      logger.error("Commit failed: " + error.message);
      process.exit(1);
    }
  })();
}
