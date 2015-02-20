/* global define, require, describe, it, xit, expect, beforeEach, afterEach, jasmine */


define(['app/spaghetti', 'immutable.min'], function (Spaghetti, Immutable) {
  describe('Spaghetti', function () {

    beforeEach(function () {
      Spaghetti.init();
    });

    afterEach(function () {
      Spaghetti.init();
    });


    it('should be a singleton object', function () {
      var newSpaghetti = require('app/spaghetti');
      expect(newSpaghetti).toBe(Spaghetti);
    });

    it('should reinitialize the state when init() is called', function () {
      var value = 'random value';
      Spaghetti.state(value);
      expect(Spaghetti.state()).toBe(value);
      var newSpaghetti = Spaghetti.init();
      expect(newSpaghetti).toBe(Spaghetti);
      expect(Spaghetti.state()).not.toBe(value);
    });

    it('should have a getter and a setter function for the current state', function () {
      var value = 'random value';
      expect(Spaghetti.state(value)).toBe(value);
      expect(Spaghetti.state()).toBe(value);
    });

    it('should create a checkpoint when checkpoint() is called', function () {
      var checkpoint = Spaghetti.checkpoint();
      expect(checkpoint).not.toBeNull();
      expect(checkpoint.id).toEqual(jasmine.any(Number));
    });

    it('should create a named checkpoint when checkpoint() is called with a name', function () {
      var name = 'my name is X',
        checkpoint = Spaghetti.checkpoint(name);
      expect(checkpoint.name).toBe(name);
    });

    it('should a have checkpoint list', function () {
      var checkpoints = [];
      checkpoints.push(Spaghetti.checkpoint());
      checkpoints.push(Spaghetti.checkpoint('my name is X'));
      checkpoints.push(Spaghetti.checkpoint('my name is Y'));
      expect(Spaghetti.checkpoints).toEqual(checkpoints);
    });
    
    xit('should restore the state to a previous checkpoint when undo() is called');
    xit('should restore the state to a next checkpoint when redo() is called');
    xit('should restore the state to a specific checkpoint when restore() is called with an id');

  });
});