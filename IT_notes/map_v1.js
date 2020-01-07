var spb = {
  zoomDivDOM : window,
  idxZoomDivRule :-1,
  idxZoomRule:-1,
  idxXSmallRule:-1,
  idxXTitleRule:-1,
  zoomableFontSize:0.05,
  xsmallFontSize:0.7, // must match initial size xsmall/title in css
  zoomFontSize:1.00,
  visited:[],
  visited_idx:-1,
  CallbackOnClose:false,
  labelAndMode : true,
  singleLineMode : false,
  matchCaseMode : false,
  regexQuery: "",
  labelMap : { /* label : dom_list*/ },
  labelAndOr : { 
      true : "←<span brown>AND</span> mode must contains <span brown>all</span> selected topics",
      false: "←<span green>OR </span> mode must contains <span green>any</span> selected topics"
  },
  labelMapSelected : { /* label : isSelected true|false */ },
  onKeyUp: function(e) {
    if (e.code === "Escape") {
      if (spb.zoomDivDOM.innerHTML == '') {
        resetTextFoundAttr(true);
      } else {
           doCloseZoom();
      }
    }
    if (e.code === "F1") doHelp(); 
  },
  searchAndMark : function(node, query) {
      var htmlContent = (spb.singleLineMode) // TODO:(test)
           ? node.innerHTML 
           : node.innerHTML.replace(/\n/gm, '')
      var searchFound = query.test(htmlContent)
      node.setAttribute("textFound", searchFound?"true":"false")
      if (searchFound) {
          spb.visited.push(node)
          window.lastElementFound = node
      }
      return searchFound
  }


}
function doCloseZoom() {
  spb.zoomDivDOM.innerHTML = ''; 
  spb.zoomDivDOM.style.display="none";
  if (spb.CallbackOnClose) {
    spb.CallbackOnClose.call(window);
  }
}

var longPress = {
   longpress : false,
   presstimer : null,
   click : function(e) {
     if (longPress.presstimer !== null) {
       clearTimeout(longPress.presstimer)
       longPress.presstimer = null
     }
     if (longPress.longpress) { return false }
   },
   start : function(e) {
     var self = this
     if (e.type === "click" && e.button !== 0) { return }
     longPress.longpress = false
   
     if (longPress.presstimer === null) {
       longPress.presstimer = setTimeout(function() {
         doOpenZoom.call(self, self, false, true, false)
         longPress.longpress = true
       }, 1000)
     }
   
     return false;
   },
   cancel : function(e) {
     if (longPress.presstimer !== null) {
       clearTimeout(longPress.presstimer);
       longPress.presstimer = null;
     }
   },
   enableDblClick : function (node) {
     let self = node
     node.addEventListener('dblclick', function() { 
       doOpenZoom.call(self, self, false, true, false) 
       if (!!this.stopPropagation) { this.stopPropagation(); }
     } , true)
   },
   enableLongTouch : function (node) { 
     node.addEventListener("mousedown" , longPress.start);
     node.addEventListener("touchstart", longPress.start);
     node.addEventListener("click"     , longPress.click);
     node.addEventListener("mouseout"  , longPress.cancel);
     node.addEventListener("touchend"  , longPress.cancel);
     node.addEventListener("touchleave", longPress.cancel);
     node.addEventListener("touchcancel", longPress.cancel);
   }
}

