'use babel';

import React from 'react';
import pretty from 'pretty-time';

const REGULAR_TODO = "TODO";
const REGULAR_DONE = "DONE";

function formatMinutes(minutes, fmt) {
    // format is [seconds, nanoseconds]
    return pretty([60 * minutes, 0], fmt);
};

function formatLongMinutes(minutes) {
    // format is [seconds, nanoseconds]
    return pretty([60 * minutes, 0], 'm');
}

function isNotDone(task) {
    return !task.is_done;
}

function isDone(task) {
    return task.is_done;
}


class TodoButton extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        this.props.onClick();
    }

    render() {

        var todoMarker = this.props.todoState;

        if (this.props.todoState == REGULAR_TODO) {
            todoMarker = <i className="fa fa-circle-o fa-lg"/>;
        } else if (this.props.todoState == REGULAR_DONE) {

            todoMarker = <i className="fa fa-check-circle-o fa-lg"/>;
        }

        return(
            <button
            type="button"
            className="btn btn-default todo-keyword btn-xs"
            onClick={this.handleClick}>
            {todoMarker}
                </button>
        );
    }
}

class TodoDescriptionRow extends React.Component {

    formatTags() {
        var atTags = this.props.task.tags.map(
            function concatAt(tag) {return "@" + tag;});
        return atTags.join(" ");
    }

    render() {

        var clockElement = null;

        if(this.props.clockedIn) {
            clockElement = (<span className="badge">
                <i className="fa fa-clock-o"></i>
                &nbsp;{formatMinutes(this.props.clockedTime, 's')}
                </span>);
        }

        var tagsElement = null;
        if(this.props.task.tags.length > 0) {
            tagsElement = (<span className="listing-tag">{this.formatTags()}</span>);
        }

        return(
            <td>
            {this.props.task.description}
            &nbsp;
            {clockElement}
            {tagsElement}
            </td>
            );
    }

}

class TodoListItem extends React.Component {

    constructor(props) {
        super(props);
        this.handleTodoClick = this.handleTodoClick.bind(this);
    }

    handleTodoClick() {
        this.props.onTodoChange(this.props.task.id, this.props.task.todo);
    }

    render() {
        return (
            <tr>
            <td>{this.props.task.id}</td>
            <td>
            <TodoButton todoState={this.props.task.todo} onClick = {this.handleTodoClick}/>
            </td>
            <TodoDescriptionRow task={this.props.task}
                                clockedIn={false}
                                clockedTime={43} />
            <td>{formatMinutes(this.props.task.effort, 'm')}</td>
            </tr>
        );
    }
}

export class GlobalTodoList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            point : null,
            tasks : props.tasks,
            uncompletedOnly : false,
            markedIds : [] };

        /* connect methods as described in
          https://facebook.github.io/react/docs/reusable-components.html#no-autobinding
          */
        this.onTodoChange.bind(this);
    }

    onTodoChange(id, currentTodo) {
        console.log("Changed TODO with id " + id + " and state " + currentTodo);

        // FIXME: this transition needs to be fetched from the DB
        // Also, it could possibly be disallowed (e.g. toggling a DONE state)

        var newTasks = this.state.tasks.map(function nextState(task) {
            if(task.id === id) {
                var newTask = task;
                newTask.todo = "DONE";
                newTask.isDone = true;
                return newTask;
            }
            else {
                return task;
            }});

        this.setState({tasks : newTasks});

    }

    activeTasks() {
        return this.state.tasks.filter(isNotDone);
    }

    sumMinutes() {
        return this.activeTasks().reduce(function(previousValue, task) {
            return previousValue + task.effort;
        }, 0);
    }

    render() {
      var rows = [];

      this.activeTasks().forEach(function(task) {
          rows.push(<TodoListItem task={task} key={task.id}
              onTodoChange={(id, todo) => {this.onTodoChange(id, todo)}} />);
      }.bind(this));

      return (
          <div className="row">
          <h2 className="sub-heading">All tasks</h2>
          <p>You currently have an estimated {formatLongMinutes(this.sumMinutes())} worth of tasks.</p>
          <div className="table-responsive">
          <table className="table table-stripped">
          <thead>
          <tr>
          <th>#</th>
          <th>State</th>
          <th></th>
          <th><i className="fa fa-clock-o"></i></th>
          </tr>
          </thead>
          <tbody>{rows}</tbody>
          </table>
          </div>
          </div>
      );

  }
}

