import fetch from 'node-fetch';
import btoa from 'btoa';
import settings from './config.json';

const credentials = `${settings.username}:${settings.password}`;
const jiraURL = 'https://vu-pmo.atlassian.net';

function apiCall(call, data) {
  const request = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(credentials)}`
    },
    method: 'post',
    body: JSON.stringify(data)
  };
  return fetch(`${jiraURL}/rest/api/2/${call}`, request);
}

const json = response => response.json();
const search = jql => apiCall('search', {jql, maxResults: 500}).then(json);
const getCurrentIssues = _ => search('sprint in openSprints() and project=PW');
const getHours = seconds => seconds / 3600 || 0;
const totalHours = (acc, {fields}) => acc + getHours(fields.timeoriginalestimate);
const logTotalHours = ({issues}) => console.log(issues.reduce(totalHours, 0));

const hoursByState = (acc, {fields}) => {
  const status = fields.status.name;
  acc[status] = (acc[status] || 0) + getHours(fields.timeoriginalestimate);
  return acc;
}

// Hours by task type
const logHoursByState = ({issues}) => console.log(issues.reduce(hoursByState, {}));

getCurrentIssues().then(logHoursByState);
