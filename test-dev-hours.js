import jira from './jira';

const search = jql => jira('search', {jql, maxResults: 500});
const getCurrentIssues = _ => search('sprint in openSprints() and project=PW');
const getHours = seconds => seconds / 3600 || 0;

const hoursByType = (acc, {fields}) => {
  const type = fields.issuetype.name.match(/^Test/) ? 'test' : 'dev';
  acc[type] = (acc[type] || 0) + getHours(fields.timeoriginalestimate);
  return acc;
};

// Hours by task type.
const logHoursByType = ({issues}) => console.log(issues.reduce(hoursByType, {}));
getCurrentIssues().then(logHoursByType);
