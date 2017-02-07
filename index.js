// Only initialize once ever
if(!window._anchorScrollHashInitialized) {
  initialize()
  window._anchorScrollHashInitialized = true
}

var autoScrolling = false
var currentHash = null

// Main initialization function to add scroll functionality
function initialize() {
  // Find all anchor links that have a hash href
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
      anchor.addEventListener('click', handleClick(elems, elems.length-1))
    }
  }

  // Track scrolling and change the url and link states based on current section
  var lastKnown = 0
  var ticking = false

  window.addEventListener('scroll', function(e) {
    lastKnown = window.scrollY
    if(!ticking) {
      window.requestAnimationFrame(function() {
        findSection(elems)
        ticking = false
      })
    }
    ticking = true
  })
}


// Handle a click event on an anchor link
function handleClick(elems, idx) {
  return function(ev) {
    ev.preventDefault()
    autoScrolling = true
    setTimeout(function(ts) { autoScrolling = false }, 1000)
    activateElem(elems, idx)
    elems[idx].section.scrollIntoView({ behavior: 'smooth',  })
  }
}

// Activate an element as the current section
function activateElem(elems, idx) {
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
function findSection(elems) {
  if(autoScrolling) return
  var scrollPos = window.scrollY

  // Find the farthest-down element whose y coord is lte to scrollPos
  var found = null
  for(var i = 0, passed = false; i < elems.length && !passed; ++i) {
    if(elems[i].top <= scrollPos) found = i
    else passed = true
  }

  var elem = elems[found]
  if(elem && elem.id !== currentHash) activateElem(elems, found)
}
