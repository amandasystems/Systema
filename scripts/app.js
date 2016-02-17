var sqlite3 = require('sqlite3').verbose();
const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const DB_FILE = remote.getGlobal('DB_FILE');

ipcRenderer.on('db-migration-complete', function(event, arg) {
  console.log("DB migrated, now at version " + version);
});

var db = new sqlite3.Database(DB_FILE, function() {
 db.serialize(function() {
    db.each("SELECT * FROM states", function(err, row) {
      console.log(row);
    });
 });
});

db.close();
