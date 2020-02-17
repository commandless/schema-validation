const core = require('@actions/core');
const github = require('@actions/github');

async function validatePr() {
  try {
    const token = core.getInput('github-token');
    console.log('token:', typeof token, token.length);
  
    const octokit = new github.GitHub(token);
  
    const x = await octokit.commits.get({
      sha: github.context.payload.commits[0].id
    })

    console.log("==========")
    console.log(x)
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
