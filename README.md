# markdown-it-youtube

> markdown-it plugin for embedding Youtube videos.

## Usage

#### Enable plugin

```js
var md = require('markdown-it')({
  html: true,
  linkify: true,
  typography: true
}).use(require('markdown-it-youtube'); // <-- this use(package_name) is required
```

#### Example

```md
@[youtube](dQw4w9WgXcQ)
```

is interpreted as

```html
<iframe id="ytplayer" type="text/html" width="640" height="390"
  src="http://www.youtube.com/embed/dQw4w9WgXcQ"
  frameborder="0"/>
```

## Notes

This is a rough prototype. What it should be doing is checking for the service type and embedding for a variety of
services. Instead, it's hardcoded to YouTube. It's also being used as an Image plugin, and that's probably not correct.