'use babel';

import React from 'react';
import pretty from 'pretty-time';

function formatMinutes(minutes, fmt) {
    // format is [seconds, nanoseconds]
    return pretty([60 * minutes, 0], fmt);
};

function formatLongMinutes(minutes) {
    // format is [seconds, nanoseconds]
    return pretty([60 * minutes, 0], 'm');
}

class TodoButton extends React.Component {
    render() {
        return(
            <button
            type="button"
            className="btn btn-default todo-keyword btn-xs">
            {this.props.todoState}
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
    render() {
        return (
            <tr>
            <td>{this.props.task.id}</td>
            <td>
            <TodoButton todoState={this.props.task.todo}/>
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

    sumMinutes() {
        return this.props.tasks.reduce(function(previousValue, task, _currentIndex, _array) {
            return previousValue + task.effort;
        }, 0);
    }

    render() {
      var rows = [];

      this.props.tasks.forEach(function(task) {
          rows.push(<TodoListItem task={task} key={task.id}/>);
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

export class TodaysTasksList extends React.Component {
    render() {
        return (
        <div className="row">
            <h2 className="sub-header">Today's tasks</h2>
            <div className="progress">
              <div className="progress-bar progress-bar-success progress-bar-striped"
role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"
style={{width: "40%"}}>
                40% done with today's tasks!
              </div>
            </div>
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
                <tbody>
                  <tr>
                    <td>1</td>
                    <td><button type="button" className="btn btn-default todo-keyword btn-xs">TODO</button></td>
                    <td>Finish up the design for Systema <span className="badge"><i className="fa fa-clock-o"/> 0:30</span></td>
                    <td>2:00</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td><button type="button" className="btn btn-default todo-keyword btn-xs">TODO</button></td>
                    <td>Design a pretty logo (see also <a href="#">#1</a>) <span className="listing-tag">@home @computer</span></td>
                    <td>0:15</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
    );
    }

}

export class ProjectsList extends React.Component {
    render() {
        return (
            <div class="row">
            <h2 className="sub-heading">Projects </h2>
            <div className="row placeholders">
              <div className="col-xs-6 col-sm-3 placeholder">
                <img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="200" height="200" className="img-responsive" alt="Generic placeholder thumbnail"/>
                  <h4>Project A</h4>
                  <span className="text-muted">Something else</span>
              </div>
              <div className="col-xs-6 col-sm-3 placeholder">
                <img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="200" height="200" className="img-responsive" alt="Generic placeholder thumbnail"/>
                <h4>Project B</h4>
                <span className="text-muted">Something else</span>
              </div>
              <div className="col-xs-6 col-sm-3 placeholder">
                <img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="200" height="200" className="img-responsive" alt="Generic placeholder thumbnail"/>
                <h4>Project C</h4>
                <span className="text-muted">Something else</span>
              </div>
              <div className="col-xs-6 col-sm-3 placeholder">
                <img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="200" height="200" className="img-responsive" alt="Generic placeholder thumbnail"/>
                <h4>Project D</h4>
                <span className="text-muted">Something else</span>
              </div>
            </div>
          </div>
        );
    }
}
