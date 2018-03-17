# anchor-hash-scroll

### [Demo](http://jayrbolton.github.io/anchor-hash-scroll)

### Features:
* Finds all anchor links and their corresponding targets on a page and tracks scrolling, setting `data-active` attributes to true for links and targets within the current scroll.
* Customizable smooth scrolling using [jump.js](https://github.com/callmecavs/jump.js).
* Uses `pushState` to keep track of anchor jumping history.
* Supports dynamic page layouts (elements changing height after ajax, etc...).

See **jump.js** smooth scrolling options [here](https://github.com/callmecavs/jump.js#options).

### Example:
```js
const anchorScroll = require('anchor-hash-scroll')
// takes options for smooth scrolling (jump.js)
anchorScroll({
  duration: 3000
, offset: 0 - document.querySelector('#topNav').offsetHeight
})
```

This uses `addEventListener`, and `querySelector` so may not work in old browsers unless you add polyfills.
