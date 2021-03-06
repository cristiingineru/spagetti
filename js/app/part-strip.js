/* global define, dissect, update */


define(['React', 'immutable.min', 'app/core', 'app/part-hole'], function (React, Immutable, Core, partHole) {

  var stripClass = React.createClass({
    displayName: 'strip',
    getDefaultProps: function () {
      return {
        model: null
      };
    },
    render: function () {
      var unitSize = 14,
        x = this.props.model.get('x'),
        y = this.props.model.get('y'),
        width = this.props.model.get('width'),
        height = this.props.model.get('height'),
        body = React.createElement('line', {
          x1: x + unitSize / 2,
          y1: y + unitSize / 2,
          x2: x + width - unitSize / 2,
          y2: y + height - unitSize / 2,
          className: 'strip'
        });
      var holes = this.props.model.getIn(['holes'])
        .map(function (hole) {
          return React.createElement(partHole.class(), {
            model: hole,
            key: hole.get('key')
          });
        }).toArray();
      return React.createElement('g', null, [body].concat(holes));
    }
  });

  var stripProto = function (model) {
    var thisProto = Object.create(null);
    thisProto.model = function () {
      return model;
    };
    thisProto.setXY = function (x, y) {
      model = model.set('x', x);
      model = model.set('y', y);
      return this.updateStrip();
    };
    thisProto.setOrientation = function (orientation) {
      model = model.set('orientation', orientation);
      return this.updateStrip();
    };
    thisProto.setHoleCount = function (holeCount) {
      model = model.set('holeCount', holeCount);
      return this.updateStrip();
    };
    thisProto.keyify = function (keyProvider) {
      model = model.set('key', keyProvider());
      var holes = model.get('holes').map(function (hole) {
        return hole.objectify()
          .keyify(keyProvider)
          .model();
      });
      model = model.set('holes', holes);
      return this.updateStrip();
    };
    thisProto.updateStrip = function () {
      var orientation = model.get('orientation'),
        holeCount = model.get('holeCount'),
        x = model.get('x'),
        y = model.get('y'),
        unitSize = 14,
        holeSize = unitSize,
        widthCoefficient = orientation === 'horizontal' ? holeSize : 0,
        heightCoefficient = orientation === 'vertical' ? holeSize : 0,
        holes = [];

      model = model
        .set('width', orientation === 'horizontal' ? holeCount * holeSize : holeSize)
        .set('height', orientation === 'vertical' ? holeCount * holeSize : holeSize);

      for (var i = 0; i < holeCount; i++) {
        var margineOffset = holeSize / 2,
          newHole = partHole.model().objectify()
          .setXY(
            x + margineOffset + i * widthCoefficient,
            y + margineOffset + i * heightCoefficient)
          .model();
        holes.push(newHole);
      }
      model = model.set('holes', Immutable.fromJS(holes));

      return this;
    };
    thisProto.init = function () {
      return this.updateStrip();
    };
    return thisProto;
  };

  var stripModel = Immutable.fromJS({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    orientation: 'horizontal',
    holeCount: 5,
    holes: [],
    proto: stripProto
  });

  var strip = stripProto(stripModel);
  stripModel = strip
    .init()
    .model();

  return {
    class: function () {
      return stripClass;
    },
    proto: function () {
      return stripProto;
    },
    model: function () {
      return stripModel;
    }
  };
});