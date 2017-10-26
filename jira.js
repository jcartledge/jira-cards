import fetch from 'node-fetch';
import btoa from 'btoa';
import settings from './config.json';

const credentials = `${settings.username}:${settings.password}`;
const jiraURL = 'https://vu-pmo.atlassian.net';

function jira (call, data) {
  const request = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(credentials)}`
    },
    method: 'post',
    body: JSON.stringify(data)
  };
  return fetch(`${jiraURL}/rest/api/2/${call}`, request).then(response => response.json());
}

async function search (jql) {
  const result = {};
  const maxResults = 100;
  let page = 0;
  let response = {};
  do {
    response = await jira('search', {jql, maxResults, startAt: maxResults * page++});
    result.issues = (result.issues || []).concat(response.issues || []);
  } while (response.issues.length);
  return result;
}

const getIssuesQuery = (sprint, op = '=') => `sprint ${op} ${sprint} and project=PW and issuetype in subTaskIssueTypes()`;
const getCurrentIssuesQuery = () => getIssuesQuery('openSprints()', 'in');

export {search, getIssuesQuery, getCurrentIssuesQuery};
