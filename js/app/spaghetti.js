/* global define */

define(['immutable.min', 'immutable.cursor'], function (Immutable, Cursor) {

  // keep it here so the state() or init() functions can work even whithout 'this'
  var theWholeState;

  function Spaghetti() {
    this.init();
  }

  Spaghetti.prototype.init = function () {
    theWholeState = Immutable.fromJS({});
    this.undoCheckpoints = [];
    this.redoCheckpoints = [];
    this.nextCheckpointId = 0;
    this.allCheckpoints = [];
    return this;
  };

  Spaghetti.prototype.state = function (newValue) {
    if (newValue !== undefined) {
      theWholeState = newValue;
    }
    return theWholeState;
  };


  Spaghetti.prototype.redraw = function () {};

  Spaghetti.prototype.setRedraw = function (fn) {
    this.redraw = fn;
    return this;
  };
  
  Spaghetti.prototype.checkpointsRedraw = function () {};
  
  Spaghetti.prototype.setCheckpointsRedraw = function (fn) {
    this.checkpointsRedraw = fn;
    return this;
  };

  /**
   * The order of storing the checkpoints in the undo stack is:
   *  [oldest, old, ... new, newest]
   **/
  Spaghetti.prototype.undoCheckpoints = [];

  /**
   * The order of storing the checkpoints in the redo stack is:
   *  [oldest undo, old undo, ... new undo, newest undo]
   **/
  Spaghetti.prototype.redoCheckpoints = [];

  Spaghetti.prototype.nextCheckpointId = 0;
  
  /**
   * All checkpoints ever created. This list is necessary because
   * creating a new checkpoint after an undo operation will empy
   * the redo checkpoints list.
   **/
  Spaghetti.prototype.allCheckpoints = [];

  Spaghetti.prototype.checkpoint = function (name) {
    var checkpoint = {
      state: theWholeState,
      id: this.nextCheckpointId,
      name: name,
      timestamp: Date.now(),
      previous: this.undoCheckpoints[this.undoCheckpoints.length - 1]
    };
    this.undoCheckpoints.push(checkpoint);
    this.allCheckpoints.push(checkpoint);
    this.redoCheckpoints = [];
    this.nextCheckpointId += 1;
    this.checkpointsRedraw();
    return checkpoint;
  };

  Spaghetti.prototype.checkpoints = function () {
    return this.allCheckpoints;
  };

  Spaghetti.prototype.undo = function () {
    if (this.undoCheckpoints.length > 1) {
      var checkpoint = this.undoCheckpoints.pop();
      this.redoCheckpoints.push(checkpoint);

      var currentCheckpoint = this.undoCheckpoints[this.undoCheckpoints.length - 1];
      theWholeState = currentCheckpoint.state;
    }
    this.checkpointsRedraw();
  };

  Spaghetti.prototype.redo = function () {
    if (this.redoCheckpoints.length > 0) {
      var checkpoint = this.redoCheckpoints.pop();
      this.undoCheckpoints.push(checkpoint);

      var currentCheckpoint = this.undoCheckpoints[this.undoCheckpoints.length - 1];
      theWholeState = currentCheckpoint.state;
    }
    this.checkpointsRedraw();
  };
  
  Spaghetti.prototype.currentCheckpoint = function () {
    return this.undoCheckpoints[this.undoCheckpoints.length - 1];
  };

  return new Spaghetti();
});