function onZoomOut(){
  if (spb.zoomDivDOM.innerHTML != '') {
    spb.zoomFontSize = (spb.zoomFontSize > 0.05) ? spb.zoomFontSize - 0.05 : 0.0001
    document.styleSheets[0]['cssRules'][spb.idxZoomDivRule].style['font-size']=spb.zoomFontSize+'rem'
    return
  }
  if     (spb.zoomableFontSize > 0.05) {
     spb.zoomableFontSize = spb.zoomableFontSize - 0.05
  } else if (spb.  xsmallFontSize > 0.4 ){
     spb.zoomableFontSize = 0.0001 // Absolute cero causes rendering problems in Firefox.
                                   // REF: https://bugzilla.mozilla.org/show_bug.cgi?id=1606305
     spb.  xsmallFontSize = spb.  xsmallFontSize - 0.05
  } else {
     spb.zoomableFontSize = 0.0001
     spb.  xsmallFontSize = 0.4
  }
  document.styleSheets[0]['cssRules'][spb.idxZoomRule  ].style['font-size']=spb.zoomableFontSize+'rem'
  document.styleSheets[0]['cssRules'][spb.idxXSmallRule].style['font-size']=spb.  xsmallFontSize+'rem'
  document.styleSheets[0]['cssRules'][spb.idxXTitleRule].style['font-size']=spb.  xsmallFontSize+'rem'
}
function onZoomIn(){
  if (spb.zoomDivDOM.innerHTML != '') {
    spb.zoomFontSize = spb.zoomFontSize + 0.05
    document.styleSheets[0]['cssRules'][spb.idxZoomDivRule].style['font-size']=spb.zoomFontSize+'rem'
    return;
  }
  if (spb.  xsmallFontSize < 1.2) {
    spb.  xsmallFontSize = spb.  xsmallFontSize + 0.05
  } else {
    spb.zoomableFontSize = spb.zoomableFontSize + 0.05
  }
  document.styleSheets[0]['cssRules'][spb.idxZoomRule  ].style['font-size']=spb.zoomableFontSize+'rem'
  document.styleSheets[0]['cssRules'][spb.idxXSmallRule].style['font-size']=spb.  xsmallFontSize+'rem'
  document.styleSheets[0]['cssRules'][spb.idxXTitleRule].style['font-size']=spb.  xsmallFontSize+'rem'
}

function goBack() {
    if(spb.visited_idx == 0) return
    spb.visited_idx--
    let e = spb.visited[spb.visited_idx]
    doOpenZoom.call(e, e, true, true, false);
}
function goForward() {
    if(spb.visited_idx == spb.visited.length-1) return
    spb.visited_idx++
    let e = spb.visited[spb.visited_idx]
    doOpenZoom.call(e, e, true, true, false);
}


function doOpenZoom(e, isHistoric, showTimeControl, CallbackOnClose, strCloseLabel) {
  spb.CallbackOnClose = CallbackOnClose;
  showTimeControl = !!showTimeControl
  if(spb.visited[spb.visited.length-1] == e) { 
      isHistoric = true 
  }
  if(spb.visited.indexOf(e)>=0) { 
      isHistoric = true
      spb.visited_idx = spb.visited.indexOf(e)
  }
  if (!!!isHistoric) { // Apend new visits only
    spb.visited.push(e)
    spb.visited_idx =spb.visited.length-1
  }
  let nbackNumber =  spb.visited_idx                       
  let nforwNumber = (spb.visited.length-1)-spb.visited_idx
  let backNumber = ((nbackNumber>0) ? ("xxx"+nbackNumber).slice(-3)+"←" : "xxxx").replace(/x/g,"&nbsp;")
  let forwNumber = ((nforwNumber>0) ? "→"+("xxx"+nforwNumber).slice(-3) : "xxxx").replace(/x/g,"&nbsp;")
  let backControl = "<span onClick='goBack   ()' style='font-family:monospace; color:blue; font-size:2.0rem'>"+backNumber+"</span>"
  let forwControl = "<span onClick='goForward()' style='font-family:monospace; color:blue; font-size:2.0rem'>"+forwNumber+"</span>"
  let sLabels="";
  if (e.attributes && e.attributes.labels) {
    e.attributes.labels.value.split(",").forEach(label_i => {
        sLabels += renderLabel(label_i)
    })
  }
  strCloseLabel = (!!strCloseLabel)?strCloseLabel:"✕ (close)"
  spb.zoomDivDOM.innerHTML = 
     "<div style='margin-bottom:0.5rem'>" 
   + " <div id='divCloseZoom' onClick='doCloseZoom()'>"+strCloseLabel+"</div>" 
   + ((showTimeControl) 
       ? "<div id='historyBackFor' style='display:inline; '>" + backControl + " "+ forwControl + "</div>" 
       : ""
     )
   + " <div id='divElementLabels'>"+sLabels+"</div>" 
   + "</div>" 

   + e.outerHTML; 
  spb.zoomDivDOM.style.display="block";
  window.spb.zoomDivDOM.scrollTop = 0;
  if (!!this.stopPropagation) { this.stopPropagation(); }
  return false;
}

