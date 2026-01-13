// src/core/formatter.js
// Format commit messages to conventional commit standard

class Formatter {
  /**
   * Format a commit message from components
   * @param {Object} components - { type, scope, subject, body, breaking, footer }
   * @returns {string} - Formatted commit message
   */
  format(components) {
    const { type, scope, subject, body, breaking, footer } = components;

    // Build header
    let header = type;
    if (scope) {
      header += `(${scope})`;
    }
    header += `: ${subject}`;

    // Build full message
    const parts = [header];

    // Add blank line before body
    if (body) {
      parts.push("");
      parts.push(this.wrapText(body, 100));
    }

    // Add breaking change
    if (breaking) {
      parts.push("");
      parts.push("BREAKING CHANGE: " + breaking);
    }

    // Add footer
    if (footer) {
      if (!breaking) {
        parts.push("");
      }
      parts.push(footer);
    }

    return parts.join("\n");
  }

  /**
   * Wrap text to specified line length
   * @param {string} text - Text to wrap
   * @param {number} maxLength - Maximum line length
   * @returns {string} - Wrapped text
   */
  wrapText(text, maxLength = 100) {
    if (!text) return "";

    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
      if ((currentLine + word).length <= maxLength) {
        currentLine += (currentLine ? " " : "") + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) lines.push(currentLine);
    return lines.join("\n");
  }

  /**
   * Detect commit type from message content
   * @param {string} message - Raw commit message
   * @returns {string|null} - Detected type or null
   */
  detectType(message) {
    const lowerMessage = message.toLowerCase();

    const typeKeywords = {
      feat: ["add", "create", "implement", "introduce", "new"],
      fix: ["fix", "resolve", "correct", "repair", "patch", "bug"],
      docs: ["document", "readme", "docs", "comment"],
      refactor: ["refactor", "restructure", "reorganize", "cleanup"],
      test: ["test", "testing", "spec", "coverage"],
      style: ["format", "styling", "indent", "whitespace"],
      chore: ["update", "upgrade", "dependency", "deps", "maintain"],
      perf: ["optimize", "performance", "faster", "speed"],
    };

    for (const [type, keywords] of Object.entries(typeKeywords)) {
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
          return type;
        }
      }
    }

    return null;
  }

  /**
   * Auto-format a raw message into conventional format
   * @param {string} rawMessage - Raw commit message
   * @param {string} detectedType - Pre-detected type (optional)
   * @returns {Object} - { type, subject, confidence }
   */
  autoFormat(rawMessage, detectedType = null) {
    const type = detectedType || this.detectType(rawMessage) || "chore";

    // Clean up the message
    let subject = rawMessage
      .trim()
      .replace(/^(fix|fixes|fixed|fixing):\s*/i, "")
      .replace(/^(add|adds|added|adding):\s*/i, "")
      .replace(/^(update|updates|updated|updating):\s*/i, "");

    // Ensure lowercase start
    subject = subject.charAt(0).toLowerCase() + subject.slice(1);

    // Remove trailing period
    subject = subject.replace(/\.$/, "");

    // Limit length
    if (subject.length > 72) {
      subject = subject.substring(0, 69) + "...";
    }

    return {
      type,
      subject,
      confidence: detectedType ? "high" : "medium",
    };
  }

  /**
   * Extract scope from git diff or file paths
   * @param {Array} changedFiles - Array of changed file paths
   * @returns {string|null} - Suggested scope
   */
  suggestScope(changedFiles) {
    if (!changedFiles || changedFiles.length === 0) {
      return null;
    }

    // Common patterns
    const patterns = [
      { pattern: /^src\/api\//, scope: "api" },
      { pattern: /^src\/ui\/|^src\/components\//, scope: "ui" },
      { pattern: /^src\/db\/|^migrations\//, scope: "db" },
      { pattern: /^src\/auth\//, scope: "auth" },
      { pattern: /^tests?\//, scope: "test" },
      { pattern: /^docs?\/|README/, scope: "docs" },
      { pattern: /package\.json|yarn\.lock|package-lock\.json/, scope: "deps" },
      { pattern: /\.config\.|config\//, scope: "config" },
    ];

    for (const { pattern, scope } of patterns) {
      if (changedFiles.some((file) => pattern.test(file))) {
        return scope;
      }
    }

    // Try to extract from first directory
    const firstFile = changedFiles[0];
    const match = firstFile.match(/^(?:src\/)?([^\/]+)\//);
    if (match) {
      return match[1];
    }

    return null;
  }

  /**
   * Clean and normalize subject text
   * @param {string} subject - Raw subject
   * @returns {string} - Cleaned subject
   */
  cleanSubject(subject) {
    return subject
      .trim()
      .replace(/\s+/g, " ") // Remove extra spaces
      .replace(/^["']|["']$/g, "") // Remove quotes
      .replace(/\.$/, ""); // Remove trailing period
  }

  /**
   * Validate and suggest improvements for subject
   * @param {string} subject - Subject to check
   * @returns {Object} - { valid, suggestions }
   */
  analyzeSubject(subject) {
    const suggestions = [];

    // Check length
    if (subject.length > 72) {
      suggestions.push({
        type: "length",
        message: `Subject is ${subject.length} chars (max 72). Consider shortening.`,
      });
    }

    // Check imperative mood
    const nonImperative =
      /^(adds|adding|added|fixes|fixing|fixed|updates|updating|updated)/i;
    if (nonImperative.test(subject)) {
      suggestions.push({
        type: "mood",
        message: 'Use imperative mood (e.g., "add" not "adds" or "added")',
      });
    }

    // Check capitalization
    if (subject[0] === subject[0].toUpperCase()) {
      suggestions.push({
        type: "case",
        message: "Start with lowercase letter",
      });
    }

    // Check trailing period
    if (subject.endsWith(".")) {
      suggestions.push({
        type: "punctuation",
        message: "Remove trailing period",
      });
    }

    return {
      valid: suggestions.length === 0,
      suggestions,
    };
  }
}

module.exports = Formatter;
