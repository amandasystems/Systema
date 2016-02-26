import CommentBox from '../views/commentbox.jsx';

var sqlite3 = require('sqlite3').verbose();
//var jQuery = require('jquery');
//var bootstrap = require('bootstrap');
var React = require('react');
var ReactDOM = require('react-dom');
require('babel-register');

const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const DB_FILE = remote.getGlobal('DB_FILE');

ipcRenderer.on('db-migration-complete', function(event, arg) {
  console.log("DB migrated, now at version " + version);
});

window.onbeforeunload = function shutdownHandler() {
  if(db) db.close();
};

var db = new sqlite3.Database(DB_FILE, function() {
 db.serialize(function() {
    db.each("SELECT * FROM states", function(err, row) {
      console.log(row);
    });
 });
});

var data = [
    {id: 1, author: "Pete Hunt", text: "This is one comment"},
    {id: 2, author: "Jordan Walke", text: "This is *another* comment"}
];


window.onload = function() {
  ReactDOM.render(
    <CommentBox data={data} />,
    document.getElementById('container')
  );
}

db.close();
