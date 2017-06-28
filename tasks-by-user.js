import {argv} from 'yargs';
import jira from './jira';

const search = (jql) => jira('search', {jql, maxResults: 500});
const getIssues = (sprint, op = '=') => search(`sprint ${op} ${sprint} and project=PW`);
const getCurrentIssues = () => getIssues('openSprints()', 'in');
const getHours = (seconds) => seconds / 3600 || 0;

const hoursByUser = (acc, {fields}) => {
  const assignee = (fields.assignee && fields.assignee.name) || 'unassigned';
  if (fields.timeoriginalestimate > 0 && fields.status.name !== 'Done') {
    acc[assignee] = (acc[assignee] || 0) + getHours(fields.timeestimate);
  }
  return acc;
};

// Hours by task state.
const logHoursByUser = ({issues}) => console.dir(issues.reduce(hoursByUser, {}));
(argv.sprint ? getIssues(argv.sprint) : getCurrentIssues()).then(logHoursByUser);