function updateRegexQuery() {
    spb.regexQuery = this.value
}

function doExtraOptions() {
    ctx = {
        outerHTML : getSearchOptions()
    }
    doOpenZoom.call(ctx, ctx, true, false, highlightSearch, "Search/Filter Now!")
    document.getElementById("inputQuery"   ).addEventListener("change",  updateRegexQuery )
}
function onLabelClicked(e) {
    let label = e.value;
    if (!e.attributes) {
         e.attributes = { selected : { value : "false" } }
    }
    if (e.attributes.selected.value == "false") {
        e.attributes.selected.value = "true"
        spb.labelMapSelected[label] = true
    } else {
        e.attributes.selected.value = "false"
        delete spb.labelMapSelected[label]
    }
    if (isAnyLabelSelected()){
      document.getElementById("idLabelsFilter").setAttribute("active","true"); 
    } else {
      document.getElementById("idLabelsFilter").removeAttribute("active"); 
    }
}

function renderLabel(sLabel,selected) {
  return "<input class='labelButton' selected="+(!!spb.labelMapSelected[sLabel])+
         " type='button' onClick='onLabelClicked(this)' value='"+sLabel+"' />" ;
}


function switchANDORSearch() {
  spb.labelAndMode=!spb.labelAndMode
  document.getElementById("idLabelSearchAndMode").innerHTML= spb.labelAndOr[spb.labelAndMode]
}
function switchSingleLineMode() { spb.singleLineMode=document.getElementById("singleLineOnly").checked; }
function switchCaseMode()       { spb.matchCaseMode=document.getElementById("caseSensitive").checked; }

function getSearchOptions() {
    if (Object.keys(spb.labelMap).length == 0) {
        return "No labels found"
    }
    var result = "";
    result += ""
      + '  <input id="inputQuery" type="text" size="20" placeholder="(regex) text search" maxlength="30" value="'+spb.regexQuery+'" />'
      + "  <input id='singleLineOnly' type='checkbox' onClick='switchSingleLineMode()' "+(spb.singleLineMode ? "checked" :"")+" ><code>single-line</code>"
      + "  <input id='caseSensitive'  type='checkbox' onClick='switchCaseMode      ()' "+(spb. matchCaseMode ? "checked" :"")+" ><code>Case-match </code>"
      + "<hr/>\n"
      + "Filter (Restrict search to selected topics):<br/>\n"
      + "<input type='checkbox' "+(spb.labelAndMode?"checked":"")+" onClick='switchANDORSearch()'><span id='idLabelSearchAndMode' mono>"+spb.labelAndOr.true+"</span>"
      + "<br/>\n"
      + "<div>\n"
    Object.keys(spb.labelMap).sort().forEach(label_i => {
        result += renderLabel(label_i)
    })
      + "</div>\n)"
    return result;
}

function getDomListForLabel(label) {
    if (!!!spb.labelMap[label]) return [];
    else return spb.labelMap[label];
}

function labelMapSelectedToCSV() {
  return Object.keys(spb.labelMapSelected).sort().join(",")
}
function createLabelIndex() {
  var labeled_dom_l = document.querySelectorAll('*[labels]');
  for (idx1 in labeled_dom_l) {
    var node = labeled_dom_l[idx1]
    if (!node.getAttribute    ) continue
    let csvAttributes = node.getAttribute("labels")
    if (!csvAttributes || !csvAttributes.trim()) continue;
    csvAttributes.split(",").forEach( label => {
        label = label.toLowerCase()
        let list = getDomListForLabel(label)
            list.push(node)
        spb.labelMap[label] = list
    })
  }
  // console.dir(spb.labelMap)
}

