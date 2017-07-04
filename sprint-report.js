import {argv} from 'yargs';
import util from 'util';
import jira from './jira';

const search = (jql) => jira('search', {jql, maxResults: 500});
const getIssues = (sprint, op = '=') => search(`sprint ${op} ${sprint} and project=PW`);
const getCurrentIssues = () => getIssues('openSprints()', 'in');

const hours = (secs) => secs / 3600;

const getIssueData = (fields) => {
  return {
    title: fields.summary,
    status: fields.status.name,
    labels: fields.labels,
    assignee: (fields.assignee && fields.assignee.displayName) || 'unassigned'
  };
};


const getStoryData = (fields) => {
  return {...getIssueData(fields), points: fields.customfield_10008};
};

const getSubTaskData = (fields) => {
  return { ...getIssueData(fields), hours: hours(fields.timeoriginalestimate)};
};

const getSprintReport = async () => {
  const {issues} = await (argv.sprint ? getIssues(argv.sprint) : getCurrentIssues());
  return issues.reduce((_report, issue) => {
    const isSubTask = !!issue.fields.parent;
    const story = {[issue.key]: Object.assign(
      (isSubTask ? getSubTaskData : getStoryData)(issue.fields),
      _report[issue.id] || {}
    )};
    if (isSubTask) {
      const parentID = issue.fields.parent.id;
      if (_report[parentID] && _report[parentID].subtasks) {
        Object.assign(_report[parentID].subtasks, story);
      } else {
        _report[parentID] = {subtasks: story};
      }
    } else {
      Object.assign(_report, story);
    }
    return _report;
  }, {});
};

const log = (m) => console.log(util.inspect(m, {depth: null}));
getSprintReport().then(log);
