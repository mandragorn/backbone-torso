(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('underscore'), require('backbone'));
  } else {
    root.Torso = root.Torso || {};
    root.Torso.events = factory(root._, root.Backbone);
  };
}(this, function(_, Backbone) {
  'use strict;'

  /**
   * Generic Events.
   * @module    Torso
   * @namespace Torso
   * @class     events
   * @constructor
   * @author ariel.wexler@vecna.com, kent.willis@vecna.com
   */
  var torsoEvents = _.extend({}, Backbone.Events);

  return torsoEvents;
}));
