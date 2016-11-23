// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const ExtraTorrentAPI = require('extratorrent-api');
const et = new ExtraTorrentAPI();

var app = angular.module('play-torrent', []);

app.controller('TorrentCtrl', function ($q) {
  var torrentCtrl = this;
  torrentCtrl.term = "";
  torrentCtrl.list = [];

  torrentCtrl.search = function () {
    et.search(torrentCtrl.term)
      .then(function (response) {
        torrentCtrl.list = response.results;
      })
      .catch(console.log);
  }
});