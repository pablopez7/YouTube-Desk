# Contributing to YouTube Desktop

First off, thank you for considering contributing to YouTube Desktop! 🎉

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates.

When creating a bug report, include:
- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs what actually happened
- **Screenshots** if applicable
- **Your environment** (OS, Node version, etc.)

### Suggesting Features

Feature requests are welcome! Please:
- Check if the feature has already been suggested
- Provide a clear description of the feature
- Explain why this feature would be useful

### Pull Requests

1. **Fork** the repo and create your branch from `main`
2. **Install** dependencies: `npm install`
3. **Make your changes** and test them
4. **Commit** with clear, descriptive messages
5. **Push** to your fork and submit a PR

## Development Setup

```bash
# Install dependencies
npm install

# Build Electron files
npm run build:electron

# Start development
npm run dev

# In another terminal, start Electron
npm run start
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic

## Project Structure

- `src/main/` - Electron main process
- `src/preload/` - Preload scripts for secure IPC
- `src/renderer/` - React frontend

## Questions?

Feel free to open an issue with the "question" label.

Thank you for contributing! 💪
