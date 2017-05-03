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
    var section = document.querySelector('[id="' + id.replace('#', '') + '"]')
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

