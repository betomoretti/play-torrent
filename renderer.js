// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const ExtraTorrentAPI = require('extratorrent-api');
const peerflix = require('peerflix');
const numeral = require('numeral');
const request = require('request');
const fs = require('fs');
const proc = require('child_process');
const subxfinder = require('subxfinder');
const EventEmitter = require('events');
class SubtitleEmitter extends EventEmitter {};
const _ = require('lodash');
const parseTorrent = require('parse-torrent');
const et = new ExtraTorrentAPI();

let app = angular.module('play-torrent', []);
app.controller('TorrentCtrl', function ($rootScope, $scope) {

  let torrentCtrl = this;
  torrentCtrl.term = "";
  torrentCtrl.list = [];
  let subtitleEmitter = new SubtitleEmitter();

  torrentCtrl.search = () => {
    et.search(torrentCtrl.term)
      .then((response) => {
        torrentCtrl.list = _.orderBy(response.results, ['seeds', 'leechers', 'quality'],['desc', 'desc', 'desc']);
        $rootScope.$digest();
      })
      .catch(console.log);
  }

  let torrentEngine;

  torrentCtrl.loadTorrent = (path) => {
    let verified = 0
    let downloadedPercentage = 0

    parseTorrent.remote(path, (err, parsedTorrent) => {
      if (err) throw err
      const opts = {
        hostname: 'localhost',
        port: 3000
      };
      torrentEngine = peerflix(parsedTorrent.infoHash, opts);

      torrentEngine.server.on('listening', () => {
        let vlc = proc.exec(`vlc http://${opts.hostname}:${opts.port}`)
        vlc.on('exit', () => {
          torrentEngine.server.close();
          torrentEngine.destroy();
          $scope.$apply(() => {
            $scope.speed = numeral(0.0).format('0.0b');
            $scope.downloaded = 0
          })
        })
      });

      torrentEngine.on('verify', () => {
        verified++
        let value = verified / torrentEngine.torrent.pieces.length * 100;
        downloadedPercentage = Math.floor(value);
        $scope.$apply(() => {
          $scope.speed = numeral(torrentEngine.swarm.downloadSpeed()).format('0.0b');
          $scope.downloaded = downloadedPercentage
        });
      });

      // const params = torrentCtrl.term.split(" ");
      // const serie = params[0];
      // const episode = params[1];
      // subxfinder.searchAndFilter(serie, episode, true, (err, subtitleList) => {
      //   if(err) console.log(err);
      //   for (var i = 0; i < subtitleList.length; i++) {
      //     let file = fs.createWriteStream(subtitle.title);
      //     const subtitle = subtitleList[i];
      //     request.get(subtitle.link)
      //       .on('data', (chunk) => {

      //       });
      //   }
      // });
    });


  }
});