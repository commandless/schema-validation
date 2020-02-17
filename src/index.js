const axios = require('axios');
const core = require('@actions/core');
const github = require('@actions/github');

async function validatePr() {
  try {
    const token = core.getInput('github-token');
    console.log('token:', typeof token, token.length);
  
    const commitIds = github.context.payload.commits.map(commit => commit.id)

    const commits = await Promise.all(commitIds.map(async commitId => {
      const {data} = await axios.get(`https://api.github.com/repos/commandless/commandless/commits/${commitId}`)
      return data
    }))

    const filenames = Array.prototype.concat(
      ...commits.map(commit => {
        return commit.files
          .map(({filename, sha}) => {
            return {filename, commitId: sha}
          })
          .filter(({filename}) => filename.endsWith('json'))
      })
    )

    console.log("==========")
    console.log(filenames)
    console.log("==========")

    const fileContents = await Promise.all(filenames.map(async ({filename, commitId}) => {
      const fileUrl = `https://raw.githubusercontent.com/commandless/commandless/blob/${commitId}/${filename}`
      console.log(fileUrl)
      const {data} = await axios.get(fileUrl)
      return data
    }))

    for (const content of fileContents) {
      validateFile(content)
    }
  
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
  
  } catch (error) {
    core.setFailed(error.message);
  }
}

function validateFile(content) {
  const jsonContent = JSON.parse(content)
  console.log(Object.keys(jsonContent))
}

validatePr()
