var zoomDivDOM
function doCloseZoom() {
  zoomDivDOM.innerHTML = ''; 
  zoomDivDOM.style.display="none";
}
var zoomDivFW = true; // FW Full Width
var zoomDivFH = true; // FW Full Height 
var zoomDivTop = true; 
var zoomDivLft = true; 

var zoom=0.1
var idxXXXsmallRule=-1;
var idxXXsmallRule =-1;
var idxXsmallRule  =-1;
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
     "<span style='font-size:1.0rem; color:blue;'>('Esc' to close)<br/></span>" 
   + this.outerHTML; 
  zoomDivDOM.style.display="block";
  e.stopPropagation();
}

function removeToLeftMarginInPre() {
  // TODO:(0) Not working
  // nodeList = document.querySelectorAll('pre')
  // for (idx in nodeList) { 
  //   var node = nodeList[idx]
  //   var html = node.innerHTML
  //   var pattern = html.match(/^\s*[|]/)
  //   var regEx = new RegExp(pattern, "")
  //   console.log(html)
  //   node.innerHTML = html.replace(regEx,''))
  //    
  // }
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
     nodeList[idx].addEventListener('dblclick',doOpenZoom, false)
  }
  nodeList = document.querySelectorAll('*[zoom]')
  for (idx in nodeList) { 
     if (!!! nodeList[idx].addEventListener) continue;
     nodeList[idx].addEventListener('dblclick',doOpenZoom, false)
  }

  removeToLeftMarginInPre();

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
  // Simulate initial dblclick to show help
  var event = new MouseEvent('dblclick', { 'view': window, 'bubbles': true, 'cancelable': true });
  document.getElementById('initialMessage').dispatchEvent(event);
}

