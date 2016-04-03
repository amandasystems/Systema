import {GlobalTodoList, TopNavbar, SideBar, TodaysTasksList,
       ProjectsList} from '../views/todo_widgets.jsx';

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

var tasks = [
  {id: 1, todo: "TODO", is_done: false, description: "Finish up the design for Systema", tags: ["design"], effort: 105},
  {id: 2, todo: "TODO", is_done: false, description: "Design a pretty logo (see also #1)", tags: ["home", "computer"], effort: 90},
  {id: 3, todo: "TODO", is_done: false, description: "Do the dishes", tags: ["housework", "brain-free"], effort: 1232},
  {id: 6, todo: "DONE", is_done: true, description: "Clean the bathroom", tags: ["housework", "brain-free"], effort: 20}
];

var todaysTasks = tasks;

var projects = [{id: 4, is_stalled: false,
                 description: "Project Z",
                 comment: "A slightly longer project example.",
                 tags : ["project-tag"]},
               {id: 5, is_stalled: true,
                 description: "A stalled project",
                 comment: "This project is unfortunately stalled. :(",
                 tags : ["sourdoughs"]}];

window.onload = function() {
  ReactDOM.render(
      <div>
      <TopNavbar/>
      <div className="container-fluid">
      <div className="row">
      <SideBar/>
      <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
      <h1 className="page-header">Dashboard</h1>
      <button className="button btn btn-default" type="button">ADD TASK</button>
      <TodaysTasksList tasks={todaysTasks}/>
      <ProjectsList projects={projects}/>
      <GlobalTodoList tasks={tasks}/>
      </div>
      </div>
      </div>
      </div>,
    document.getElementById('container')
  );
};

db.close();
