/* global define, console */

define(['React', 'react.draggable', 'immutable.min', 'app/state', 'app/diagram'], function (React, Draggable, Immutable, State, Diagram) {

  var getTargetInComponents = function (components, key) {
    for (var i = 0; i < components.count(); i++) {
      var component = components.getIn([i]);
      if (component.get('key') === key) {
        return {
          value: component,
          replace: function (newValue) {
            components.set(i, newValue.deref());
          },
          delete: function () {
            components.delete(i);
          }
        };
      }
    }
    throw new Error('Attempted to use an invalid key.');
  };

  var getTarget = function (key) {
    var diagram = State.cursor().get('diagram');
    var components = diagram.getIn(['components']);
    return getTargetInComponents(components, key);
  };

  var redraw = function () {
    var element = React.createElement(Diagram.class(), {
      model: State.cursor().get('diagram')
    });
    React.render(element, document.getElementById('svg'));
  };

  var onState = function (fn) {
    var state = State.state();
    state = fn(state);
    State.state(state);
  };
  var onDiagram = function (fn) {
    return function (parent) {
      var diagram = parent.get('diagram');
      diagram = fn(diagram);
      return parent.set('diagram', diagram);
    };
  };
  var onComponents = function (fn) {
    return function (parent) {
      var components = parent.get('components');
      components = components.map(fn);
      return parent.set('components', components);
    };
  };
  var onLegs = function (fn) {
    return function (parent) {
      var legs = parent.get('legs');
      legs = legs.map(fn);
      return parent.set('legs', legs);
    };
  };

  return {
    reactDraggableAdapter: function (model) {
      var key = model.get('key');
      return {
        handleStart: function (event, ui) {
          //console.log('*** START ***');
        },
        handleDrag: function (event, ui) {
          //console.log('*** DRAG ***');
          var target = getTarget(key);
          var newValue = target.value.deref().cursor().objectify()
            .setXY(event.clientX, event.clientY)
            .model();
          target.replace(newValue);
          redraw();
        },
        handleStop: function (event, ui) {
          //console.log('*** STOP ***');
          redraw();
        }
      };
    },
    myHandlerAdapter: function (model) {
      var key = model.get('key');
      return {
        onClickHandler: function (event, ui) {
          if (!key) {
            return;
          }
          var newSelections = State.cursor().getIn(['selections']).deref().withMutations(function (s) {
            s.push(key);
          });
          State.cursor().set('selections', newSelections);
        },
        onKeyPressHandler: function (event, ui) {
          var selections = State.cursor().getIn(['selections']).deref();

          for (var i = 0; i < selections.count(); i++) {
            var selection = selections.get(i);
            var components = State.cursor().getIn(['diagram', 'components']);
            getTargetInComponents(components, selection).delete();
          }

          var newSelections = State.cursor().getIn(['selections']).deref().withMutations(function (s) {
            s.clear();
          });
          State.cursor().set('selections', newSelections);

          ///
          {
            onState(
              onDiagram(
                onComponents(
                  onLegs(function (leg) {
                    var length = (leg.get('length') !== 40) ? 40 : 20;
                    leg = leg.cursor().objectify()
                      .setLength(length)
                      .model().deref();
                    return leg;
                  })
                )
              )
            );
          }
          ///

          redraw();
        }
      };
    }
  };

});