# anchor-scroll-hash

This is a plain-JS library for enhancing anchor hash link behavior:

* Smooth scrolls to the linked element
* Tracks user scrolling and sets `data-active` attributes to be true for the link and section elements within the current scroll
* Tracks user scrolling and changes current hash in url based on scroll position

Just require it however you wish to initialize it:

```js
require('anchor-scroll-hash')
```

This uses `addEventListener`, `scrollIntoView`, and `querySelector` so may not work in old browsers unless you add polyfills.
