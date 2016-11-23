// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const ExtraTorrentAPI = require('extratorrent-api');
const et = new ExtraTorrentAPI();

var app = angular.module('play-torrent', []);

app.controller('TorrentCtrl', function ($rootScope) {
  var torrentCtrl = this;
  torrentCtrl.term = "";
  torrentCtrl.list = [];

  torrentCtrl.search = function (term) {

    et.search(term)
      .then(function (response) {
        torrentCtrl.list = response.results;
        $rootScope.$digest();
      })
      .catch(console.log);
  }
});