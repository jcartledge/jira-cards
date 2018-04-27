You’ll need a couple of things to make it work:
 
You’ll need [nodejs](http://nodejs.org) and [yarn](http://yarnpkg.com) installed locally.

Run `yarn install` in the cloned repo to install dependencies.

You’ll need to create a config.json file in the jira-cards directory containing a single object with your jira username and password:

```json
{
  "username": "foo", 
  "Password": "bar"
}
```

You should then be able to run the following commands:
```bash
yarn run hours # report of how many subtask hours are in each state
```

```bash
yarn run users # report of how many unfinished subtask hours are assigned to each user
```

If you have [gnu watch](https://linux.die.net/man/1/watch) on your path you can also run the following commands:

```bash
yarn run watchHours # report of how many subtask hours are in each state, updates every 30 seconds
```

```bash
yarn run watchUsers # report of how many unfinished subtask hours are assigned to each user, updates every 30 seconds
```
