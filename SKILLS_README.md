# Dungeon Forge - AI Agent Skills Guide

This project includes AI agent skills to help maintain code quality and accelerate development.

## Available Skills

### 1. Self-Improving Agent

Curates Claude Code's auto-memory into durable project knowledge.

**Commands:**
```
/si:review      # Analyze MEMORY.md - find promotion candidates, stale entries
/si:promote     # Graduate a pattern from MEMORY.md to rules/CLAUDE.md
/si:status      # Memory health dashboard
/si:remember    # Explicitly save important knowledge
/si:extract     # Turn a proven pattern into a reusable skill
```

**When to use:**
- After fixing a bug: `/si:remember "Fixed race condition in cloud sync by adding cleanup"`
- When a pattern recurs: `/si:promote "Always use cleanup in useEffect for event listeners"`
- Before starting new work: `/si:review` to see what the project has learned

---

### 2. Adversarial Reviewer

Forces genuine perspective shifts through hostile reviewer personas.

**Commands:**
```
/adversarial-review                    # Review all unstaged changes
/adversarial-review --diff HEAD~3     # Review last 3 commits
/adversarial-review --file src/App.tsx # Review specific file
```

**Personas:**
- **Saboteur**: "How can I break this in production?"
- **New Hire**: "Can I understand this in 6 months?"
- **Security Auditor**: "What vulnerabilities does this introduce?"

**When to use:**
- Before merging significant changes
- After a long coding session (fatigue produces blind spots)
- When Claude says "looks good" - get a second opinion

---

### 3. Code Reviewer

Automated code quality analysis.

**Commands:**
```
/code-reviewer   # Analyze code quality, detect issues
```

**Detects:**
- SOLID violations
- Code smells (long functions, deep nesting)
- Complexity issues
- Missing error handling
- Security concerns

**When to use:**
- General code quality checks
- Before refactoring sessions
- To identify technical debt

---

## Project Rules

Rules in `.claude/rules/` are automatically loaded when working on matching files:

| Rule | Applies To | Purpose |
|------|------------|---------|
| `dungeon-forge-react.md` | `*.tsx` | React patterns, hooks, cleanup |
| `dungeon-forge-typescript.md` | `*.ts`, `*.tsx` | TypeScript strictness, types |
| `dungeon-forge-performance.md` | `*.ts`, `*.tsx` | Memoization, debouncing |

---

## Memory System

The project uses a memory hierarchy:

```
CLAUDE.md (you write)           ← Enforced rules, always loaded
MEMORY.md (auto-captured)      ← Learned patterns, first 200 lines
.claude/rules/* (you + /promote) ← Scoped rules, loaded on match
```

### Best Practice

1. Let auto-memory capture what it learns
2. Review periodically: `/si:review`
3. Promote valuable patterns: `/si:promote`
4. Stale entries naturally get pushed out as new ones come in

---

## Quick Start

### Before a coding session:
```
/si:status        # Check memory health
/si:review        # Any patterns to promote?
```

### After fixing something:
```
/si:remember "Fixed the memory leak in App.tsx - always cleanup CapacitorApp listeners"
```

### Before merging:
```
/adversarial-review --diff main...HEAD
```

### General quality check:
```
/code-reviewer
```

---

## Integration with OpenCode

These skills are pre-installed in `.opencode/skills/`:

- `adversarial-reviewer/`
- `self-improving-agent/`
- `code-reviewer/`

They activate automatically when you use the commands above.

---

## Notes

- **No test framework** - These skills won't suggest adding tests
- **Spanish UI** - Skills output in the user's language of choice
- **Private project** - Security rules are deprioritized
