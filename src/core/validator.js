// src/core/validator.js
// Validate commit messages against conventional commit rules

const defaults = require("../config/defaults");

class Validator {
  constructor(config = {}) {
    this.config = { ...defaults.rules, ...config };
    this.validTypes = defaults.types.map((t) => t.value);
  }

  /**
   * Validate a complete commit message
   * @param {string} message - The commit message
   * @returns {Object} - { valid: boolean, errors: string[] }
   */
  validate(message) {
    const errors = [];

    if (!message || message.trim().length === 0) {
      errors.push("Commit message cannot be empty");
      return { valid: false, errors };
    }

    const lines = message.split("\n");
    const headerLine = lines[0];

    // Validate header format
    const headerErrors = this.validateHeader(headerLine);
    errors.push(...headerErrors);

    // Validate body lines
    if (lines.length > 2) {
      const bodyErrors = this.validateBody(lines.slice(2));
      errors.push(...bodyErrors);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate the header line (type, scope, subject)
   * @param {string} header - First line of commit
   * @returns {string[]} - Array of error messages
   */
  validateHeader(header) {
    const errors = [];

    // Check format: type(scope): subject
    const conventionalPattern = /^(\w+)(\([\w-]+\))?:\s*(.+)$/;
    const match = header.match(conventionalPattern);

    if (!match) {
      errors.push("Header must follow format: type(scope): subject");
      return errors;
    }

    const [, type, scope, subject] = match;

    // Validate type
    if (!this.validTypes.includes(type)) {
      errors.push(
        `Invalid type "${type}". Must be one of: ${this.validTypes.join(", ")}`
      );
    }

    // Validate type case
    if (type !== type.toLowerCase()) {
      errors.push("Type must be lowercase");
    }

    // Validate subject
    const subjectErrors = this.validateSubject(subject);
    errors.push(...subjectErrors);

    return errors;
  }

  /**
   * Validate the subject line
   * @param {string} subject - The subject text
   * @returns {string[]} - Array of error messages
   */
  validateSubject(subject) {
    const errors = [];

    // Check length
    if (subject.length > this.config.maxSubjectLength) {
      errors.push(
        `Subject is too long (${subject.length} chars). Maximum is ${this.config.maxSubjectLength}`
      );
    }

    if (subject.length < this.config.minSubjectLength) {
      errors.push(
        `Subject is too short (${subject.length} chars). Minimum is ${this.config.minSubjectLength}`
      );
    }

    // Check if ends with period
    if (subject.endsWith(".")) {
      errors.push("Subject must not end with a period");
    }

    // Check imperative mood
    if (this.config.enforceImperative) {
      if (!this.isImperative(subject)) {
        errors.push(
          'Subject must use imperative mood (e.g., "add" not "adds" or "added")'
        );
      }
    }

    // Check case
    if (
      this.config.subjectCase === "lowercase" &&
      subject[0] !== subject[0].toLowerCase()
    ) {
      errors.push("Subject must start with lowercase letter");
    }

    return errors;
  }

  /**
   * Validate body lines
   * @param {string[]} bodyLines - Body text lines
   * @returns {string[]} - Array of error messages
   */
  validateBody(bodyLines) {
    const errors = [];

    bodyLines.forEach((line, index) => {
      if (line.length > this.config.maxLineLength) {
        errors.push(
          `Body line ${index + 1} is too long (${
            line.length
          } chars). Maximum is ${this.config.maxLineLength}`
        );
      }
    });

    return errors;
  }

  /**
   * Check if subject uses imperative mood
   * @param {string} subject - The subject text
   * @returns {boolean}
   */
  isImperative(subject) {
    const nonImperativePatterns = [
      /^(adds|adding|added)\s/i,
      /^(fixes|fixing|fixed)\s/i,
      /^(updates|updating|updated)\s/i,
      /^(removes|removing|removed)\s/i,
      /^(creates|creating|created)\s/i,
      /^(implements|implementing|implemented)\s/i,
      /^(changes|changing|changed)\s/i,
    ];

    return !nonImperativePatterns.some((pattern) => pattern.test(subject));
  }

  /**
   * Convert subject to imperative mood
   * @param {string} subject - The subject text
   * @returns {string}
   */
  toImperative(subject) {
    return subject
      .replace(/^adds\s/i, "add ")
      .replace(/^adding\s/i, "add ")
      .replace(/^added\s/i, "add ")
      .replace(/^fixes\s/i, "fix ")
      .replace(/^fixing\s/i, "fix ")
      .replace(/^fixed\s/i, "fix ")
      .replace(/^updates\s/i, "update ")
      .replace(/^updating\s/i, "update ")
      .replace(/^updated\s/i, "update ")
      .replace(/^removes\s/i, "remove ")
      .replace(/^removing\s/i, "remove ")
      .replace(/^removed\s/i, "remove ")
      .replace(/^creates\s/i, "create ")
      .replace(/^creating\s/i, "create ")
      .replace(/^created\s/i, "create ")
      .replace(/^implements\s/i, "implement ")
      .replace(/^implementing\s/i, "implement ")
      .replace(/^implemented\s/i, "implement ")
      .replace(/^changes\s/i, "change ")
      .replace(/^changing\s/i, "change ")
      .replace(/^changed\s/i, "change ");
  }

  /**
   * Parse a commit message into components
   * @param {string} message - The commit message
   * @returns {Object} - Parsed components
   */
  parse(message) {
    const lines = message.split("\n");
    const headerLine = lines[0];

    const match = headerLine.match(/^(\w+)(\(([\w-]+)\))?:\s*(.+)$/);

    if (!match) {
      return null;
    }

    const [, type, , scope, subject] = match;

    // Find body (after blank line)
    let bodyStartIndex = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === "" && i + 1 < lines.length) {
        bodyStartIndex = i + 1;
        break;
      }
    }

    let body = "";
    let footer = "";
    let breaking = false;

    if (bodyStartIndex !== -1) {
      const bodyLines = lines.slice(bodyStartIndex);

      // Check for footer (BREAKING CHANGE, Closes, etc.)
      const footerIndex = bodyLines.findIndex(
        (line) =>
          line.startsWith("BREAKING CHANGE:") ||
          line.startsWith("Closes") ||
          line.startsWith("Fixes") ||
          line.startsWith("Refs")
      );

      if (footerIndex !== -1) {
        body = bodyLines.slice(0, footerIndex).join("\n").trim();
        footer = bodyLines.slice(footerIndex).join("\n").trim();
      } else {
        body = bodyLines.join("\n").trim();
      }

      breaking = footer.includes("BREAKING CHANGE:");
    }

    return {
      type,
      scope: scope || null,
      subject,
      body: body || null,
      footer: footer || null,
      breaking,
    };
  }
}

module.exports = Validator;
