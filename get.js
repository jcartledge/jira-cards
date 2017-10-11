import {argv} from 'yargs';
import jira from './jira';
import chart from 'ascii-horizontal-barchart';

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
const getHours = (seconds) => seconds / 3600 || 0;

const hoursByState = (acc, {fields}) => {
  const status = fields.status.name;
  acc[status] = (acc[status] || 0) + getHours(fields.timeoriginalestimate);
  return acc;
};

const chartHoursByState = ({issues}) => {
  console.log(chart(issues.reduce(hoursByState, {}), true));
};

const jql = argv.sprint ? getIssuesQuery(argv.sprint) : getCurrentIssuesQuery();
search(jql).then(chartHoursByState);
