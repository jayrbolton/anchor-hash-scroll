# anchor-hash-scroll

### [Demo](http://jayrbolton.github.io/anchor-hash-scroll)

### Features:
* Finds all anchor links and their corresponding targets on a page and tracks scrolling, setting `data-active` attributes to true for links and targets within the current scroll.
* Customizable smooth scrolling using [jump.js](https://github.com/callmecavs/jump.js).
* Uses `pushState` to keep track of anchor jumping history.
* Supports dynamic page layouts (elements changing height after ajax, etc...).

See **jump.js** smooth scrolling options [here](https://github.com/callmecavs/jump.js#options).

## Install

_With npm_

```sh
npm install --save anchor-hash-scroll
```

```js
const scroll = require('anchor-hash-scroll')
scroll({
  offset: 32, // Amount of top padding for each section
  duration: 1500  // Milliseconds for the smooth scroll
})
```

_Using a CDN_

You can use unpkg with the URL: unpkg.com/anchor-hash-scroll/dist/build.min.js

```html
<script src='//unpkg.com/anchor-hash-scroll/dist/build.min.js'></script>
```

## Usage

For the NPM version, you can pass in configuration when you initialize it:

```js
const anchorScroll = require('anchor-hash-scroll')
// takes options for smooth scrolling (jump.js)
anchorScroll({
  duration: 3000,
  offset: 0 - document.querySelector('#topNav').offsetHeight
})
```

When using via the CDN, you can configure it by using the global `window.anchorHashScroll` object:

```js
window.anchorHashScroll.config({
  duration: 3000,
  offset: 0
})
```

## Browser compatibility

This module uses `addEventListener` and `querySelector`, and no other modern features. Jump.js supports IE10+

## Development

Build the distributions and example with `npm run build-all`

Run the example with something like `npm install -g serve && serve docs`

Lint the code with `npm run lint`
