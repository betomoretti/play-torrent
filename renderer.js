// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const ExtraTorrentAPI = require('extratorrent-api');
const peerflix = require('peerflix');
const proc = require('child_process');
const parseTorrent = require('parse-torrent');
const et = new ExtraTorrentAPI();

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
  let torrentEngine;
  torrentCtrl.loadTorrent = (path) => {
    parseTorrent.remote(path, (err, parsedTorrent) => {
      if (err) throw err
      const opts = {
        hostname: 'localhost',
        port: 3000
      };
      torrentEngine = peerflix(parsedTorrent.infoHash, opts);

      torrentEngine.server.on('listening', () => {
        let vlc = proc.exec(`vlc http://${opts.hostname}:${opts.port}`)
        vlc.on('exit', () => torrentEngine.server.close())
      });
    })
  }
});