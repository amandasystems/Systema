'use babel';

import React from 'react';

export default class Comment extends React.Component {
    render() {
        return(
         <div className="comment">
            <h3 className="commentAuthor">
                {this.props.author}
            </h3>
            {this.props.children.toString()}
         </div>
        );
    }
}


export default class CommentList extends React.Component {
    render() {
        var commentNodes = this.props.data.map(function(comment) {
            return(
                <Comment author={comment.author} key={comment.id}>{comment.text}</Comment>
            );
        });
        return (
            <div className="commentList">
            {commentNodes}
            </div>
        );
    }
}

export default class CommentForm extends React.Component {
    render() {
        return(
            <div className="commentForm">
            <input type="text" placeholder="Your name" />
            <input type="text" placeholder="Say something..." />
            <input type="submit" value="Post" />
            </div>
        );
    }
}

export default class CommentBox extends React.Component {
  render() {
    return (<div className="commentBox">This is a CommentBox!
      Here\'s a camera: <i className="fa fa-camera-retro fa-2x"/>.
        <h1>Comments</h1>
        <CommentList data={this.props.data} />
        <CommentForm /></div>);

  }
}
