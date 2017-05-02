(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var scroll = require('../index.js')

function elm(name) { return document.createElement(name) }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randHeight(){return rand(3, 100) + 'rem'}
function changeHeight(ev) {
  var parentSection = ev.target.parentElement
  parentSection.style.paddingBottom = randHeight() 
}

var nav = elm('nav')
var main = elm('main')
var sectionNames = ['A','B','C','D','E','F','G']
var body = document.body

sectionNames.forEach(function(x, i) {
  var section = elm('section')
  var h1 = elm('h1')
  var a = elm('a') 
  var btn = elm('button')
  btn.innerHTML = 'Change height'
  btn.addEventListener('click', changeHeight)
  a.href = '#' + x
  a.innerHTML = x
  h1.innerHTML = 'Section ' + x
  section.id = x
  section.style.paddingBottom = randHeight()
  section.appendChild(h1)
  section.appendChild(btn)
  nav.appendChild(a)
  main.appendChild(section)
})

body.appendChild(nav)
body.appendChild(main)

scroll()


},{"../index.js":2}],2:[function(require,module,exports){

function getPageScroll() { return window.scrollY || window.pageYOffset }

// Main initialization function to add scroll functionality
function init(config) {
  // Find all anchor links that have a hash href
  var currentHash = null
  var sel = 'a[href^="#"]'
  var anchors = document.querySelectorAll(sel)
  var elems = []
  for(var i = 0 ; i < anchors.length ; ++i) {
    var anchor = anchors[i]
    var id = anchor.getAttribute('href')
    var section = document.querySelector('[id="' + id.replace('#', '') + '"]')
    if(section) {
      var elem = {id: id, anchor: anchor, section: section, top: section.offsetTop}
      elems.push(elem)
    }
  }

  // Track scrolling and change the url and link states based on current section
  window.addEventListener('scroll', function(e) {
    findSection(elems, currentHash)
  })
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
  history.pushState(null, '', elem.id)
  elem.anchor.setAttribute('data-active', 'true')
  elem.section.setAttribute('data-active', 'true')
}

// Find the current section within view based on scrollY
function findSection(elems, currentHash) {
  var scrollPos =  getPageScroll() 

  // Find the farthest-down element whose y coord is lte to scrollPos
  var found = null
  for(var i = 0, passed = false; i < elems.length && !passed; ++i) {
    if(elems[i].top <= scrollPos) found = i
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


},{}]},{},[1]);
