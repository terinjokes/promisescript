# Promise Script

> A simple JavaScript loader built utilizing promises.

## Install

```
npm install promisescript
```

## [Contrived] Example

```javascript
var promisescript = require('promisescript');

function loadFacebook() {
  return promisescript('//connect.facebook.net/en_US/all.js').then(function() {
    appId: 'YOUR_APP_ID',
    channelUrl: '//github.com/terinjokes/promisescript'
  });
}

loadFacebook.then(function() {
  FB.XFBML.parse();
});
```

## Notes

1. If you make multiple requests to the same URL, it will only be fetched once and the same promise will be returned.
2. The promises returned by this module meet the ES6 standard, and are thus barebones; you may wish to coerce it into a promise of your favorite library.

## License

MIT
