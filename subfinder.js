const subxfinder = require('subxfinder');
const request = require('request');
const fs = require('fs');
const unzip = require('unzip');

const serie = 'homeland';
const episode = 'S05E01';
subxfinder.searchAndFilter(serie, episode, true, (err, subtitleList) => {
  if(err) console.log(err);
  // let streamList = [];
  // for (let i = 0; i < subtitleList.length; i++) {
  //   const subtitle = subtitleList[i];
  //   streamList.push(fs.createWriteStream(`./${subtitle.title}-${i}`));
  // }
  let out = fs.createWriteStream('out');
  for (let i = 0; i < subtitleList.length; i++) {
    const subtitle = subtitleList[i];

    request.get(subtitle.link).pipe(unzip.Extract({path: 'out'}))

      // .on('data', (chunk) => {
      //   streamList[i].write(chunk)
      // })
      // .on('error', console.log);
  }
});