export class TopNavbar extends React.Component {

    render() {
        return (
            <nav className="navbar navbar-fixed-top">
            <div className="container-fluid">
            <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#"><i className="fa fa-cubes"></i> Systema.</a>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
            <ul className="nav navbar-nav navbar-right">
            <li><a href="#"><i className="fa fa-cog fa-lg" alt="Settings"></i></a></li>
            <li><a href="#"><i className="fa fa-question-circle fa-lg" alt="Help"></i></a></li>
            </ul>
            <form className="navbar-form navbar-right">
            <input type="text" className="form-control" placeholder="Search..."/>
            </form>
            </div>
            </div>
            </nav>
        );
    }

}

export class SideBar extends React.Component {

    render() {
        return(
            <div className="col-sm-3 col-md-2 sidebar">
            <ul className="nav nav-sidebar">
            <li className="active"><a href="#"><i className="fa fa-dashboard"></i> Overview <span className="sr-only">(current)</span></a></li>
            <li><a href="#"><i className="fa fa-inbox fa-align-left fa-fw"></i> Inbox <span className="badge">17</span></a></li>
            <li><a href="#"><i className="fa fa-crosshairs fa-align-left fa-fw"></i> Projects</a></li>
            <li><a href="#"><i className="fa fa-pencil-square-o fa-align-left fa-fw"></i> Notes</a></li>
            <li><a href="#"><i className="fa fa-archive fa-align-left fa-fw"></i> Archive</a></li>
          </ul>
          <ul className="nav nav-sidebar">
            <li><a href="#"><i className="fa fa-tags"></i> Tags</a></li>
            <li><a href="#"><i className="fa fa-list"></i> Lists</a>
              <ul><li><a href="#">List a</a></li></ul>
            </li>
          </ul>
        </div>
        );
    }

}

class TodayProgressBar extends React.Component {

    render() {
        return (
            <div className="progress">
            <div className="progress-bar progress-bar-success progress-bar-striped"
            role="progressbar" aria-valuenow={this.props.progress}
            aria-valuemin="0" aria-valuemax="100"
            style={{width: this.props.progress + "%"}}>
            {this.props.progress}% done with todays tasks!
              </div>
            </div>
        );
    }

}


export class TodaysTasksList extends React.Component {

    doneTasks() {
        return this.props.tasks.filter(isDone);
    }

    getProgressPercentage() {
        var numDoneTasks = this.doneTasks().length;
        return (numDoneTasks / this.props.tasks.length) * 100;
    };

    render() {

        var rows = [];

        this.props.tasks.forEach(function(task) {
            rows.push(<TodoListItem task={task} key={task.id}/>);
        }.bind(this));

        return (
        <div className="row">
            <h2 className="sub-heading">Todays tasks</h2>
            <TodayProgressBar progress={this.getProgressPercentage()}/>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>State</th>
                    <th></th>
                    <th><i className="fa fa-clock-o"></i></th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </table>
            </div>
          </div>
    );
    }

}

class ProjectItem extends React.Component {


    render() {

        var stalledIndicator = null;

        if(this.props.project.is_stalled) {
            stalledIndicator = (<span className="badge badge-warning">stalled!</span>);
        }

        return (
            <div className="col-xs-6 col-sm-3 placeholder">
            <img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="200" height="200" className="img-responsive" alt="Generic placeholder thumbnail"/>
            <h4>#{this.props.project.id}: {this.props.project.description} {stalledIndicator}</h4>
            <span className="text-muted">{this.props.project.comment}</span>
            </div>
        );

        return <p>Look at me! Im an item!</p>;
    }
}

export class ProjectsList extends React.Component {
    render() {

        var items = [];

        this.props.projects.forEach(function(project) {
            items.push(<ProjectItem project={project} key={project.id}/>);
        }.bind(this));

        return (
            <div className="row">
            <h2 className="sub-heading">Projects </h2>
            <div className="row placeholders">
            {items}
            </div>
            </div>
        );
    }
}
