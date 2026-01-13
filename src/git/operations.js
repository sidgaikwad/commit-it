// src/git/operations.js
// Git operations wrapper

const simpleGit = require("simple-git");
const logger = require("../utils/logger");

class GitOperations {
  constructor() {
    this.git = simpleGit();
  }

  /**
   * Check if current directory is a git repository
   * @returns {Promise<boolean>}
   */
  async isGitRepo() {
    try {
      await this.git.status();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get list of staged files
   * @returns {Promise<Array>} - Array of file paths
   */
  async getStagedFiles() {
    try {
      const status = await this.git.status();
      return status.staged;
    } catch (error) {
      logger.error("Failed to get staged files: " + error.message);
      return [];
    }
  }

  /**
   * Get list of changed files (staged + unstaged)
   * @returns {Promise<Array>} - Array of file paths
   */
  async getChangedFiles() {
    try {
      const status = await this.git.status();
      return [
        ...status.staged,
        ...status.modified,
        ...status.created,
        ...status.deleted,
      ];
    } catch (error) {
      logger.error("Failed to get changed files: " + error.message);
      return [];
    }
  }

  /**
   * Check if there are staged changes
   * @returns {Promise<boolean>}
   */
  async hasStagedChanges() {
    try {
      const staged = await this.getStagedFiles();
      return staged.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Commit with message
   * @param {string} message - Commit message
   * @returns {Promise<Object>} - Commit result
   */
  async commit(message) {
    try {
      const result = await this.git.commit(message);
      logger.success(`Committed: ${result.commit}`);
      return result;
    } catch (error) {
      logger.error("Commit failed: " + error.message);
      throw error;
    }
  }

  /**
   * Amend last commit with new message
   * @param {string} message - New commit message
   * @returns {Promise<Object>} - Commit result
   */
  async amendCommit(message) {
    try {
      const result = await this.git.commit(message, ["--amend"]);
      logger.success(`Amended commit: ${result.commit}`);
      return result;
    } catch (error) {
      logger.error("Amend failed: " + error.message);
      throw error;
    }
  }

  /**
   * Get last commit message
   * @returns {Promise<string>} - Last commit message
   */
  async getLastCommitMessage() {
    try {
      const log = await this.git.log({ maxCount: 1 });
      return log.latest?.message || "";
    } catch (error) {
      logger.error("Failed to get last commit: " + error.message);
      return "";
    }
  }

  /**
   * Get commit history
   * @param {number} count - Number of commits to fetch
   * @returns {Promise<Array>} - Array of commits
   */
  async getCommitHistory(count = 10) {
    try {
      const log = await this.git.log({ maxCount: count });
      return log.all.map((commit) => ({
        hash: commit.hash.substring(0, 7),
        message: commit.message,
        author: commit.author_name,
        date: commit.date,
      }));
    } catch (error) {
      logger.error("Failed to get commit history: " + error.message);
      return [];
    }
  }

  /**
   * Get diff summary of staged changes
   * @returns {Promise<Object>} - Diff statistics
   */
  async getDiffSummary() {
    try {
      const diff = await this.git.diffSummary(["--cached"]);
      return {
        additions: diff.insertions,
        deletions: diff.deletions,
        changes: diff.changes,
        files: diff.files.map((f) => ({
          file: f.file,
          additions: f.insertions,
          deletions: f.deletions,
        })),
      };
    } catch (error) {
      logger.error("Failed to get diff: " + error.message);
      return null;
    }
  }

  /**
   * Stage all changes
   * @returns {Promise<void>}
   */
  async stageAll() {
    try {
      await this.git.add(".");
      logger.success("All changes staged");
    } catch (error) {
      logger.error("Failed to stage changes: " + error.message);
      throw error;
    }
  }

  /**
   * Stage specific files
   * @param {Array} files - File paths to stage
   * @returns {Promise<void>}
   */
  async stageFiles(files) {
    try {
      await this.git.add(files);
      logger.success(`Staged ${files.length} file(s)`);
    } catch (error) {
      logger.error("Failed to stage files: " + error.message);
      throw error;
    }
  }

  /**
   * Get repository root path
   * @returns {Promise<string>} - Root path
   */
  async getRepoRoot() {
    try {
      const root = await this.git.revparse(["--show-toplevel"]);
      return root.trim();
    } catch (error) {
      return process.cwd();
    }
  }

  /**
   * Get current branch name
   * @returns {Promise<string>} - Branch name
   */
  async getCurrentBranch() {
    try {
      const status = await this.git.status();
      return status.current;
    } catch (error) {
      return "unknown";
    }
  }

  /**
   * Check if working directory is clean
   * @returns {Promise<boolean>}
   */
  async isClean() {
    try {
      const status = await this.git.status();
      return status.isClean();
    } catch (error) {
      return false;
    }
  }

  /**
   * Get repository status summary
   * @returns {Promise<Object>} - Status info
   */
  async getStatusSummary() {
    try {
      const status = await this.git.status();
      const branch = await this.getCurrentBranch();

      return {
        branch,
        ahead: status.ahead,
        behind: status.behind,
        staged: status.staged.length,
        modified: status.modified.length,
        created: status.created.length,
        deleted: status.deleted.length,
        renamed: status.renamed.length,
        untracked: status.not_added.length,
        clean: status.isClean(),
      };
    } catch (error) {
      logger.error("Failed to get status: " + error.message);
      return null;
    }
  }

  /**
   * Show current status in formatted way
   * @returns {Promise<void>}
   */
  async showStatus() {
    const status = await this.getStatusSummary();

    if (!status) {
      logger.error("Could not get repository status");
      return;
    }

    logger.title("Repository Status");
    logger.table({
      Branch: status.branch,
      Ahead: status.ahead || 0,
      Behind: status.behind || 0,
      Staged: status.staged,
      Modified: status.modified,
      Untracked: status.untracked,
      Status: status.clean ? "Clean" : "Dirty",
    });
  }
}

module.exports = GitOperations;
