# markdown-it-video

> markdown-it plugin for embedding hosted videos.

## Usage

#### Enable plugin

```js
var md = require('markdown-it')({
  html: true,
  linkify: true,
  typography: true
}).use(require('markdown-it-video'); // <-- this use(package_name) is required
```

#### Example

This only works in the inline style.

```md
@[youtube](dQw4w9WgXcQ)
```

is interpreted as

```html
<p><iframe id="ytplayer" type="text/html" width="640" height="390"
  src="http://www.youtube.com/embed/dQw4w9WgXcQ"
  frameborder="0"/></p>
```

## Currently supported services
 * YouTube