var sqlite3 = require('sqlite3').verbose();
const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const DB_FILE = remote.getGlobal('DB_FILE');

ipcRenderer.on('db-migration-complete', function(event, arg) {
  console.log("DB migrated, now at version " + version);
});

console.log(DB_FILE);

var db = new sqlite3.Database(DB_FILE);

// db.serialize(function() {
//     db.run("CREATE TABLE if not exists lorem (info TEXT)");

//     var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//     for (var i = 0; i < 10; i++) {
//         stmt.run("Ipsum " + i);
//     }
//     stmt.finalize();

//     db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
//         console.log(row.id + ": " + row.info);
//     });
// });
