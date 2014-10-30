# Promise Script

> A simple JavaScript and CSS loader built using Promises.

## Install

```
npm install --save promisescript
```

## Usage

```javascript
var promisescript = require('promisescript');

function loadRecaptcha() {
  return promisescript({
    url: '//www.google.com/recaptcha/api/js/recaptcha_ajax.js',
    type: 'script',
    exposed: 'Recaptcha',
  }).then(function() {
    return new Promise(function(resolve) {
      Recaptcha.create('0123456789abcdef', 'recaptcha_widget', {
        theme: 'clean',
        callback: resolve
      });
    });
  });
}

loadRecaptcha().then(function() {
  console.log(Recaptcha.get_challenge());
}).catch(function(e) {
  console.error('An error loading or executing Recaptcha has occured: ', e.message);
});
```

## API

### Source Object
A source object is fully specified when it contains three properties:

* `url`, the URL that should be fetched
* `type`, either "script" or "style", which defines the type of the URL being fetched.
* `exposed`, a string that is checked against the global object to determine if the script successfully loaded.
  A deeply nested property can be checked by providing a dot-separated string.
  This property is not required, but required to check if a script loaded successfully in Internet Explorer, as this browser does not have an error event.

### A Single Source Object

This module accepts a single source object, and returns a single Promise that resolve if successfully loaded, or rejected if it fails.

### Multiple Source Objects

Additionally this module can accept multiple source objects as an array.
An array of Promises is returned, in the same order as provided.

### Strings

If you’re feeling lazy, and don’t care about Internet Explorer support, you can provide a string or an array of strings that represents script or style URLs.
When utilizing this functionality, this module assumes URLs representing styles end in “.css”, and all others are assumed to be scripts.

### Clearing Cache

To avoid fetching the same URL multiple times, the Promise is cached, which is fine behavior most use cases.
However, this cache can be cleared by calling `promisescript.clear`.

## Notes

1. If you make multiple requests to the same URL, it will only be fetched once and the same Promise will be returned.
2. The Promises returned by this module meet the ES6 standard, and are thus barebones; you may wish to coerce it into a Promise of your favorite library.

## License

MIT
