// src/index.js
// Main orchestrator - ties everything together

const InteractivePrompt = require("./prompts/interactive");
const GitOperations = require("./git/operations");
const Validator = require("./core/validator");
const Formatter = require("./core/formatter");
const logger = require("./utils/logger");
const defaults = require("./config/defaults");

class CommitCLI {
  constructor(config = {}) {
    this.config = { ...defaults, ...config };
    this.git = new GitOperations();
    this.validator = new Validator(this.config.rules);
    this.formatter = new Formatter();
    this.prompt = new InteractivePrompt(this.config);
  }

  /**
   * Run interactive commit mode
   * @returns {Promise<void>}
   */
  async interactive() {
    try {
      // Check if git repo
      if (!(await this.git.isGitRepo())) {
        logger.error("Not a git repository");
        process.exit(1);
      }

      // Check for staged changes
      if (!(await this.git.hasStagedChanges())) {
        logger.warning("No staged changes found");

        const shouldStageAll = await this.confirmStageAll();
        if (shouldStageAll) {
          await this.git.stageAll();
        } else {
          logger.info("Please stage your changes with: git add <files>");
          process.exit(0);
        }
      }

      // Show current status
      await this.git.showStatus();

      // Run interactive prompts
      const result = await this.prompt.run();

      if (!result) {
        process.exit(0);
      }

      // Validate
      const validation = this.validator.validate(result.message);
      if (!validation.valid) {
        logger.error("Validation failed:");
        validation.errors.forEach((err) => logger.error(`  • ${err}`));
        process.exit(1);
      }

      // Commit
      await this.git.commit(result.message);
      logger.success("Successfully committed! 🎉");
    } catch (error) {
      logger.error("Error: " + error.message);
      process.exit(1);
    }
  }

  /**
   * Quick commit with minimal prompts
   * @param {string} message - Optional message
   * @returns {Promise<void>}
   */
  async quick(message = null) {
    try {
      if (!(await this.git.isGitRepo())) {
        logger.error("Not a git repository");
        process.exit(1);
      }

      if (!(await this.git.hasStagedChanges())) {
        logger.warning("No staged changes");
        process.exit(1);
      }

      const result = await this.prompt.runQuick(message);

      if (!result) {
        process.exit(0);
      }

      await this.git.commit(result.message);
      logger.success("Committed! ✓");
    } catch (error) {
      logger.error("Error: " + error.message);
      process.exit(1);
    }
  }

  /**
   * Amend last commit
   * @returns {Promise<void>}
   */
  async amend() {
    try {
      if (!(await this.git.isGitRepo())) {
        logger.error("Not a git repository");
        process.exit(1);
      }

      const lastMessage = await this.git.getLastCommitMessage();

      if (!lastMessage) {
        logger.error("No commits found");
        process.exit(1);
      }

      const result = await this.prompt.runAmend(lastMessage);

      if (!result) {
        process.exit(0);
      }

      await this.git.amendCommit(result.message);
      logger.success("Commit amended! ✓");
    } catch (error) {
      logger.error("Error: " + error.message);
      process.exit(1);
    }
  }

  /**
   * Validate commit history
   * @param {number} count - Number of commits to check
   * @returns {Promise<void>}
   */
  async validateHistory(count = 10) {
    try {
      if (!(await this.git.isGitRepo())) {
        logger.error("Not a git repository");
        process.exit(1);
      }

      const commits = await this.git.getCommitHistory(count);

      logger.title(`Validating last ${commits.length} commits`);

      let validCount = 0;
      let invalidCount = 0;

      commits.forEach((commit) => {
        const validation = this.validator.validate(commit.message);

        if (validation.valid) {
          logger.success(`${commit.hash} - ${commit.message}`);
          validCount++;
        } else {
          logger.error(`${commit.hash} - ${commit.message}`);
          validation.errors.forEach((err) => {
            logger.log(`    ${err}`);
          });
          invalidCount++;
        }
      });

      logger.divider();
      logger.info(`Valid: ${validCount}, Invalid: ${invalidCount}`);

      if (invalidCount > 0) {
        logger.warning(`\nFound ${invalidCount} invalid commit(s)`);
        logger.info("Consider using: commit --amend");
      }
    } catch (error) {
      logger.error("Error: " + error.message);
      process.exit(1);
    }
  }

  /**
   * Commit with auto-suggestions based on changes
   * @returns {Promise<void>}
   */
  async auto() {
    try {
      if (!(await this.git.isGitRepo())) {
        logger.error("Not a git repository");
        process.exit(1);
      }

      if (!(await this.git.hasStagedChanges())) {
        logger.warning("No staged changes");
        process.exit(1);
      }

      logger.title("Analyzing changes...");

      const changedFiles = await this.git.getStagedFiles();
      const diff = await this.git.getDiffSummary();

      logger.info(`Files changed: ${changedFiles.length}`);
      logger.info(`+${diff.additions} -${diff.deletions}`);

      const result = await this.prompt.runWithSuggestions(changedFiles);

      if (!result) {
        process.exit(0);
      }

      await this.git.commit(result.message);
      logger.success("Committed! 🎉");
    } catch (error) {
      logger.error("Error: " + error.message);
      process.exit(1);
    }
  }

  /**
   * Show help information
   */
  showHelp() {
    logger.box(
      `Conventional Commit CLI

Usage:
  commit                    Interactive mode
  commit -m "message"       Quick commit with message
  commit --amend            Amend last commit
  commit --validate         Validate last 10 commits
  commit --auto             Auto-suggest based on changes
  commit --help             Show this help

Examples:
  commit
  commit -m "fix login bug"
  commit --amend
  commit --validate --count 20`,
      { borderColor: "cyan", title: "Help" }
    );
  }

  /**
   * Confirm stage all files
   * @returns {Promise<boolean>}
   */
  async confirmStageAll() {
    const inquirer = require("inquirer");
    const answer = await inquirer.prompt([
      {
        type: "confirm",
        name: "stageAll",
        message: "Would you like to stage all changes?",
        default: false,
      },
    ]);
    return answer.stageAll;
  }
}

module.exports = CommitCLI;
