/* global define */

define(['React', 'immutable.min', 'app/core'], function (React, Immutable, Core) {

  var bodyClass = React.createClass({
    displayName: 'part-body',
    getDefaultProps: function () {
      return {
        model: null,
        owner: null
      };
    },
    render: function () {
      var LayoutManager = require('app/layoutManager');
      var handlerAdapter = LayoutManager.myHandlerAdapter(this.props.owner);
      return React.createElement('rect', {
        x: this.props.model.get('x'),
        y: this.props.model.get('y'),
        width: this.props.model.get('width'),
        height: this.props.model.get('height'),
        stroke: '#ceb27a',
        fill: '#E6C88C',
        rx: 4,
        ry: 4,
        onClick: handlerAdapter.onBodyClickHandler
      });
    }
  });
  
  var bodyProto = function (model) {
    var thisProto = {};
    thisProto.model = function () {
      return model;
    };
    thisProto.setX = function (x) {
      model = model.set('x', x);
      return this;
    };
    thisProto.setY = function (y) {
      model = model.set('y', y);
      return this;
    };
    thisProto.setXY = function (x, y) {
      model = model.set('x', x);
      model = model.set('y', y);
      return this;
    };
    thisProto.setWidth = function (width) {
      model = model.set('width', width);
      return this;
    };
    thisProto.setHeight = function (height) {
      model = model.set('height', height);
      return this;
    };
    return thisProto;
  };

  var bodyModel = Immutable.fromJS({
    x: 0,
    y: 0,
    width: 20,
    height: 60,
    proto: bodyProto
  });

  return {
    class: function () {
      return bodyClass;
    },
    proto: function () {
      return bodyProto;
    },
    model: function () {
      return bodyModel;
    }
  };
});