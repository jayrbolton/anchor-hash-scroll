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

