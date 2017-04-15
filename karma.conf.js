'use strict';
module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'mocha'],

    files: [
      'tests/*.js',
      {
        pattern: 'tests/fixtures/*',
        watched: true,
        included: false,
        served: true
      }
    ],

    preprocessors: {
      'tests/*.js': ['browserify']
    },

    reporters: ['mocha', 'coverage'],

    colors: true,

    logLevel: config.LOG_INFO,

    browserify: {
      debug: true,
      transform: [
        ['espowerify'],
        ['browserify-istanbul', {ignore: ['**/*.handlebars']}]
      ]
    },

    coverageReporter: {
      reporters: [{type: 'html'}, {type: 'text'}]
    }
  });
};
