import gplay from 'google-play-scraper';


// gplay.search({
//   term: "Insta",
//   num: 2
// }).then(console.log, console.log);

gplay.reviews({
  appId: 'com.instagram.android',
  // term: "Instagram",
  sort: gplay.sort.RATING,
  num: 2
}).then(console.log, console.log);