function onPageLoaded() {
  var searchDiv = document.createElement('spam');
      searchDiv.innerHTML = 
     '<form action="#" method="" id="search" name="search">'
   + '<img id="idLabelsFilter" src="/IT_notes/labelIcon.svg" />'
   + '  &nbsp;<a href="../help.html" target="_blank">[HELP]</a>'
   + '  &nbsp;<div style="display:inline; color:blue" onClick="spb.onKeyUp({ code: \'Escape\'})">[show all]</div>'
   + '</form>'
   + '<div id="zoomDiv"></div>'
   + '<div style="position:fixed; right:0.3%; top:0;">'
   + '<b style="font-size:1.5rem" orange><a onclick="onZoomOut()">[-A]</a></b>'
   + '<b style="font-size:1.5rem"       >                                 </b>'
   + '<b style="font-size:2.0rem" orange><a onclick="onZoomIn ()">[A+]</a></b>'
   + '</div>'
   + '<br/>'
  document.body.insertBefore(searchDiv,document.body.children[0])
  document.getElementById("idLabelsFilter").addEventListener("click",  function() {  doExtraOptions() })
  document.getElementById("search"     ).addEventListener("submit",  function(e) {e.preventDefault(); return false })
  

  spb.zoomDivDOM = document.getElementById('zoomDiv')

  document.addEventListener('keyup', spb.onKeyUp)

  // Change default a.target to blank. Ussually this is bad practice 
  // but this is the exception to the rule
  var nodeList = document.querySelectorAll('a')
  var thisDoc=document.location.origin+document.location.pathname;
  for (idx in nodeList) { 
      var nodeHref = nodeList[idx].href;
      if (!nodeHref) { continue; }
      if (! (nodeHref.startsWith("http")) ) continue;
      if ( nodeHref.startsWith(thisDoc)) continue;
      nodeList[idx].target='_blank'; 
  }

  nodeList = document.querySelectorAll('*[zoom]')
  for (idx in nodeList) { 
     if (!!! nodeList[idx].addEventListener) continue;
     longPress.enableDblClick (nodeList[idx]);
     longPress.enableLongTouch(nodeList[idx]);
  }
  nodeList = document.querySelectorAll('*[zoom]')
  for (idx in nodeList) { 
      if (!!! nodeList[idx].innerHTML) continue;
   // COMMENTED: Needs more testings 
   // nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/(http.?:\/\/[^\b]*)\b/,"<a target='_blank' href='$1'>$1</a>")
      // Open new window with pre-recoded search:[[Troubleshooting+restorecon?]]
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(
          /\[\[([^\?]*)\?\]\]/g,
          "<a href='#' onClick='highlightSearch(\"$1\")'>$1</a>"
        + "<a target='_blank' href='"+window.location.href.split('?')[0]+"?query=$1&labels="+labelMapSelectedToCSV()+"'>( ⏏ )</a>"
//        "<a href='"+window.location.href.split('?')[0]+"?query=$1'>$1</a>"
      )
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/@\[(http[^\]]*)\]/g,"<a target='_new' href='$1'> [$1]</a>")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/@\[([^\]]*)\]/g,    "<a               href='$1'> [$1]</a>")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/Gº([^º\n]*)º/g, "<b green >  $1 </b>")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/Rº([^º\n]*)º/g, "<b red   >  $1 </b>")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/Bº([^º\n]*)º/g, "<b blue  >  $1 </b>")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/Oº([^º\n]*)º/g, "<b orange>  $1 </b>")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/Qº([^º\n]*)º/g, "<b brown >  $1 </b>")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/Yº([^º\n]*)º/g, "<b yellow>  $1 </b>")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace( /º([^º\n]*)º/g, "<b        > $1 </b>")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace( /[˂]/g, "&lt;")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace( /[˃]/g, "&gt;")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace( /[⅋]/g, "&amp;")   
      // Some utf-8 hand icons do not work properly while editing in vim/terminal
      // but looks much better in the final HTML. Replace icons:
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/☜/g, "👈")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/☝/g, "👆")
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/☞/g, "👉")
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/☟/g, "👇")
//    if (typeof window.orientation !== 'undefined') {
//        // There ar some glitches with font support in mobiles :(
//        nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/│/g, "|")
//        nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/─/g, "-")
//        nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/┌/g, "/")
//        nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/┐/g, "\\")
//        nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/└/g, "\\")
//        nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/┘/g, "/")
//    }
  }


  for (idx=0; idx<document.styleSheets[0]['cssRules'].length; idx++){
      if( document.styleSheets[0]['cssRules'][idx].selectorText == "#zoomDiv") {
          spb.idxZoomDivRule=idx
      }
      if( document.styleSheets[0]['cssRules'][idx].selectorText == "[zoom]") {
          spb.idxZoomRule=idx
      }
      if( document.styleSheets[0]['cssRules'][idx].selectorText == "[xsmall]") {
          spb.idxXSmallRule=idx
      }
      if( document.styleSheets[0]['cssRules'][idx].selectorText == "[title]") {
          spb.idxXTitleRule=idx
      }
  }

  createLabelIndex()

  let csvLabels = getParameterByName("labels")
  label_l = (!!csvLabels) ? csvLabels.split(",") : []
  label_l.forEach(label => {
      onLabelClicked({value : label});
  })
  let query = getParameterByName("query")
  if (!!query) { spb.regexQuery = query; }
  if (!!query || !!label_l) {
    highlightSearch()
  }

}

