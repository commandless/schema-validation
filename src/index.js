const axios = require('axios');
const core = require('@actions/core');
const github = require('@actions/github');

async function validatePr() {
  try {
    const token = core.getInput('github-token');
    console.log('token:', typeof token, token.length);
  
    const commitIds = github.context.payload.commits.map(commit => commit.id)

    const commits = await Promise.all(commitIds.map(commitId => {
      return axios.get(`https://api.github.com/repos/commandless/commandless/commits/${commitId}`)
    }))

    console.log("==========")
    console.log(commits)
    console.log("==========")
    
    core.setOutput("time", time);
  
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
  
  } catch (error) {
    core.setFailed(error.message);
  }
}

validatePr()
