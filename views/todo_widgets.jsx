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

export default class TodoButton extends React.Component {
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

export default class TodoDescriptionRow extends React.Component {

    render() {

        var clockElement = null;

        if(this.props.clockedIn) {
            clockElement = (<span className="badge">
                <i className="fa fa-clock-o"></i>
                &nbsp;{formatMinutes(this.props.clockedTime, 's')}
                </span>);
        }

        return(
            <td>
            {this.props.task.description}
            &nbsp;
            {clockElement}
            </td>
            );
    }

}

export default class TodoListItem extends React.Component {
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


export default class GlobalTodoList extends React.Component {

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
