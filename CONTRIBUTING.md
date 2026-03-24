# Contributing to IIFTA Portal

Thank you for your interest in contributing to IIFTA Portal! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs

- Use the [GitHub Issues](https://github.com/jitenkr2030/IIFTA/issues) page
- Provide detailed information about the bug
- Include steps to reproduce the issue
- Add screenshots if applicable
- Specify your environment (OS, browser, etc.)

### Suggesting Features

- Open an issue with the "enhancement" label
- Provide a clear description of the feature
- Explain the use case and benefits
- Consider if it aligns with our project goals

### Code Contributions

1. **Fork the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/IIFTA.git
   cd IIFTA
   ```

2. **Set Up Development Environment**
   ```bash
   bun install
   cp .env.example .env.local
   bun run db:push
   bun run dev
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

5. **Test Your Changes**
   ```bash
   bun run lint
   bun run type-check
   bun run test  # when tests are added
   ```

6. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

7. **Push and Create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Prefer explicit return types

### React Components

- Use functional components with hooks
- Follow the existing component structure
- Use shadcn/ui components when possible
- Add proper TypeScript interfaces
- Include accessibility attributes

### CSS/Styling

- Use Tailwind CSS classes
- Follow the existing design system
- Ensure responsive design
- Test on different screen sizes
- Use semantic HTML elements

### Database

- Use Prisma for database operations
- Follow the existing schema patterns
- Add proper relationships
- Use descriptive field names
- Consider performance implications

## 🧪 Testing

### Running Tests

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage
bun run test:coverage
```

### Writing Tests

- Write unit tests for utility functions
- Test React components with React Testing Library
- Add integration tests for API routes
- Test database operations
- Mock external dependencies

## 📖 Documentation

### Updating Documentation

- Keep README.md up to date
- Update API documentation for new endpoints
- Add comments to complex code
- Update environment variable examples
- Document new features in the appropriate section

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Use proper markdown formatting
- Include links to related documentation

## 🚀 Development Workflow

### Branch Naming

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/urgent-fix` - Critical fixes
- `docs/documentation-update` - Documentation changes
- `refactor/code-cleanup` - Refactoring

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer(s)]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add social login integration
fix(dashboard): resolve progress calculation bug
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create a Pull Request**
   - Use a descriptive title
   - Reference related issues
   - Add appropriate labels

2. **PR Description**
   - Describe the changes made
   - Explain the reasoning
   - Include screenshots for UI changes
   - List any breaking changes

3. **Code Review**
   - Respond to review comments promptly
   - Make requested changes
   - Keep the discussion constructive

4. **Merge**
   - Ensure CI/CD passes
   - Resolve all conflicts
   - Update documentation if needed

## 🎯 Areas for Contribution

### High Priority

- 🐛 Bug fixes and issue resolution
- ✨ Core feature enhancements
- 📝 Documentation improvements
- 🧪 Test coverage improvements

### Medium Priority

- 🎨 UI/UX improvements
- ⚡ Performance optimizations
- 🔒 Security enhancements
- 📊 Analytics and monitoring

### Low Priority

- 🌐 Internationalization
- 📱 Mobile app development
- 🤖 AI feature enhancements
- 🔌 Third-party integrations

## 🏆 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes for significant contributions
- Special badges in the community
- Invitation to the core team for exceptional contributions

## 📞 Getting Help

- 📧 Email: [dev@iifta.portal.com](mailto:dev@iifta.portal.com)
- 💬 Discord: [Join our community](https://discord.gg/iifta)
- 🐛 Issues: [GitHub Issues](https://github.com/jitenkr2030/IIFTA/issues)

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to IIFTA Portal! 🎉