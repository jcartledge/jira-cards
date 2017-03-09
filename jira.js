import fetch from 'node-fetch';
import btoa from 'btoa';
import settings from './config.json';

const credentials = `${settings.username}:${settings.password}`;
const jiraURL = 'https://vu-pmo.atlassian.net';

export default function jira(call, data) {
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
