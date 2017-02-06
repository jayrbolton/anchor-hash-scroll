// Only initialize once ever
if(!window._anchorScrollHashInitialized) {
  initialize()
  window._anchorScrollHashInitialized = true
}


// Main initialization function to add scroll functionality
function initialize() {
  // Find all anchor links that have a hash href
  var sel = 'a[href^="#"]'
  var anchors = document.querySelectorAll(sel)
  var elems = []
  window._currentHash = null
  for(var i = 0 ; i < anchors.length ; ++i) {
    var anchor = anchors[i]
    var id = anchor.getAttribute('href')
    var section = document.querySelector('[id="' + id.replace('#', '') + '"]')
    if(section) {
      var offset = Number(section.getAttribute('data-offset') || 0)
      elems.push({id: id, anchor: anchor, section: section, top: section.offsetTop})
      anchor.addEventListener('click', handleClick(section, id, offset))
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
function handleClick(section, id, offset) {
  return function(ev) {
    ev.preventDefault()
    section.scrollIntoView({ behavior: 'smooth',  })
  }
}

// Find the current section within view based on scrollY
function findSection(elems) {
  var scrollPos = window.scrollY

  // Deactivate all anchors and sections
  for(var i = 0 ; i < elems.length; ++i) {
    elems[i].anchor.removeAttribute('data-active')
    elems[i].section.removeAttribute('data-active')
  }

  // Find the farthest-down element whose y coord is lte to scrollPos
  for(var i = 0, found = null, passed = false; i < elems.length && !passed; ++i) {
    if(elems[i].top <= scrollPos) found = elems[i]
    else passed = true
  }

  // Set the active id, anchor, section
  if(found && found.id !== window._currentHash) {
    window._currentHash = found.id
    history.pushState(null, '', found.id)
    found.anchor.setAttribute('data-active', true)
    found.section.setAttribute('data-active', true)
  }
}
