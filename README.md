# markdown-it-prezi

> markdown-it plugin for embedding prezis

## Usage

#### Enable plugin

```js
var md = require('markdown-it')({
  html: true,
  linkify: true,
  typography: true
}).use(require('markdown-it-prezi')); // <-- this use(package_name) is required
```

#### Example

This only works in the inline style.

```md
@[prezi](https://prezi.com/1kkxdtlp4241/valentines-day/)
```

is interpreted as

```html
<p><div class="embed-responsive embed-responsive-16by9"><iframe id="iframe_container" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" width="550" height="400" src="https://prezi.com/embed/1kkxdtlp4241/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0&amp;landing_data=bHVZZmNaNDBIWnNjdEVENDRhZDFNZGNIUE43MHdLNWpsdFJLb2ZHanI5dkJIRDUyYTNMclVnU3JkQ0tsWHZ4M0l3PT0&amp;landing_sign=n17co217dmqNkcedF6feCjgLpeTnA2u5uL4TEPyWWZE"></iframe></div></p>
```

## Currently supported services
 * Prezi
