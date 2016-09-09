# bob.the.bot
bob.the.bot

## Run BoB

- for tests in Terminal: `./bin/hubot`


## Connect to Slack

https://api.slack.com/bot-users
creating a new bot user
choose the team
-  type username
- Click on "Add bot integration" (then copy the token)
- Add an icon
- Click on "Save Integration"

Then in Slack, invite bob as a team member in a room

Run BoB to test with Slack: `HUBOT_SLACK_TOKEN=<token> ./bin/hubot --adapter slack
`
## Bob commands

- `bob helpme`
- `bob help`
- `bob restos <town>`
  - if you want to add some restaurants, this is here https://github.com/k33g/bob.the.bot.data/blob/master/restos.json
- `bob joe dassin` :stuck_out_tongue_winking_eye:
- `hey joe` :grinning:

## dev

Add this environment variables:

```
export BOB_THE_BOT_ENV=dev
```

## prod

Add this environment variables:

```
export BOB_THE_BOT_ENV=prod
export HUBOT_SLACK_TOKEN=<token>
```

## prod with CleverCloud

> WIP status ok, have to be documented

## Add features to BoB

It's easy! Just put a JavaScript or CoffeeScript (:scream:) file like that in `scripts/`:

```javascript
"use strict";

module.exports =  (robot) =>  {

  robot.hear(/ping/, (res) => {
    res.send("pong");
  })

  robot.hear(/pong/, (res) => {
    res.send("ping");
  })

};
```

or see `scripts/feature.joe.dassin.js`

> about contributing: please add `feature` at the begining of the file name :octocat: :heart:
