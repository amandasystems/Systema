'use strict';

var sqlite3 = require('sqlite3').verbose();
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
var fs = require('fs');
var path = require('path');

const LATEST_DB_VERSION = 1;

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

// migrate the database as appropriate
function dbMigrate(command, version) {
  console.log("MIGRATING DB!");

  // execute actual migration
  if(command) {
    db.exec(command.toString(), function maybeContinueMigration(err) {
      dbErrorLogger(err);

      if(err) {
        app.quit();
        return;
      }

      db.get("PRAGMA user_version", [], function extractVersion(err, data) {
        if(err) {
          console.log(err);
          app.quit();
          return;
        }

        if (data['user_version'] !== LATEST_DB_VERSION) {
          dbMigrate(null, data['user_version']);
        }

      });
    });

    return;
  }

  if(version === null || version === undefined) {
    version = "init";
  }

  if(command === null) {
    var migrationFile = path.join(__dirname, 'migrations/', (version + '.sql'));
    fs.readFile(migrationFile, function(err, data) {
      if(err) {
        console.log("Error performing migrations: " + err);
        app.quit();
      }

      dbMigrate(data);
    });
  }

};

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

  console.log(app.getPath('userData'));

  db = new sqlite3.Database(':memory:',
                            sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
                            dbMigrate);

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
