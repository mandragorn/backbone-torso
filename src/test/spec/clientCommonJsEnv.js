var rootPath = '../../..',
  distPath = rootPath + '/dist',
  testPath = distPath + '/test',
  jsdom = require('jsdom'),
  Promise = require('promise'),
  handlebars = require('handlebars');

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
      scripts: [__dirname + '/' + testPath + '/testCommonJsEnv.js',
                __dirname + '/' + rootPath + '/node_modules/jquery-mockjax/jquery.mockjax.js'],
      features: {
        FetchExternalResources   : ['script'],
        ProcessExternalResources : ['script'],
        MutationEvents           : '2.0',
        QuerySelector            : false
      },
      done: function(error, window) {
        //jsdom.getVirtualConsole(window).sendTo(console); /* uncomment to see window's console */

        if (error) {
          console.log("Error loading environment: ");
          console.log(error);
          console.log();
          reject(error)
        }

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
