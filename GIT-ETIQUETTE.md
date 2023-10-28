# Git Etiquette Guidelines

A consistent and well-thought-out branch naming convention in Git can greatly improve collaboration and organization within a development team. Here are some good practices for Git branch naming conventions that we aspire towards:

## Git Branch Conventions

### 1. Prefix Branches for Clarity

Feature Branches: Prefix feature branches with feature/.

```txt
feature/user-authentication
```

Bug Fix Branches: Prefix bug fix branches with bug/.

```txt
bug/fix-login-issue
```

Other typical names for branches:

```txt
release/
chore/ or task/ or refactor/
docs/ or doc/
style/ or design/ or ui/ or css/
test/ or testing/ or test-automation/ or qa/
experiment/ or experimental/ or spike/ or research/ or prototyping/
config/ or infrastructure/ or deployment/
refactor/ or cleanup/ or optimize/
merge/ or integration/ or sync/
review/ or pr/ or code-review/
```

### 2. Use Descriptive Names

Branch names should be descriptive of the work being done on that branch. This makes it easier for team members to understand the purpose of the branch at a glance.

```txt
❌ Bad: feature-branch
✔️ Good: user-authentication-feature
```

### 3. Use Hyphens or Underscores

Use hyphens or underscores to separate words in branch names. This makes the branch names more readable.

```txt
✔️ Hyphens: user-authentication-feature
✔️ Underscores: user_authentication_feature
```

### 4. Include Issue or Task Numbers

As we use GitHub issues to keep track of tasks, it's helpful to include the issue or task number in the branch name. This links the branch to a specific task, making it easier to track progress.

```txt
✔️ feature/ISSUE-123-add-search-functionality
```

### 5. Keep it Short and Concise

Branch names should be concise but still informative. Avoid overly long branch names that are difficult to work with.

### 6. Lowercase

It's a good practice to use lowercase for branch names to maintain consistency.

```txt
❌ feature/User-Authentication
✔️ feature/user-authentication
```

### 7. Avoid Special Characters and Reserved Words

Avoid using special characters, spaces, or non-alphanumeric characters in branch names. Stick to letters, numbers, hyphens, and underscores.

Git has some reserved words that should be avoided in branch names, like HEAD, master, and origin. Using these can cause confusion and potential issues.

### 8. Delete Merged Branches

After a branch has been merged, it's a good practice to delete it to keep the repository clean. Prefix it with feature/, bug/, or whatever your convention is.

## Git Commit Messages

We aspire to follow the guidelines set out in [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). Here is a brief recap of the most important details for us. Additionally, we try to use present tense in our messages.

The message should follow the structure (optional body and footer are allowed if needed):

```text
<type>[optional scope]: <description>
```

Examples:

```txt
feat: allowing provided config object to extend other configs
chore: cleaning up formatting 
docs: updating readme
refactor: spliting Dashboard component into DashboardShell, DashboardText, DashboardWidget
```

types other than `fix:` and `feat:` are allowed, for example `build:, chore:, ci:, docs:, style:, refactor:, perf:, test:` and others.

Use a bang/exclamation mark `!` to highlight a breaking change.

```txt
refactor!: updating database schema to include user and post models
```
