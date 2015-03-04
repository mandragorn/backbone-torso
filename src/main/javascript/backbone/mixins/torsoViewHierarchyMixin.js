(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['../../utils/torsoGuidManager', '../../utils/torsoTemplateRenderer'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('../../utils/torsoGuidManager'), require('../../utils/torsoTemplateRenderer'));
  } else {
    root.Torso = root.Torso || {};
    root.Torso.Mixins = root.Torso.Mixins || {};
    root.Torso.Mixins.viewHierarchy = factory(root.Torso.Utils.guidManager, root.Torso.Utils.templateRenderer);
  };
}(this, function(torsoGuidManager, torsoTemplateRenderer) {
  'use strict;'

  /**
   * Custom View mixins:
   * - Unique GUID setting
   * - creation of private collections for views
   * - cleanup methods for safe disposal of UI + events
   *
   * @module    Torso
   * @namespace Torso.Mixins
   * @class  viewHierarchy
   * @author ariel.wexler@vecna.com
   */
  var torsoViewHierarchyMixin = {
    _GUID: null,
    _childViews: null,
    tabInfo: null,

    /**
     * The super constructor / initialize method for views.
     * Creates a unique GUID for this view.
     * @method super
     */
    super: function() {
      this.generateGUID();
      this._childViews = {};
    },

    /**
     * The default initialize method should simply call the
     * super constructor.
     * @method initialize
     */
    initialize: function() {
      this.super();
    },

    /**
     * Generates and sets this view's GUID (if null)
     * @method generateGUID
     */
    generateGUID: function() {
      if (this._GUID === null) {
        this._GUID = torsoGuidManager.generate(this);
      }
    },

    /**
     * Returns the GUID
     *
     * @method getGUID
     */
    getGUID: function() {
      return this._GUID;
    },

    /**
     * Trigger a change:tab-info event, so any tab view listening can react to it.
     * @method triggerInfoChange
     */
    triggerTabInfoChange: function() {
      this.trigger('change:tab-info', this.tabInfo);
    },

    /**
     * Hotswap rendering system reroute method.
     * @method templateRender
     * See Torso.TemplateRenderer#render for params
     */
    templateRender: function(el, template, context, opts) {
      torsoTemplateRenderer.render(el, template, context, opts);
    },

    /**
     * Creates a private collection object for this view using the
     * input collection as a reference.  If the invoking view is
     * visiting this method for the first time, the view will be
     * assigned a unique requester Id.  Private collections have all
     * the functionality of the original collection, but are automatically
     * managed by the parent (passed in) collection.  That is, any view
     * using a provate collection should only have to worry about registering
     * Ids of interest, and the rest is managed behind the scenes.
     * @method createPrivateCollection
     * @param  parentCollection {Collection} The parent collection to mimic and link to
     * @return {Collection} The new private collection
     */
    createPrivateCollection: function(parentCollection) {
      return parentCollection.createPrivateCollection(this._GUID);
    },

    /**
     * Removes all events and corresponding DOM for a view.
     * Guarantees to call call "cleanSubviews" to enforce
     * recursive removal of views.
     * @method cleanupSelf
     */
    cleanupSelf: function() {
      // Clean up child views first
      this.cleanupChildViews();

      // Unbind all local event bindings
      this.unbind();
      this.off();
      this.stopListening();

      // Remove view from DOM
      this.remove();

      // Undelegates events
      this.undelegateEvents();

      // Delete the dom references
      delete this.$el;
      delete this.el;
    },

    /**
     * Default child view cleanup method that may be overriden.
     * @method cleanupChildViews
     */
    cleanupChildViews: function() {
      // do nothing
    },

    /**
     * Injects a child view and triggers a re-render on that view
     * @method injectView
     * @param injectionSite {String} The name of the injection site in the layout template
     * @param view          {View}   The instantiated view object to inject
     */
    injectView: function(injectionSite, view) {
      var injectionPoint = this.$el.find('[inject=' + injectionSite + ']');

      if (view && injectionPoint) {
        injectionPoint.html(view.$el);
        view.render();
      }
    },

    /**
     * Default render method that may be overriden.
     * @method render
     */
    render: function() {
      //do nothing
    },

    /**
     * Default pipes directly to cleanupSelf. Called while
     * recursively removing views from the hierarchy.
     * @method dispose
     */
    dispose: function() {
      this.cleanupSelf();
    }
  };

  return torsoViewHierarchyMixin;
}));
