var distPath = '../../../dist',
    testPath = distPath + '/test',
    jsdom = require('jsdom'),
    Promise = require('promise'),
    handlebars = require('handlebars'),
    argv = require('minimist')(process.argv);

/**
 * @method [Anonymous]
 * @return a promise that resolves when the environment is set up.
 * The promise resolves with a window parameter and a routes parameter. The window is the virtual dom window
 * and the routes is a map from unique key to mockjax entry
 */
module.exports = function() {
  return new Promise(function(resolve, reject) {
    jsdom.env({
      html: '<html><body></body></html>',
      scripts: [__dirname + '/' + testPath + '/testEnv.js'],
      features: {
        FetchExternalResources   : ['script'],
        ProcessExternalResources : ['script'],
        MutationEvents           : '2.0',
        QuerySelector            : false
      },
      done: function(error, window) {
        if (argv.v) {
          jsdom.getVirtualConsole(window).sendTo(console);
        }

        if (error) {
          console.log("Error loading environment: ");
          console.log(error);
          console.log();
          reject(error)
        }

        // This sync is needed because TestView.js imports a compiled .hbs file outside of the window's scope so it uses a different
        // Set of handlebars helpers.
        window._.each(window.Handlebars.helpers, function(helperFunction, helperName) {
          handlebars.registerHelper(helperName, helperFunction);
        });

        resolve({
          window: window,
          routes: require(testPath + '/mockjax')(window.$)
        });
      }
    });
  });
};
