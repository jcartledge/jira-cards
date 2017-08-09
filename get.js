import {argv} from 'yargs';
import jira from './jira';
import chart from 'ascii-horizontal-barchart';

const search = (jql) => jira('search', {jql, maxResults: 500});
const getIssues = (sprint, op = '=') => search(`sprint ${op} ${sprint} and project=PW`);
const getCurrentIssues = () => getIssues('openSprints()', 'in');
const getHours = (seconds) => seconds / 3600 || 0;

const hoursByState = (acc, {fields}) => {
  const status = fields.status.name;
  acc[status] = (acc[status] || 0) + getHours(fields.timeoriginalestimate);
  return acc;
};

const chartHoursByState = ({issues}) => {
  console.log(chart(issues.reduce(hoursByState, {}), true));
};

(argv.sprint ? getIssues(argv.sprint) : getCurrentIssues()).then(chartHoursByState);
