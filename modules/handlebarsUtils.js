/**
 * The handlebars reference
 * @external Handlebars
 * @see {@link https://handlebarsjs.com/|Handlebars}
 */
 /**
 * The handlebars Template reference
 * @external Handlebars-Template
 * @see {@link https://handlebarsjs.com/|Handlebars}
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['underscore'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('underscore'));
  } else {
    root.Torso = root.Torso || {};
    root.Torso.Utils = root.Torso.Utils || {};
    root.Torso.Utils.handlebarsUtils = factory(root._);
  }
}(this, function(_) {
  'use strict';

  /**
   * Extensions to handlebars helpers.
   *
   * Adds additonal helpers to {@link external:Handlebars}
   *
   * @function handlebarsUtils
   * @param {external:Handlebars} Handlebars Add the helpers to this Handlebars object.
   *
   * @author ariel.wexler@vecna.com, kent.willis@vecna.com
   *
   * @see {@link HandlebarsHelper} for the added helpers.
   * @see <a href="../annotated/modules/handlebarsUtils.html">handlebarsUtils Annotated Source</a>
   */
  /** @namespace HandlebarsHelper */
  return function(Handlebars) {
    var FEEDBACK_KEY = 'feedback';
    var MODEL_KEY = 'model';

    /**
     * Usage: {{labelFor 'fieldName' value="suffix"}}
     *
     * Generates: for="field-name-suffix"
     *
     * Usage: {{labelFor 'fieldName[x].sub' value="demo" x=123}}
     *
     * Generates: for="field-name-123_sub-demo"
     *
     * Usage: {{labelFor 'fieldName[bar].sub' value="demo" bar="abc"}}
     *
     * Generates: for="field-name_abc_sub-demo"
     *
     * @method HandlebarsHelper.labelFor
     * @param {string} field The field name to convert to a compliant "for" attribute
     * @param {Object} options The handlebars context.  Always passed in as the final argument.
     * @param {string} [option.hash.value] The value tacked on to the end of the field string (useful for radio and checkbox)
     * @returns {string} Compliant HTML generating the "for" attribute
     */
    Handlebars.registerHelper('labelFor', function(field, options) {
      options = _.extend(options, {noValueAttr: true});
      return Handlebars.helpers.formAttr(field, 'for', options);
    });

    /**
     * Usage: {{bindModel 'fieldName' value='suffix'}}
     *
     * Generates: id="field-name-suffix" name="field-name" data-model="fieldName" data-feedback="fieldName" value="demo"
     *
     * Usage: {{bindModel 'fieldName[x].sub' value='demo' x=123}}
     *
     * Generates: data-model="fieldName[123].sub" data-feedback="fieldName[123].sub" name="field-name-123_sub"
     *            id="field-name-123_sub-demo" value="demo"
     *
     * Usage: {{bindModel 'fieldName[bar].sub' value='demo' bar='abc'}}
     *
     * Generates: data-model="fieldName.abc.sub" data-feedback="fieldName[abc].sub" name="field-name_abc_sub"
                  id="field-name_abc_sub-demo" value="demo"
     *
     * @method HandlebarsHelper.bindModel
     * @param {string} field The field name to convert to compliant id, name, data-model, and data-feedback attributes
     * @param {Object} options The handlebars context.  Always passed in as the final argument.
     * @param {string} [options.hash.value] The value tacked on to the end of the field string (useful for radio and checkbox)
     * @returns {string} Compliant HTML generating the id, name, data-model, and data-feedback attributes
     */
    Handlebars.registerHelper('bindModel', function(field, options) {
      return Handlebars.helpers.formAttr(field, MODEL_KEY + ', ' + FEEDBACK_KEY + ', name, id', options);
    });

    /**
     * Usage: {{feedback 'fieldName'}}
     *
     * Generates: data-feedback="fieldName"
     *
     * Usage: {{feedback 'fieldName[x].sub' value='demo' x=123}}
     *
     * Generates: data-feedback="fieldName[123].sub"
     *
     * Usage: {{feedback 'fieldName[bar].sub value='demo' bar='abc'}}
     *
     * Generates: data-feedback="fieldName[abc].sub"
     *
     * @method HandlebarsHelper.feedback
     * @param {string} field The field name to convert to a compliant data-feedback attribute
     * @param {Object} options The handlebars context.  Always passed in as the final argument.
     * @returns {string} Compliant HTML generating the data-feedback attribute
     */
    Handlebars.registerHelper('feedback', function(field, options) {
      options = _.extend(options, {noValueAttr: true});
      return Handlebars.helpers.formAttr(field, FEEDBACK_KEY, options);
    });

    /**
     * Usage: {{formAttr 'fieldName[x].sub' 'id, for' value='demo' x=123}}
     *
     * Generates: id="field-name-123_sub-demo" for="field-name-123_sub-demo" value="demo"
     *
     * Usage: {{feedback 'fieldName[bar].sub value='demo' bar='abc'}}
     *
     * Generates: id="field-name_abc_sub-demo" for="field-name_abc_sub-demo" value="demo"
     *
     * @method HandlebarsHelper.formAttr
     * @param {string} field The field name to convert to a compliant data-feedback attribute
     * @param {Object} options The handlebars context.  Always passed in as the final argument.
     * @param {string} [options.hash.value] The value tacked on to the end of the field string (useful for radio and checkbox)
     * @param {boolean} [options.noValueAttr] when options.noValueAttr is set to true,
                                              then it will not generate the "value" attribute in the DOM.
     * @returns {string} Compliant HTML generating the data-feedback attribute
     */
    Handlebars.registerHelper('formAttr', function(field, attrs, options) {
      var i, attrName,
        value = (options.hash ? options.hash.value : undefined),
        res = Handlebars.helpers.injectFieldIndices(field, options.hash),
        resWithArrayNotation = Handlebars.helpers.injectFieldIndices(field, options.hash, { forceArrayNotation: true }),
        attributes = '';
      attrs = attrs.split(',');
      for (i = 0; i < attrs.length; i++) {
        attrName = attrs[i].trim();
        var attrEnd = (i === attrs.length - 1) ? '"' : '" ';
        if (attrName === FEEDBACK_KEY) {
          // Feedback needs to always use array notation because of the way it finds the element (by stripping [] contents).
          attributes += 'data-feedback="' + resWithArrayNotation + attrEnd;
        } else if (attrName === MODEL_KEY) {
          attributes += 'data-model="' + res + attrEnd;
        } else if (attrName === 'name') {
          attributes += 'name="' + Handlebars.helpers.dasherize(res) + attrEnd;
        } else if (attrName === 'id') {
          attributes += 'id="' + Handlebars.helpers.dasherize(res);
          if (value !== undefined) {
            attributes += '-' + value;
          }
          attributes += attrEnd;
        } else if (attrName === 'for') {
          attributes += 'for="' + Handlebars.helpers.dasherize(res);
          if (value !== undefined) {
            attributes += '-' + value;
          }
          attributes += attrEnd;
        }
      }
      if (value !== undefined && !options.noValueAttr) {
        attributes += ' value="' + value + '"';
      }
      return new Handlebars.SafeString(attributes);
    });

    /**
     * Usage: {{feedback 'fieldName[x].sub'}}
     *
     * Generates: field-name[x]_sub
     *
     * @method HandlebarsHelper.dasherize
     * @param {string} str The input string to make HTML compliant (convert to dashes)
     * @returns {string} HTML complicant / dasherized string
     */
    Handlebars.registerHelper('dasherize', function(str) {
      var camelCaseRemoved, dotsRemoved, bracesRemoved;
      camelCaseRemoved = str.replace(/([A-Z])/g, function(rep) {
        return '-' + rep.toLowerCase();
      });
      dotsRemoved = camelCaseRemoved.replace(/\./g, function() {
        return '_';
      });
      bracesRemoved = dotsRemoved.replace(/\[[0-9]+\]/g, function(rep) {
        return '-' + rep.substring(1, rep.length - 1);
      });
      return bracesRemoved;
    });

    /**
     * Usage: injectFieldIndices('test[x]-thisIsRegular-y', {x: 123, y: 456} and 'foo[x].abc', x='bar');
     *
     * Generates: 'test[123]-thisIsRegular-y' and 'foo.bar.abc'
     *
     * if options.forceArrayNotation is set then:
     *
     * Generates: 'test[123]-thisIsRegular-y' and 'foo[bar].abc'
     *
     * @method HandlebarsHelper.injectFieldIndices
     * @param {string} field The field name
     * @param {Object} indexMap A map of variables
     * @param {Object} options named parameters
     *   @param {boolean} [options.forceArrayNotation=false] Force the usage of [] insetad of . for string values.
     * @returns {string} the field string with array variables substituted
     */
    Handlebars.registerHelper('injectFieldIndices', function(field, indexMap, options) {
      if (indexMap) {
        return field.replace(/\[.+?\]/g, function(m) {
          var newIndex = indexMap[m.substring(1, m.length - 1)];
          var indexToken = '[' + (newIndex === undefined ? '' : newIndex) + ']';
          var forceArrayNotation = options && options.forceArrayNotation;
          if (_.isString(newIndex) && isNaN(newIndex) && !forceArrayNotation) {
            indexToken = '.' + newIndex;
          }
          return indexToken;
        });
      } else {
        return field;
      }
    });
  };
}));