window.onload = onPageLoaded 

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var searchFound = false;

function resetTextFoundAttr(bOnlyFalse) {
  bOnlyFalse = !!bOnlyFalse // bOnf
  /* if bOnlyFalse == true => remove textFound attribute only when it's false.
   * This will still keep  highlighted content in the context of the full page
   */

  var removeNodeList = document.querySelectorAll('*[textFound]');
  if (removeNodeList.length > 0) {
      for (idx in removeNodeList) {
        if (!removeNodeList[idx].setAttribute) continue; // < TODO: Check why it works fine when loading, but fails when doing a second search
        if (bOnlyFalse && removeNodeList[idx].getAttribute("textFound") == "true") continue;
        removeNodeList[idx].removeAttribute("textFound"); 
    }
  }
}

function isAnyLabelSelected() {
  return Object.keys(spb.labelMapSelected).length > 0
}

Array.prototype.union = function(a) 
{
  var r = this.slice(0);
  a.forEach(function(i) { if (r.indexOf(i) < 0) r.push(i); });
  return r;
};
Array.prototype.intersection = function(a) 
{
  var r = [];
  var ref = this.slice(0);
  a.forEach(function(i) { if (ref.indexOf(i) >= 0) r.push(i); });
  return r;
};



function highlightSearch(query) {
  if (typeof query != "string") query = "";
  if (!!query) { spb.regexQuery = query; }
  var text = spb.regexQuery.replace(/ +/g,".*");
  resetTextFoundAttr();
  let isEmptyQuery = /^\s*$/.test(text)

  if ((!isAnyLabelSelected()) && isEmptyQuery) {
      resetTextFoundAttr();
      return false; // Nothing to do
  }

  // If some label has been selected then choose only those with matching labels
  document.querySelectorAll('*[zoom]').forEach(node => { 
      node.setAttribute("textFound", "false")
  })
  if (isAnyLabelSelected()) {
      var innerZoom_l = []
      let label_l=Object.keys(spb.labelMapSelected)
      innerZoom_l = getDomListForLabel(label_l[0]);
      for (idx=0; idx<label_l.length; idx++) {
        innerZoom_l = spb.labelAndMode 
              ? innerZoom_l.intersection( getDomListForLabel(label_l[idx]) )
              : innerZoom_l.union       ( getDomListForLabel(label_l[idx]) )
      }
  } else {
      // By default search inside all zoomable elements
      var innerZoom_l = document.querySelectorAll('*[zoom]')
  }
  var regexFlags = "g";
  if (!spb.matchCaseMode) regexFlags += "i";
  if (!spb.singleLineMode) regexFlags += "m";
  var query = (isEmptyQuery) 
        ? new RegExp(".*")
        : new RegExp("[^=>;]?(" + text + ")", regexFlags)

  var numberOfMatches = 0

  spb.visited=[]

  var foundElement = false
  for (idx2 in innerZoom_l) {
    var node = innerZoom_l[idx2]
    if (node.innerHTML == null) continue
    if (!node.setAttribute    ) continue
    if (spb.searchAndMark(node,query)) { 
        numberOfMatches++ 
        foundElement = true
    }
  }
  if (numberOfMatches == 1) {
      doOpenZoom.call(lastElementFound, lastElementFound, false, true, false);
  }
  return false // avoid event propagation
}
