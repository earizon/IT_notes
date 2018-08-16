var zoomDivDOM
function doCloseZoom() {
  zoomDivDOM.innerHTML = ''; 
  zoomDivDOM.style.display="none";
}
var zoomDivFW = true; // FW Full Width
var zoomDivFH = true; // FW Full Height 
var zoomDivTop = true; 
var zoomDivLft = true; 

var zoom=0.05
var idxXXXsmallRule=-1;
var idxXXsmallRule =-1;
var idxXsmallRule  =-1;


var longPress = {
   longpress : false,
   presstimer : null,

   click : function(e) {
       if (longPress.presstimer !== null) {
           clearTimeout(longPress.presstimer);
           longPress.presstimer = null;
       }
   
       this.classList.remove("longpress");
   
       if (longPress.longpress) {
           return false;
       }
   },
   start : function(e) {
       var self = this
   
       if (e.type === "click" && e.button !== 0) {
           return;
       }
   
       longPress.longpress = false;
   
       this.classList.add("longpress");
   
       if (longPress.presstimer === null) {
           longPress.presstimer = setTimeout(function() {
               doOpenZoom.call(self, longPress.element);
               longPress.longpress = true;
           }, 1000);
       }
   
       return false;
   },
   cancel : function(e) {
       if (longPress.presstimer !== null) {
           clearTimeout(longPress.presstimer);
           longPress.presstimer = null;
       }
   
       this.classList.remove("longpress");
   },
   enableDblClick : function (node) { 
       node.addEventListener('dblclick',doOpenZoom, false)
   },
   enableLongTouch : function (node) { 
       node.addEventListener("mousedown", longPress.start);
       node.addEventListener("touchstart", longPress.start);
       node.addEventListener("click", longPress.click);
       node.addEventListener("mouseout", longPress.cancel);
       node.addEventListener("touchend", longPress.cancel);
       node.addEventListener("touchleave", longPress.cancel);
       node.addEventListener("touchcancel", longPress.cancel);
   }
}

function onZoomOut(){
  zoom=zoom - 0.05
  document.styleSheets[0]['cssRules'][idxXXXsmallRule].style['font-size']=zoom+'rem';
}
function onZoomIn(){
  zoom=zoom + 0.05
  document.styleSheets[0]['cssRules'][idxXXXsmallRule].style['font-size']=zoom+'rem';
}
function doOpenZoom(e)      { 
  zoomDivDOM.innerHTML = 
     "<span style='font-size:1.0rem; color:blue;' onClick='doCloseZoom()'>(click here or press 'Esc' to close)<br/></span>" 
   + this.outerHTML; 
  zoomDivDOM.style.display="block";
  window.zoomDivDOM.scrollTop = 0;
  e.stopPropagation();
  return false;
}

function onPageLoaded() {
  zoomDivDOM = document.getElementById('zoomDiv')
  document.addEventListener('keyup',function(e) { if (e.code !== "Escape") return; doCloseZoom(); })
  // Change default a.target to blank. Ussually this is bad practice 
  // but this is the exception to the rule
  var nodeList = document.querySelectorAll('a')
  for (idx in nodeList) { 
      if (!nodeList[idx].href) { continue; }
      if (nodeList[idx].href && !nodeList[idx].href.startsWith("http")) continue;
      nodeList[idx].target='_blank'; 
  }
  nodeList = document.querySelectorAll('td')
  for (idx in nodeList) { 
     if (!!! nodeList[idx].addEventListener) continue;
     longPress.enableDblClick(nodeList[idx]);
     longPress.enableLongTouch(nodeList[idx]);
  }
  nodeList = document.querySelectorAll('*[zoom]')
  for (idx in nodeList) { 
     if (!!! nodeList[idx].addEventListener) continue;
     longPress.enableDblClick(nodeList[idx]);
     // Touch screen do not have enough resolution to click on
     //  internal td elements
  }

  for (idx=0; idx<document.styleSheets[0]['cssRules'].length; idx++){
      if( document.styleSheets[0]['cssRules'][idx].selectorText == "[xxxsmall]") {
          idxXXXsmallRule=idx;
      }
      if( document.styleSheets[0]['cssRules'][idx].selectorText == "[xxsmall]") {
          idxXXsmallRule=idx;
      }
      if( document.styleSheets[0]['cssRules'][idx].selectorText == "[xsmall]"  ) {
          idxXsmallRule=idx;
      }
  }

  // Append search:
  var searchDiv = document.createElement('spam');
      searchDiv.innerHTML = 
     '<form action="" method="" id="search" name="search">'
   + '  <input name="query" id="query" type="text" size="30" maxlength="30">'
   + '  <input name="searchit" type="button" value="Regex Search" onClick="highlightSearch()">'
   + '  <input id="singleLineOnly" type="checkbox"><code xsmall>single-line</code>'
   + '  <input id="caseSensitive"  type="checkbox"><code xsmall>Case-match</code>'
   + '</form>'
   + '<b id="initialMessage" orange xsmall>Hint double-click/long-press on elements to zoom!!</b>';


  document.body.insertBefore(searchDiv,document.body.children[0]);
  // document.body.appendChild(searchDiv);
}

function highlightSearch() {
  var text = document.getElementById("query").value.replace(/ +/g,".*");

  var nodeList = document.querySelectorAll('td')
  if (/^\s*$/.test(text) /*empty string -> reset and return */) {
     for (idx in nodeList) {
       nodeList[idx].setAttribute("textFound", "false");
     }
     return;
  }
  var caseSensitive  = document.getElementById("singleLineOnly").checked;
  var singleLineOnly = document.getElementById("caseSensitive").checked;
  var regexFlags = "g";
  if (!caseSensitive) regexFlags += "i";
  if (!singleLineOnly) regexFlags += "m";
  var query = new RegExp("(" + text + ")", regexFlags);
  // var e = document.getElementById("query").innerHTML;
  for (idx in nodeList) { 
    var node = nodeList[idx];
    if (node.innerHTML == null) continue;
    var htmlContent = (singleLineOnly) 
         ? node.innerHTML 
         : node.innerHTML.replace(/\n/gm, '');
    node.setAttribute("textFound", htmlContent.match(query)?"true":"false");
  }
}
