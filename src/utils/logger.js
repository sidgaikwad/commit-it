// src/utils/logger.js
// Beautiful console output with colors

const chalk = require("chalk");
const boxen = require("boxen");

class Logger {
  success(message) {
    console.log(chalk.green("✓"), chalk.green(message));
  }

  error(message) {
    console.log(chalk.red("✗"), chalk.red(message));
  }

  warning(message) {
    console.log(chalk.yellow("⚠"), chalk.yellow(message));
  }

  info(message) {
    console.log(chalk.blue("ℹ"), chalk.blue(message));
  }

  log(message) {
    console.log(message);
  }

  title(message) {
    console.log(chalk.bold.cyan(`\n${message}\n`));
  }

  box(content, options = {}) {
    const defaultOptions = {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "cyan",
      ...options,
    };
    console.log(boxen(content, defaultOptions));
  }

  preview(commitMessage) {
    const lines = commitMessage.split("\n");
    const formatted = lines.map((line, index) => {
      if (index === 0) {
        // First line - type, scope, subject
        const match = line.match(/^(\w+)(\([\w-]+\))?:\s*(.+)$/);
        if (match) {
          const [, type, scope, subject] = match;
          return (
            chalk.cyan.bold(type) +
            (scope ? chalk.yellow(scope) : "") +
            chalk.white(":") +
            " " +
            chalk.white(subject)
          );
        }
        return chalk.white(line);
      } else if (line.startsWith("BREAKING CHANGE:")) {
        return chalk.red.bold(line);
      } else if (line.match(/^(Closes|Fixes|Refs|Related to)\s+#\d+/)) {
        return chalk.green(line);
      } else {
        return chalk.gray(line);
      }
    });

    this.box(formatted.join("\n"), {
      title: "Preview",
      borderColor: "green",
    });
  }

  table(data) {
    const maxKeyLength = Math.max(...Object.keys(data).map((k) => k.length));

    console.log();
    Object.entries(data).forEach(([key, value]) => {
      const paddedKey = key.padEnd(maxKeyLength);
      console.log(`  ${chalk.cyan(paddedKey)} : ${chalk.white(value)}`);
    });
    console.log();
  }

  divider() {
    console.log(chalk.gray("─".repeat(50)));
  }

  list(items, options = {}) {
    const { color = "white", symbol = "•" } = options;
    console.log();
    items.forEach((item) => {
      console.log(`  ${chalk[color](symbol)} ${chalk[color](item)}`);
    });
    console.log();
  }

  spinner(text) {
    const ora = require("ora");
    return ora(text);
  }

  clear() {
    console.clear();
  }
}

module.exports = new Logger();
