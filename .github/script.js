#!/usr/bin/env node

const moment = require("moment");
const { Octokit } = require("@octokit/action");
const owner = process.env.GITHUB_REPOSITORY.split("/")[0];
const repo = process.env.GITHUB_REPOSITORY.split("/")[1];

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function run() {
  console.log("Fetching open pull requests...");
  const prs = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
    owner: owner,
    repo: repo,
    state: "open",
  });
  console.log("Open pull requests fetched:", prs.data.length);

  for (const pr of prs.data) {
    console.log(`Processing pull request #${pr.number}...`);
    console.log(`Fetching reviews for pull request #${pr.number}`);

    const reviews = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
      {
        owner: owner,
        repo: repo,
        pull_number: pr.number,
      }
    );
    // Fetch the list of potential reviewers
    const potentialReviewersResponse = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
      {
        owner: owner,
        repo: repo,
        pull_number: pr.number,
      }
    );
    const potentialReviewers = potentialReviewersResponse.data.users.map(
      (user) => user.login
    );

    // Find the reviewers who haven't made a review
    const reviewers = reviews.data.map((review) => review.user.login);
    const reviewersWhoHaventReviewed = potentialReviewers.filter(
      (reviewer) => !reviewers.includes(reviewer)
    );

    console.log(
      `Reviewers who haven't reviewed the pull request #${pr.number}:`,
      reviewersWhoHaventReviewed
    );
    const joinedAt = reviewersWhoHaventReviewed[0].joined_at;
    const joinedAtTime = moment(joinedAt);
    const now = moment();
    const hoursSinceJoined = now.diff(joinedAtTime, "hours");
    console.log(`The approver has been joined for ${hoursSinceJoined} hours.`);

    if (hoursSinceJoined > 1) {
      reviewersWhoHaventReviewed.forEach(async (reviewer, index) => {
        // Mention the reviewer in a comment on the pull request
        await octokit.request(
          "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
          {
            owner: owner,
            repo: repo,
            issue_number: pr.number,
            body: `Hi @${reviewer}, don't forget to check this PR.`,
          }
        );
      });
    }
  }
}

run().catch(console.error);
