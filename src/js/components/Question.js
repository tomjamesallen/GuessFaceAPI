var React = require('react');
var Link = require('react-router').Link;

var Question = React.createClass({
  render: function () {
    return <h2>Question</h2>;

    // return (
    //   <div>
    //     {[{title: 'something'}, {title: 'another title'}].map(function (object, i) {
    //       return <div>{object.title}</div>
    //     })}
    //   </div>
    // );
  }
});

module.exports = Question;