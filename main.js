'use strict';

var sqlite3 = require('sqlite3').verbose();
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
var fs = require('fs');
var path = require('path');

const LATEST_DB_VERSION = 1;

global['DB_FILE'] = path.join(app.getPath('userData'), 'systema.sqlite');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Free resources etc.
function cleanupQuit() {
  console.log("QUITTING!");
  if(db) {
    db.close();
  }
}

function dbErrorLogger(err) {
  if(err) {
    console.log("DB error: " + err);
  } else {
    console.log("DB: Successfully EXEC:d query!");
  }

  return err;
}

/**
 * Determine the current DB version, and invoke the callbac with the
 * version number and error code (if any).
 */
function getDbVersion(callback) {
  db.get("PRAGMA user_version", [],
         function passOnVersion(err, data) {
           if(err) {
             callback(err, data);
           } else {
             callback(err, data['user_version']);
           }
         });
}

/**
 * Actually perform the migration from a given version.
 * The callback is given an error, if any.
 */
function performMigration(version, dbCallback) {
  if(version == null || version == 0) {
    version = "init";
  }

  var migrationFile = path.join(__dirname, 'migrations/', (version + '.sql'));
  fs.readFile(migrationFile, function(err, data) {
    if(err) {
      console.log("Error reading migrations file: " + err);
      app.quit();
    }

    db.exec(data.toString(), dbCallback);
  });
}

/**
 * Keep running migrations if the version is too low.
 */
function chainMigrations(error) {
  if(error) {
    console.log("Error performing chained migration: " + error);
    return;
  }

  getDbVersion(maybeMigrate);
}

/**
 * Possibly perform migrations on the database.
 * Short-circuits on error, otherwise continues migrating until
 * migrations are completed.
 */
function maybeMigrate(err, version) {
  if(err) {
    console.log("Error migrating DB! " + err);
    return;
  }

  console.log("Performing migration for DB version " + version);

  if(version < LATEST_DB_VERSION) {
    console.log("Migration needed!");
    performMigration(version, chainMigrations);
  } else {
    console.log("Migration not needed!");
    console.log("Done migrating -- closing DB!");
    db.close();
    db = null;
    mainWindow.webContents.send('db-migration-complete', version);
  }

}

var db = null;

app.on('before-quit', cleanupQuit);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// Make sure only a single instance is ever running:
var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
  return true;
});

if (shouldQuit) {
  console.log("Another process already running -- quitting!");
  app.quit();
  return;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600,
                                  title: 'Systema',
                                  'auto-hide-menu-bar': true});

  /* FIXME should be a file, should be callback from whatever ensures
   the config dir exists.*/
  db = new sqlite3.Database(DB_FILE,
                            sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
                            chainMigrations);

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
