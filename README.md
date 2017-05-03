# anchor-scroll-hash

### [Demo](http://jayrbolton.github.io/anchor-hash-scroll)

This is a plain-JS library for enhancing anchor link behavior:

* Finds all anchor links and their corresponding targets on a page and tracks scrolling, setting `data-active` attributes to be true for links and targets within the current scroll
* Customizable smooth scrolling using [jump.js](https://github.com/callmecavs/jump.js).

See all smooth scrolling options [here](https://github.com/callmecavs/jump.js#options).

### Example:
```js
const anchorScroll = require('anchor-scroll-hash')
anchorScroll({
  duration: 3000
, offset: 0 - document.querySelector('#topNav').offsetHeight
})
```

This uses `addEventListener`, and `querySelector` so may not work in old browsers unless you add polyfills.
