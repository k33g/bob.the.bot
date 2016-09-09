"use strict";

const tokenize = require('./tools/words.js').tokenize;
const stools = require('./tools/stools.js');
const Yelp = require('yelp');

const show = stools.show
const Maybe = stools.Maybe;
const Validation = stools.Validation;

module.exports =  (robot) =>  {
  console.log("🐨", "feature.yelp", "loaded")

  let yelpConsumerKey = Maybe.fromNullable(process.env.yelp_consumer_key);
  let yelpConsumerSecret = Maybe.fromNullable(process.env.yelp_consumer_secret);
  let yelpToken = Maybe.fromNullable(process.env.yelp_token);
  let yelpTokenSecret = Maybe.fromNullable(process.env.yelp_token_secret);

  let validateYelpConsumerKey = (maybe) => {
    return maybe.isSome()
      ? Validation.Success(maybe.value)
      : Validation.Fail(["😠 no yelp consumer key"])
  }

  let validateYelpConsumerSecret = (maybe) => {
    return maybe.isSome()
      ? Validation.Success(maybe.value)
      : Validation.Fail(["😡 no yelp consumer secret"])
  }

  let validateYelpToken = (maybe) => {
    return maybe.isSome()
      ? Validation.Success(maybe.value)
      : Validation.Fail(["☹️ no yelp token"])
  }

  let validateYelpTokenSecret = (maybe) => {
    return maybe.isSome()
      ? Validation.Success(maybe.value)
      : Validation.Fail(["😩 no yelp token secret"])
  }


  let searchFrenchRestos = ({yelpInstance, keywords, city}) => {
    return yelpInstance.search({ term: `resto ${keywords}`, location: `${city}, France` })
    .then(data => {
      return data.businesses;
    })
  }


  let yelpValidation = Validation.of(
    yelpConsumerKey =>
      yelpConsumerSecret =>
        yelpToken =>
          yelpTokenSecret => {
            return {yelpConsumerKey, yelpConsumerSecret, yelpToken, yelpTokenSecret}
          }
  )

  yelpValidation
    .ap(validateYelpConsumerKey(yelpConsumerKey))
    .ap(validateYelpConsumerSecret(yelpConsumerSecret))
    .ap(validateYelpToken(yelpToken))
    .ap(validateYelpTokenSecret(yelpTokenSecret))
    .cata(
      failures => {
        console.log("--- 💔 failures ---")
        console.log(failures.join("\n"))
        console.log("------------------")
      },
      success => {
        console.log("👏", success)
        const yelp = new Yelp({
          consumer_key: success.yelpConsumerKey,
          consumer_secret: success.yelpConsumerSecret,
          token: success.yelpToken,
          token_secret: success.yelpTokenSecret,
        });

        robot.hear(/bob/, (res) => {
          let cmd = res.envelope.message.text;
          let tokenizedCmd = tokenize(cmd);
          // bob find restos lyon
          if (tokenizedCmd.length >= 4) {
            if (tokenizedCmd.second().equals("find") && tokenizedCmd.third().equals("restos")) {
              let city = tokenizedCmd.fourth();
              let keywords = tokenizedCmd.slice(4).join(" ");

              searchFrenchRestos({yelpInstance: yelp, keywords: keywords, city: city})
                .then(results => {
                  let message = [];
                  results.forEach(resto => {
                    message.push(`${resto.name} rating: ${resto.rating}`);
                    message.push(`${resto.location.display_address}`);
                    message.push(`${resto.display_phone}`);
                    message.push(`${resto.url}`);
                    //message.push(`${resto.snippet_text}`);
                    //message.push(``);
                  })
                  res.send(message.join("\n"))
                })
                .catch(err => {
                  console.error(err);
                  res.send("😜 I think your search is totally mad!")
                });
            }
          }
        })
      }); //end of catamorphism
};
