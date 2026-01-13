// tests/unit/validator.test.js
// Unit tests for Validator class

const Validator = require("../../src/core/validator");

describe("Validator", () => {
  let validator;

  beforeEach(() => {
    validator = new Validator();
  });

  describe("validate()", () => {
    it("should validate a correct commit message", () => {
      const message = "feat(auth): add login functionality";
      const result = validator.validate(message);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject empty message", () => {
      const result = validator.validate("");

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Commit message cannot be empty");
    });

    it("should reject invalid type", () => {
      const message = "invalid(auth): something";
      const result = validator.validate(message);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("Invalid type"))).toBe(true);
    });

    it("should reject subject ending with period", () => {
      const message = "feat(auth): add login.";
      const result = validator.validate(message);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Subject must not end with a period");
    });

    it("should reject non-imperative mood", () => {
      const message = "feat(auth): added login";
      const result = validator.validate(message);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("imperative mood"))).toBe(
        true
      );
    });

    it("should reject uppercase type", () => {
      const message = "FEAT(auth): add login";
      const result = validator.validate(message);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Type must be lowercase");
    });

    it("should reject too long subject", () => {
      const longSubject = "a".repeat(80);
      const message = `feat(auth): ${longSubject}`;
      const result = validator.validate(message);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("too long"))).toBe(true);
    });

    it("should accept message without scope", () => {
      const message = "feat: add login";
      const result = validator.validate(message);

      expect(result.valid).toBe(true);
    });

    it("should accept multi-line message with body", () => {
      const message = `feat(auth): add login

This is a longer description of the feature.
It spans multiple lines.`;

      const result = validator.validate(message);
      expect(result.valid).toBe(true);
    });
  });

  describe("validateHeader()", () => {
    it("should validate correct header", () => {
      const header = "feat(auth): add login";
      const errors = validator.validateHeader(header);

      expect(errors).toHaveLength(0);
    });

    it("should reject malformed header", () => {
      const header = "this is not a valid header";
      const errors = validator.validateHeader(header);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("follow format");
    });
  });

  describe("validateSubject()", () => {
    it("should validate correct subject", () => {
      const subject = "add user authentication";
      const errors = validator.validateSubject(subject);

      expect(errors).toHaveLength(0);
    });

    it("should reject too short subject", () => {
      const subject = "ab";
      const errors = validator.validateSubject(subject);

      expect(errors.some((e) => e.includes("too short"))).toBe(true);
    });
  });

  describe("isImperative()", () => {
    it("should accept imperative mood", () => {
      expect(validator.isImperative("add feature")).toBe(true);
      expect(validator.isImperative("fix bug")).toBe(true);
      expect(validator.isImperative("update docs")).toBe(true);
      expect(validator.isImperative("remove file")).toBe(true);
    });

    it("should reject non-imperative mood", () => {
      expect(validator.isImperative("adds feature")).toBe(false);
      expect(validator.isImperative("adding feature")).toBe(false);
      expect(validator.isImperative("added feature")).toBe(false);
      expect(validator.isImperative("fixes bug")).toBe(false);
      expect(validator.isImperative("fixed bug")).toBe(false);
    });
  });

  describe("toImperative()", () => {
    it("should convert to imperative mood", () => {
      expect(validator.toImperative("adds feature")).toBe("add feature");
      expect(validator.toImperative("adding feature")).toBe("add feature");
      expect(validator.toImperative("added feature")).toBe("add feature");
      expect(validator.toImperative("fixes bug")).toBe("fix bug");
      expect(validator.toImperative("fixed bug")).toBe("fix bug");
      expect(validator.toImperative("updates docs")).toBe("update docs");
    });

    it("should preserve already imperative subjects", () => {
      expect(validator.toImperative("add feature")).toBe("add feature");
      expect(validator.toImperative("fix bug")).toBe("fix bug");
    });
  });

  describe("parse()", () => {
    it("should parse complete commit message", () => {
      const message = `feat(auth): add login functionality

Implemented JWT-based authentication.
Added tests and documentation.

BREAKING CHANGE: Changed auth endpoint
Closes #123`;

      const parsed = validator.parse(message);

      expect(parsed).toEqual({
        type: "feat",
        scope: "auth",
        subject: "add login functionality",
        body: expect.stringContaining("Implemented JWT"),
        footer: expect.stringContaining("BREAKING CHANGE"),
        breaking: true,
      });
    });

    it("should parse message without scope", () => {
      const message = "fix: resolve bug";
      const parsed = validator.parse(message);

      expect(parsed.type).toBe("fix");
      expect(parsed.scope).toBeNull();
      expect(parsed.subject).toBe("resolve bug");
    });

    it("should parse message without body", () => {
      const message = "docs: update README";
      const parsed = validator.parse(message);

      expect(parsed.body).toBeNull();
      expect(parsed.footer).toBeNull();
      expect(parsed.breaking).toBe(false);
    });

    it("should return null for invalid message", () => {
      const message = "this is not valid";
      const parsed = validator.parse(message);

      expect(parsed).toBeNull();
    });
  });

  describe("validateBody()", () => {
    it("should accept body with normal line length", () => {
      const bodyLines = [
        "This is a normal line.",
        "This is another normal line.",
      ];
      const errors = validator.validateBody(bodyLines);

      expect(errors).toHaveLength(0);
    });

    it("should reject body with too long lines", () => {
      const longLine = "a".repeat(120);
      const bodyLines = [longLine];
      const errors = validator.validateBody(bodyLines);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("too long");
    });
  });
});

describe("Validator with custom config", () => {
  it("should use custom max subject length", () => {
    const validator = new Validator({ maxSubjectLength: 50 });
    const message = "feat: " + "a".repeat(60);
    const result = validator.validate(message);

    expect(result.valid).toBe(false);
  });

  it("should skip imperative mood check when disabled", () => {
    const validator = new Validator({ enforceImperative: false });
    const message = "feat: added feature";
    const result = validator.validate(message);

    // Should not fail for imperative mood
    expect(result.errors.every((e) => !e.includes("imperative"))).toBe(true);
  });
});
