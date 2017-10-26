import {argv} from 'yargs';
import {search, getIssuesQuery, getCurrentIssuesQuery} from './jira';
import chart from 'bars';

const getHours = (seconds) => seconds / 3600 || 0;
const hoursByUser = (acc, {fields}) => {
  const assignee = (fields.assignee && fields.assignee.name) || 'unassigned';
  if (fields.timeoriginalestimate > 0 && fields.status.name !== 'Done') {
    acc[assignee] = (acc[assignee] || 0) + getHours(fields.timeestimate);
  }
  return acc;
};

// Hours by task state.
const chartHoursByUser = ({issues}) => console.log(chart(issues.reduce(hoursByUser, {})));
const jql = argv.sprint ? getIssuesQuery(argv.sprint) : getCurrentIssuesQuery();
search(jql).then(chartHoursByUser);
