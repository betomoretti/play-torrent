// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const ExtraTorrentAPI = require('extratorrent-api');
const peerflix = require('peerflix');
const parseTorrent = require('parse-torrent');
const et = new ExtraTorrentAPI();
const request = require('request')

var app = angular.module('play-torrent', []);
app.controller('TorrentCtrl', function ($rootScope) {
  let torrentCtrl = this;
  torrentCtrl.term = "";
  torrentCtrl.list = [];

  torrentCtrl.search = () => {
    et.search(torrentCtrl.term)
      .then((response) => {
        torrentCtrl.list = response.results;
        $rootScope.$digest();
      })
      .catch(console.log);
  }

  torrentCtrl.loadTorrent = (path) => {
    parseTorrent.remote(path, (err, parsedTorrent) => {
      if (err) throw err
      // const uri = parseTorrent.toMagnetURI(parsedTorrent.infoHash);
      peerflix(parsedTorrent.infoHash);
    })
  }
});