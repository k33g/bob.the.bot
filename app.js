var exec = require('child_process').exec;
var cmd = `HUBOT_SLACK_TOKEN=${process.env.HUBOT_SLACK_TOKEN} ./bin/hubot --adapter slack`;

console.log("🚀 process.env.HUBOT_SLACK_TOKEN", process.env.HUBOT_SLACK_TOKEN)
try {
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error("🤖:", err);
      return;
    }
    console.log(stdout);
  });
} catch(err) {
  console.error("😱:", err);
}
