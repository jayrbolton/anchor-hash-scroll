var jump = require('jump.js')
var state = {}

module.exports = function init (config) {
  if (state.initialized) return
  else state.initialized = true
  config.offset = config.offset || 0
  config.duration = config.duration || 1000
  // Find all anchor links that have a hash href
  var sel = 'a[href^="#"]'
  var anchors = document.querySelectorAll(sel)
  var elems = []
  for (var idx = 0; idx < anchors.length; ++idx) {
    var anchor = anchors[idx]
    var id = anchor.getAttribute('href')
    var section = document.querySelector(id)
    if (section) {
      var elem = {id: id, anchor: anchor, section: section}
      elems.push(elem)
      anchor.addEventListener('click', handleClick(elems, idx, config))
    }
  }
  // Track scrolling and change the url and link states based on current section
  window.addEventListener('scroll', function () {
    findSection(elems, config)
  })
}

function handleClick (elems, idx, config) {
  var section = elems[idx].section
  config.callback = function () {
    state.jumping = false
  }
  return function (ev) {
    ev.preventDefault()
    if (state.jumping) return
    state.jumping = true
    window.history.pushState({}, '', '#' + section.id)
    activateElem(elems, idx)
    jump(section, config)
  }
}

// Activate a the nav-link element as the current section
function activateElem (elems, idx) {
  deactivate(elems)
  var elem = elems[idx]
  elem.anchor.setAttribute('data-active', 'true')
  elem.section.setAttribute('data-active', 'true')
}

function deactivate (elems) {
  for (var i = 0; i < elems.length; ++i) {
    elems[i].anchor.removeAttribute('data-active')
    elems[i].section.removeAttribute('data-active')
  }
}

// Find the current section within view based on scrollY
function findSection (elems, config) {
  if (state.jumping) return
  var scrollPos = (window.scrollY || window.pageYOffset) - config.offset

  // Find the farthest-down element whose y coord is lte to scrollPos
  var foundIdx = -1
  for (var idx = 0; idx < elems.length && foundIdx < 0; ++idx) {
    var section = elems[idx].section
    var top = section.offsetTop + config.offset
    var bottom = top + section.offsetHeight
    if (scrollPos >= top && scrollPos < bottom) {
      foundIdx = idx
    }
  }
  if (foundIdx < 0) {
    deactivate(elems)
    return // foundIdx = elems.length - 1
  }
  var elem = elems[foundIdx]
  if (elem && ('#' + elem.id) !== window.location.hash) {
    activateElem(elems, foundIdx)
  }
}
