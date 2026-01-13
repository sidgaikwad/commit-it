// src/prompts/questions.js
// Interactive prompt questions configuration

const defaults = require("../config/defaults");
const Validator = require("../core/validator");

const validator = new Validator();

const questions = {
  /**
   * Get questions for interactive mode
   * @param {Object} config - Configuration object
   * @returns {Array} - Array of inquirer questions
   */
  getAll(config = {}) {
    const types = config.types || defaults.types;
    const scopes = config.scopes || defaults.scopes;
    const allowCustomScopes = config.allowCustomScopes !== false;
    const skipQuestions = config.skipQuestions || [];

    const allQuestions = [
      // Type selection
      {
        type: "list",
        name: "type",
        message: "Select the type of change:",
        choices: types.map((t) => ({
          name: t.name,
          value: t.value,
        })),
        when: () => !skipQuestions.includes("type"),
      },

      // Scope selection/input
      {
        type: allowCustomScopes ? "autocomplete" : "list",
        name: "scope",
        message: "What is the scope of this change? (optional)",
        choices: () => {
          const choices = scopes.map((s) => ({ name: s, value: s }));
          if (allowCustomScopes) {
            choices.push({
              name: "custom (type your own)",
              value: "__custom__",
            });
          }
          choices.push({ name: "empty (no scope)", value: null });
          return choices;
        },
        when: () => !skipQuestions.includes("scope"),
      },

      // Custom scope input
      {
        type: "input",
        name: "customScope",
        message: "Enter custom scope:",
        when: (answers) => answers.scope === "__custom__",
        validate: (input) => {
          if (!input || input.trim() === "") {
            return 'Scope cannot be empty. Use "empty" option if no scope needed.';
          }
          if (!/^[a-z0-9-]+$/i.test(input)) {
            return "Scope must contain only letters, numbers, and hyphens";
          }
          return true;
        },
      },

      // Subject
      {
        type: "input",
        name: "subject",
        message: "Write a short description (imperative mood):",
        validate: (input) => {
          if (!input || input.trim() === "") {
            return "Subject is required";
          }
          if (input.length > 72) {
            return `Subject is too long (${input.length}/72 chars)`;
          }
          if (input.endsWith(".")) {
            return "Subject should not end with a period";
          }
          if (!validator.isImperative(input)) {
            return 'Use imperative mood (e.g., "add" not "adds" or "added")';
          }
          return true;
        },
        filter: (input) => {
          // Auto-fix common issues
          let fixed = input.trim();
          fixed = fixed.charAt(0).toLowerCase() + fixed.slice(1);
          fixed = fixed.replace(/\.$/, "");
          return fixed;
        },
      },

      // Body
      {
        type: "editor",
        name: "body",
        message: "Provide a longer description (optional). Opens editor:",
        when: () => !skipQuestions.includes("body"),
      },

      // Breaking change
      {
        type: "confirm",
        name: "isBreaking",
        message: "Is this a BREAKING CHANGE?",
        default: false,
        when: (answers) => {
          const allowedTypes = config.allowBreakingChanges || ["feat", "fix"];
          return (
            !skipQuestions.includes("breaking") &&
            allowedTypes.includes(answers.type)
          );
        },
      },

      // Breaking change description
      {
        type: "input",
        name: "breaking",
        message: "Describe the breaking change:",
        when: (answers) => answers.isBreaking === true,
        validate: (input) => {
          if (!input || input.trim() === "") {
            return "Breaking change description is required";
          }
          return true;
        },
      },

      // Footer (issues, refs)
      {
        type: "input",
        name: "footer",
        message: 'Reference issues/PRs (e.g., "Closes #123, Refs #456"):',
        when: () => !skipQuestions.includes("footer"),
        validate: (input) => {
          if (!input || input.trim() === "") {
            return true; // Optional
          }
          // Basic validation for issue references
          const validPattern = /^(Closes|Fixes|Refs|Related to)\s+#\d+/i;
          if (!validPattern.test(input)) {
            return 'Format: "Closes #123" or "Fixes #123, Refs #456"';
          }
          return true;
        },
      },

      // Confirmation
      {
        type: "confirm",
        name: "confirmCommit",
        message: "Commit this message?",
        default: true,
      },
    ];

    return allQuestions;
  },

  /**
   * Get questions for quick mode (minimal)
   * @returns {Array} - Minimal question set
   */
  getQuick() {
    return [
      {
        type: "list",
        name: "type",
        message: "Type:",
        choices: defaults.types.slice(0, 5).map((t) => ({
          name: t.value,
          value: t.value,
        })),
      },
      {
        type: "input",
        name: "subject",
        message: "Subject:",
        validate: (input) => {
          if (!input || input.trim() === "") {
            return "Subject is required";
          }
          return true;
        },
      },
    ];
  },

  /**
   * Get question for amend mode
   * @param {string} currentMessage - Current commit message
   * @returns {Array} - Amend questions
   */
  getAmend(currentMessage) {
    return [
      {
        type: "list",
        name: "amendAction",
        message: `Current commit:\n  ${currentMessage}\n\nWhat would you like to do?`,
        choices: [
          { name: "Reformat (convert to conventional)", value: "reformat" },
          { name: "Edit and reformat", value: "edit" },
          { name: "Cancel", value: "cancel" },
        ],
      },
      {
        type: "editor",
        name: "editedMessage",
        message: "Edit the commit message:",
        default: currentMessage,
        when: (answers) => answers.amendAction === "edit",
      },
    ];
  },

  /**
   * Get validation error display question
   * @param {Array} errors - Validation errors
   * @returns {Object} - Confirmation question
   */
  getValidationPrompt(errors) {
    return {
      type: "confirm",
      name: "fixErrors",
      message: `Found ${errors.length} validation error(s):\n${errors
        .map((e) => `  • ${e}`)
        .join("\n")}\n\nWould you like to fix them?`,
      default: true,
    };
  },
};

module.exports = questions;
