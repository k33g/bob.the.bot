"use strict";
const tokenize = require('./tools/words.js').tokenize;

module.exports =  (robot) =>  {
  robot.hear(/42/, (res) => res.send("https://en.wikipedia.org/wiki/42_(number)#The_Hitchhiker.27s_Guide_to_the_Galaxy"))
};
