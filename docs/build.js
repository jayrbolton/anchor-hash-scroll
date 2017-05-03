(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var scroll = require('../index.js')

function elm(name) { return document.createElement(name) }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randHeight(){return rand(3, 100) + 'rem'}
function changeHeight(ev) {
  ev.target.parentElement.style.paddingBottom = randHeight() 
}

var nav = elm('nav')
var main = elm('main')
var sectionNames = ['A','B','C','D','E','F','G']
var body = document.body
var eyes = '&#128064;'

sectionNames.forEach(function(x) {
  var section = elm('section')
  var h1 = elm('h1')
  var a = elm('a') 
  var btn = elm('button')
  var span = elm('span')
  btn.innerHTML = 'Change height'
  btn.addEventListener('click', changeHeight)
  a.href = '#' + x
  a.innerHTML = x
  span.innerHTML = eyes
  h1.innerHTML = 'Section ' + x 
  h1.appendChild(span)
  section.id = x
  section.style.paddingBottom = randHeight()
  section.appendChild(h1)
  section.appendChild(btn)
  nav.appendChild(a)
  main.appendChild(section)
})

body.appendChild(nav)
body.appendChild(main)
var navHeight = nav.offsetHeight
body.style.paddingTop = navHeight + 'px'

scroll({
  offset: 0 - navHeight 
})


},{"../index.js":2}],2:[function(require,module,exports){
var jump = require('jump.js')

function init(config) {
  // Find all anchor links that have a hash href
  var currentHash = null
  var sel = 'a[href^="#"]'
  var anchors = document.querySelectorAll(sel)
  var elems = []
  for(var i = 0 ; i < anchors.length ; ++i) {
    var anchor = anchors[i]
    var id = anchor.getAttribute('href')
    var section = document.querySelector(id)
    if(section) {
      var elem = {id: id, anchor: anchor, section: section}
      elems.push(elem)
      anchor.addEventListener('click', handleClick(section, config))
    }
  }
  // Track scrolling and change the url and link states based on current section
  window.addEventListener('scroll', function(e) {
    findSection(elems, currentHash, config)
  })
}

function handleClick(section, config) {
  return function(ev) {
    ev.preventDefault()
    setTimeout(function(ts) { 
      history.pushState(null, '', '#' + section.id)
    }, config.duration || 1000)
    jump(section, config)
  }
}

// Activate an element as the current section
function activateElem(elems, idx, currentHash) {
  // First, deactivate all
  for(var i = 0 ; i < elems.length; ++i) {
    elems[i].anchor.removeAttribute('data-active')
    elems[i].section.removeAttribute('data-active')
  }
  var elem = elems[idx]
  currentHash = elem.id
  elem.anchor.setAttribute('data-active', 'true')
  elem.section.setAttribute('data-active', 'true')
}

// Find the current section within view based on scrollY
function findSection(elems, currentHash, config) {
  var scrollPos =  (window.scrollY || window.pageYOffset) - (config.offset || 0)

  // Find the farthest-down element whose y coord is lte to scrollPos
  var found = null
  for(var i = 0, passed = false; i < elems.length && !passed; ++i) {
    if(elems[i].section.offsetTop <= scrollPos) found = i
    else passed = true
  }
  var elem = elems[found]
  if(elem && elem.id !== currentHash) activateElem(elems, found, currentHash)
}

module.exports = function (config) {
  if(!window._anchorScrollHashInitialized) {
    init(config)
    window._anchorScrollHashInitialized = true
  }
}


},{"jump.js":3}],3:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Jump = factory());
}(this, (function () { 'use strict';

// Robert Penner's easeInOutQuad

// find the rest of his easing functions here: http://robertpenner.com/easing/
// find them exported for ES6 consumption here: https://github.com/jaxgeller/ez.js

var easeInOutQuad = function easeInOutQuad(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var jumper = function jumper() {
  // private variable cache
  // no variables are created during a jump, preventing memory leaks

  var element = void 0; // element to scroll to                   (node)

  var start = void 0; // where scroll starts                    (px)
  var stop = void 0; // where scroll stops                     (px)

  var offset = void 0; // adjustment from the stop position      (px)
  var easing = void 0; // easing function                        (function)
  var a11y = void 0; // accessibility support flag             (boolean)

  var distance = void 0; // distance of scroll                     (px)
  var duration = void 0; // scroll duration                        (ms)

  var timeStart = void 0; // time scroll started                    (ms)
  var timeElapsed = void 0; // time spent scrolling thus far          (ms)

  var next = void 0; // next scroll position                   (px)

  var callback = void 0; // to call when done scrolling            (function)

  // scroll position helper

  function location() {
    return window.scrollY || window.pageYOffset;
  }

  // element offset helper

  function top(element) {
    return element.getBoundingClientRect().top + start;
  }

  // rAF loop helper

  function loop(timeCurrent) {
    // store time scroll started, if not started already
    if (!timeStart) {
      timeStart = timeCurrent;
    }

    // determine time spent scrolling so far
    timeElapsed = timeCurrent - timeStart;

    // calculate next scroll position
    next = easing(timeElapsed, start, distance, duration);

    // scroll to it
    window.scrollTo(0, next);

    // check progress
    timeElapsed < duration ? window.requestAnimationFrame(loop) // continue scroll loop
    : done(); // scrolling is done
  }

  // scroll finished helper

  function done() {
    // account for rAF time rounding inaccuracies
    window.scrollTo(0, start + distance);

    // if scrolling to an element, and accessibility is enabled
    if (element && a11y) {
      // add tabindex indicating programmatic focus
      element.setAttribute('tabindex', '-1');

      // focus the element
      element.focus();
    }

    // if it exists, fire the callback
    if (typeof callback === 'function') {
      callback();
    }

    // reset time for next jump
    timeStart = false;
  }

  // API

  function jump(target) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    // resolve options, or use defaults
    duration = options.duration || 1000;
    offset = options.offset || 0;
    callback = options.callback; // "undefined" is a suitable default, and won't be called
    easing = options.easing || easeInOutQuad;
    a11y = options.a11y || false;

    // cache starting position
    start = location();

    // resolve target
    switch (typeof target === 'undefined' ? 'undefined' : _typeof(target)) {
      // scroll from current position
      case 'number':
        element = undefined; // no element to scroll to
        a11y = false; // make sure accessibility is off
        stop = start + target;
        break;

      // scroll to element (node)
      // bounding rect is relative to the viewport
      case 'object':
        element = target;
        stop = top(element);
        break;

      // scroll to element (selector)
      // bounding rect is relative to the viewport
      case 'string':
        element = document.querySelector(target);
        stop = top(element);
        break;
    }

    // resolve scroll distance, accounting for offset
    distance = stop - start + offset;

    // resolve duration
    switch (_typeof(options.duration)) {
      // number in ms
      case 'number':
        duration = options.duration;
        break;

      // function passed the distance of the scroll
      case 'function':
        duration = options.duration(distance);
        break;
    }

    // start the loop
    window.requestAnimationFrame(loop);
  }

  // expose only the jump method
  return jump;
};

// export singleton

var singleton = jumper();

return singleton;

})));

},{}]},{},[1]);
