# Contributing to College ERP

First off, thank you for considering contributing to College ERP! It's people like you that make College ERP such a great tool. We welcome contributions from everyone, whether it's bug reports, feature requests, or code contributions.

## 🤝 Ways to Contribute

There are many ways you can contribute to the project:

### 🐛 Report Bugs
Found something broken on the live demo or while running locally? Open an issue with detailed steps to reproduce.
When reporting a bug, please include:
- Your operating system and browser.
- The exact steps to reproduce the issue.
- What you expected to happen vs what actually happened.
- Screenshots if applicable.

### 💡 Suggest Features
Have an idea for a new feature? Start a GitHub Discussion first so the community can weigh in before it becomes a formal issue. If the feature is approved, you can open an issue to track its development.

### 🔧 Fix Bugs & Add Features
Browse open issues labeled `good first issue` or `help wanted`. Once you find an issue you'd like to work on, drop a comment saying you're picking it up!

---

## 🛠️ Development Setup

To contribute code, you'll need to set up the project locally.

### 1. Fork & Clone
1. Fork the College ERP repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/amaanmulani9-ai/College-ERP.git
   cd College-ERP
   ```
3. Add the original repository as an upstream remote:
   ```bash
   git remote add upstream https://github.com/amaanmulani9-ai/College-ERP.git
   ```

### 2. Set Up the Environment
Create a virtual environment to keep dependencies isolated:
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```
Install the requirements:
```bash
pip install -r requirements.txt
```

### 3. Run the Database
Apply the migrations and run the server to ensure everything works out of the box:
```bash
python manage.py migrate
python manage.py runserver
```

---

## 🌿 Branch Naming Conventions

Please create a branch for your work. Use the following naming convention to keep branches organized:
- `feature/your-feature-name` (For new features)
- `bugfix/issue-number-description` (For bug fixes)
- `docs/what-you-changed` (For documentation updates)

Example:
```bash
git checkout -b feature/attendance-export
```

---

## 🚀 Submitting a Pull Request

When you're ready to submit your code, follow these steps:

1. **Commit your changes**: Write clear, concise commit messages.
   ```bash
   git commit -m "Add export to Excel button on attendance page"
   ```
2. **Push your branch**:
   ```bash
   git push origin feature/attendance-export
   ```
3. **Open a Pull Request**: Navigate to the original College ERP repository on GitHub and click "New Pull Request".
4. **Link the Issue**: In the description, use keywords like `Fixes #12` or `Closes #15` so the issue automatically closes when the PR is merged.
5. **Wait for Review**: The maintainer (Amaan) will review your code. We may request some changes before it is merged.

---

## ⚖️ Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

Thank you for making College ERP better! 🎉
