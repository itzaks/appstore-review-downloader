const store = require("app-store-scraper");
const converter = require("json-2-csv");
const fs = require('fs');
const args = require('minimist')(process.argv.slice(2));


let json2csvCallback = function (err, csv) {
    if (err) throw err;
    fs.writeFile("output.csv", csv, function(writeError) {
      if(writeError) {
          return console.log(writeError);
      }
      console.log("Exported reviews to output.csv");
  }); 
};


(() => {
  var currentPage = 0;
  var collectedResponse = [];
  var countries = args._
  const id = args.id

  if (!id) {
    throw new Error('No -id specified');
  }

  if (countries.length == 0) {
    throw new Error('No country specified')
  }
  countries = countries.reverse()
  var currentRegion = countries.pop()

  function scrape() {
    store.reviews({
      id: id,
      sort: store.sort.RECENT,
      country: currentRegion,
      page: currentPage
    })
    .then((result) => {
      if (result.length > 0 && currentPage < 10) {
        collectedResponse = collectedResponse.concat(result)
        currentPage += 1;
        console.log("GOT ONE PAGE FOR COUNTRY", currentRegion, "SIZE", result.length)
        scrape()
      } else {
        if (countries.length > 0) {
          currentRegion = countries.pop()
          currentPage = 0
          scrape()
        } else {
          console.log("GOT COMPLETE RESPONSE", collectedResponse.length, countries)
          converter.json2csv(collectedResponse, json2csvCallback);
        }
      }
    })
    .catch(console.log);
  }
  scrape()
})()