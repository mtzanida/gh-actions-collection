
```markdown
# Review Reminder GitHub Action

This GitHub Action helps manage pull request reviews by automatically reminding reviewers who have not yet provided feedback. The action runs daily or can be triggered on demand, ensuring timely reviews and enhancing collaboration within your team.

## Features

- **Automatic Reminder**: Sends a reminder to reviewers who haven't submitted feedback after an hour.
- **Daily Checks**: Scheduled to check for open pull requests every day.
- **Customizable**: Easy to configure based on your repository needs.

## Getting Started

To use this action in your GitHub repository, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/mtzanida/review-reminder-github-action.git
cd review-reminder-github-action
```

### 2. Set Up the GitHub Action

Create a workflow file in your repository's `.github/workflows` directory. You can name it `pr-reminder.yml`.

```yaml
name: PR Reminder

on:
  schedule:
    - cron: "0 0 * * *"  # Runs daily at midnight
  workflow_dispatch:

permissions:
  contents: read
  pull-requests: write

jobs:
  reminder:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "16"
      
      - name: Install dependencies
        run: |
          echo '{}' > package.json
          npm install moment @octokit/action
      
      - name: Run reminder script
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: node .github/script.js
```

### 3. Add the Reminder Script

Place the script located at `.github/script.js` in your repository. This script handles fetching open pull requests, identifying reviewers, and posting reminders.

### 4. Configure GitHub Token

Make sure to create a GitHub token and add it to your repository secrets as `GITHUB_TOKEN`. This is necessary for the action to authenticate API requests.

## Usage

Once the action is set up, it will automatically check for open pull requests and send reminders to reviewers who haven't provided feedback within an hour.

### Example of Reminder Message

When a reminder is sent, it will mention the reviewer in the pull request comment, like so:

```
Hi @reviewer, don't forget to check this PR.
```

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to open an issue or submit a pull request.


## Acknowledgements

- [Octokit](https://github.com/octokit/octokit.js) for GitHub API interaction.
- [Moment.js](https://momentjs.com/) for date manipulation.

## Contact

For questions or suggestions, please open an issue or contact me via GitHub.

```

