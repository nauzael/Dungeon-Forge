your-project/
├── CLAUDE.md # Root project memory: tech stack, commands, and rules
├── .mcp.json # Model Context Protocol config (integrations like Jira/GitHub)
├── .claude/ # Main configuration directory
│ ├── settings.json # Global hooks, environment variables, and permissions
│ ├── rules/ # Modularized instruction files (e.g., security.md, style.md)
│ ├── skills/ # Reusable specialized workflows and knowledge
│ │ └── testing/
│ │ └── SKILL.md
│ ├── agents/ # Custom AI agent definitions (e.g., code-reviewer.md)
│ ├── commands/ # Custom slash commands (e.g., /deploy, /onboard)
│ └── hooks/ # Executable scripts for Pre/PostToolUse automation
└── docs/ # High-level architecture and API documentation
