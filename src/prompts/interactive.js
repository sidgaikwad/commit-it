// src/prompts/interactive.js
// Handle interactive CLI prompts

const inquirer = require("inquirer");
const questions = require("./questions");
const Formatter = require("../core/formatter");
const logger = require("../utils/logger");

class InteractivePrompt {
  constructor(config = {}) {
    this.config = config;
    this.formatter = new Formatter();
  }

  /**
   * Run full interactive mode
   * @returns {Promise<Object>} - Commit components
   */
  async run() {
    try {
      const allQuestions = questions.getAll(this.config);
      const answers = await inquirer.prompt(allQuestions);

      // Handle custom scope
      if (answers.customScope) {
        answers.scope = answers.customScope;
      }

      // Build commit components
      const components = {
        type: answers.type,
        scope: answers.scope,
        subject: answers.subject,
        body: answers.body?.trim() || null,
        breaking: answers.breaking || null,
        footer: answers.footer?.trim() || null,
      };

      // Format the message
      const message = this.formatter.format(components);

      // Show preview
      logger.preview(message);

      // Confirm
      if (!answers.confirmCommit) {
        logger.warning("Commit cancelled");
        return null;
      }

      return { message, components };
    } catch (error) {
      if (error.isTtyError) {
        logger.error("Prompt could not be rendered in this environment");
      } else {
        logger.error("An error occurred: " + error.message);
      }
      return null;
    }
  }

  /**
   * Run quick mode with minimal prompts
   * @param {string} rawMessage - Optional pre-filled message
   * @returns {Promise<Object>} - Commit components
   */
  async runQuick(rawMessage = null) {
    try {
      let answers;

      if (rawMessage) {
        // Auto-detect type and format
        const { type, subject } = this.formatter.autoFormat(rawMessage);

        // Confirm with user
        const confirmation = await inquirer.prompt([
          {
            type: "confirm",
            name: "useAutoFormat",
            message: `Auto-formatted as: ${type}: ${subject}\nUse this?`,
            default: true,
          },
        ]);

        if (confirmation.useAutoFormat) {
          answers = { type, subject };
        } else {
          // Fall back to manual prompts
          answers = await inquirer.prompt(questions.getQuick());
        }
      } else {
        // No message provided, ask questions
        answers = await inquirer.prompt(questions.getQuick());
      }

      const components = {
        type: answers.type,
        scope: null,
        subject: answers.subject,
        body: null,
        breaking: null,
        footer: null,
      };

      const message = this.formatter.format(components);
      logger.success(`Formatted: ${message}`);

      return { message, components };
    } catch (error) {
      logger.error("Quick mode error: " + error.message);
      return null;
    }
  }

  /**
   * Run amend mode to fix last commit
   * @param {string} currentMessage - Current commit message
   * @returns {Promise<Object>} - New commit message
   */
  async runAmend(currentMessage) {
    try {
      const amendQuestions = questions.getAmend(currentMessage);
      const answers = await inquirer.prompt(amendQuestions);

      if (answers.amendAction === "cancel") {
        logger.info("Amend cancelled");
        return null;
      }

      let newMessage;

      if (answers.amendAction === "reformat") {
        // Try to parse existing message and reformat
        const detected = this.formatter.autoFormat(currentMessage);
        newMessage = this.formatter.format({
          type: detected.type,
          scope: null,
          subject: detected.subject,
          body: null,
          breaking: null,
          footer: null,
        });
      } else if (answers.amendAction === "edit") {
        // Use edited message and format it
        const detected = this.formatter.autoFormat(answers.editedMessage);
        newMessage = this.formatter.format({
          type: detected.type,
          scope: null,
          subject: detected.subject,
          body: null,
          breaking: null,
          footer: null,
        });
      }

      logger.success(`Reformatted: ${newMessage}`);
      return { message: newMessage };
    } catch (error) {
      logger.error("Amend error: " + error.message);
      return null;
    }
  }

  /**
   * Run with smart suggestions based on git changes
   * @param {Array} changedFiles - Changed file paths
   * @returns {Promise<Object>} - Commit components
   */
  async runWithSuggestions(changedFiles = []) {
    try {
      // Suggest scope based on files
      const suggestedScope = this.formatter.suggestScope(changedFiles);

      if (suggestedScope) {
        logger.info(`Suggested scope based on changes: ${suggestedScope}`);
      }

      // Show changed files
      if (changedFiles.length > 0 && changedFiles.length <= 10) {
        logger.list(
          changedFiles.map((f) => `Modified: ${f}`),
          { color: "gray", symbol: "→" }
        );
      }

      const allQuestions = questions.getAll(this.config);
      const answers = await inquirer.prompt(allQuestions);

      // Use suggested scope if user didn't select custom
      if (!answers.scope && suggestedScope) {
        const useSuggested = await inquirer.prompt([
          {
            type: "confirm",
            name: "useSuggestedScope",
            message: `Use suggested scope "${suggestedScope}"?`,
            default: true,
          },
        ]);

        if (useSuggested.useSuggestedScope) {
          answers.scope = suggestedScope;
        }
      }

      // Handle custom scope
      if (answers.customScope) {
        answers.scope = answers.customScope;
      }

      const components = {
        type: answers.type,
        scope: answers.scope,
        subject: answers.subject,
        body: answers.body?.trim() || null,
        breaking: answers.breaking || null,
        footer: answers.footer?.trim() || null,
      };

      const message = this.formatter.format(components);
      logger.preview(message);

      if (!answers.confirmCommit) {
        logger.warning("Commit cancelled");
        return null;
      }

      return { message, components };
    } catch (error) {
      logger.error("Suggestion mode error: " + error.message);
      return null;
    }
  }

  /**
   * Ask user to fix validation errors
   * @param {Array} errors - Validation errors
   * @returns {Promise<boolean>} - Whether to retry
   */
  async askToFixErrors(errors) {
    const question = questions.getValidationPrompt(errors);
    const answer = await inquirer.prompt([question]);
    return answer.fixErrors;
  }
}

module.exports = InteractivePrompt;
