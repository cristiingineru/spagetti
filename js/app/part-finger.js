/* global define */


define(['react'], function (React) {

  var fingerClass = React.createClass({
    displayName: 'part-finger',
    getDefaultProps: function () {
      return {
        x: 0,
        y: 0
      };
    },
    render: function () {
      var radius = 4;
      return React.createElement('circle', {
        r: radius,
        cx: this.props.x,
        cy: this.props.y,
        stroke: '#004400',
        fill: '#004400'
      });
    }
  });

  var fingerModel = 'TODO';

  return {
    class: fingerClass,
    model: fingerModel
  };
});