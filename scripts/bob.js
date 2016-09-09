// Description:
// BoB = Bot Operative Behaviour
"use strict";

const tokenize = require('./tools/words.js').tokenize;
const fetchSlackRoom = require('./tools/slack.js').fetchSlackRoom;
const getData = require('./tools/http.js').getData;

module.exports =  (robot) =>  {
  // say hello
  if(process.env.BOB_THE_BOT_ENV=="dev") {
    console.log('[dev mode 🐼]');
    fetchSlackRoom({roomName:"testbob"}).then(room => {
      robot.messageRoom(room.id, '[dev mode 🐼] Hello :earth_africa:, BoB is in the place! (reboot)')
    })
  }
  if(process.env.BOB_THE_BOT_ENV=="prod") {
    fetchSlackRoom({roomName:"general"}).then(room => {
      robot.messageRoom(room.id, 'Hello :earth_africa:, BoB is in the place! (reboot)')
    })
  }

  robot.hear(/bob/, (res) => {
    let cmd = res.envelope.message.text;
    let tokenizedCmd = tokenize(cmd);

    try {

      if (tokenizedCmd.first().equals("bob") && tokenizedCmd.length == 1) {
        res.send("What? 😜");
      }
      if (tokenizedCmd.length == 2) {
        if (tokenizedCmd.second().equals("helpme")) {
          res.send("Help your self! 😝");
        }
      }
      if (tokenizedCmd.length == 3) {
        if (tokenizedCmd.second().equals("restos")) {
          // do something more functional
          try {
            let town = tokenizedCmd.third();
            getData({path:`https://raw.githubusercontent.com/k33g/bob.the.bot.data/master/restos.json`}).then(data => {
              res.send(data[town].map(resto => {
                return `${resto.name} (${resto.type}): ${resto.url}\n`
              }).join(""));

            }).catch(err => {
              console.log(err)
              res.send("Huston? We've got a problem 😱");
            })
          } catch(err) {
            console.log(err)
            res.send("Huston? We've got a problem 😱");
          }
        }
      }

    } catch(err) {
      console.log(err)
      res.send("Huston? We've got a problem 😱");
    }

  });

};
