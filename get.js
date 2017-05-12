import {argv} from 'yargs';
import jira from './jira';
import {save} from './db';

const search = (jql) => jira('search', {jql, maxResults: 500});
const getIssues = (sprint, op = '=') => search(`sprint ${op} ${sprint} and project=PW`);
const getCurrentIssues = () => getIssues('openSprints()', 'in');
const getHours = (seconds) => seconds / 3600 || 0;

const hoursByState = (acc, {fields}) => {
  const status = fields.status.name;
  acc[status] = (acc[status] || 0) + getHours(fields.timeoriginalestimate);
  return acc;
};

// Hours by task state.
const logHoursByState = ({issues}) => save(issues.reduce(hoursByState, {}));
(argv.sprint ? getIssues(argv.sprint) : getCurrentIssues()).then(logHoursByState);
