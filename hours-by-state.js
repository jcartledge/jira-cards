import {argv} from 'yargs';
import {search, getIssuesQuery, getCurrentIssuesQuery} from './jira';
import chart from 'bars';

const getHours = (seconds) => seconds / 3600 || 0;

const hoursByState = (acc, {fields}) => {
  const status = fields.status.name;
  acc[status] = (acc[status] || 0) + getHours(fields.timeoriginalestimate);
  return acc;
};

const initialHoursByState = {
  'Abandoned': 0,
  'Done': 0,
  'In test': 0,
  'Ready for test': 0,
  'In review': 0,
  'Work In Progress': 0,
  'To Do': 0
};
const chartHoursByState = ({issues}) => {
  console.log(chart(issues.reduce(hoursByState, initialHoursByState), {bar: '#'}));
};

const jql = argv.sprint ? getIssuesQuery(argv.sprint) : getCurrentIssuesQuery();
search(jql).then(chartHoursByState);
