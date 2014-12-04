/* global define */

define(function () {

  return {

    mixin: function (source, destination) {
      Object.keys(source).forEach(function (key) {
        destination[key] = source[key];
      });
    },

    is: function (source, reference) {
      var is = true;
      Object.keys(source).forEach(function (key) {
        if (reference[key] !== undefined) {
          is = false;
        }
      });
      return is;
    }

  };
});