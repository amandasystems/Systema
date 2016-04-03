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