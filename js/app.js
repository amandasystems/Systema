import {TopNavbar, SideBar, Dashboard} from '../js/views/todoWidgets.jsx';
import {TodoModel} from '../js/model.js';

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

var db = new sqlite3.Database(DB_FILE);

var model = new TodoModel(db);

window.onload = function() {
  ReactDOM.render(
      <div>
      <TopNavbar/>
      <div className="container-fluid">
      <div className="row">
      <SideBar/>
      <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
      <h1 className="page-header">Dashboard</h1>
      <Dashboard model={model}/>
      </div>
      </div>
      </div>
      </div>,
    document.getElementById('container')
  );
};

db.close();
