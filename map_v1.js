import { preLoad , postLoad } from '/custom.js';

var spb = {
  zoomDivDOM : window,
  searchFormDOM : window,
  searchForm_labelsDOM : window,
  zoomStatus: 0, // 0 = inactive, 1 = zoomedContent, 2 = searchDialog
  idxZoomDivRule :-1,
  idxZoomRule:-1,
  idxXSmallRule:-1,
  idxXTitleRule:-1,
  zoomableFontSize:0.05,
  xsmallFontSize:0.7, // must match initial size xsmall/title in css
  zoomFontSize:1.00,
  zoomStepIn:0.20,
  zoomStepOut:0.10,
  visited:[],
  visited_idx:-1,
  replaceMap : { "wikipedia" : "https://en.wikipedia.org/wiki" },
  CallbackOnClose:false,
  labelANDMode : true,
  singleLineMode : false,
  matchCaseMode : false,
  regexQuery: "",
  labelMap : { /* label : dom_list*/ },
  labelAndOrText : { 
      true : "←<span brown>AND</span> mode must contains <span brown>all</span> selected topics",
      false: "←<span green>OR </span> mode must contains <span green>any</span> selected topics"
  },
  labelMapSelected : { /* label : isSelected true|false */ },
  onKeyUp: function(e) {
    if (e.key === "z") { onZoomOut(); return }
    if (e.key === "Z") { onZoomIn (); return }
    if (e.code === "Escape") {
      if (spb.zoomStatus === 0) {
        resetTextFoundAttr(true)
      } else {
           doCloseZoom()
      }
    }
    if (e.key === "PageDown") { goForward(); return }
    if (e.key === "PageUp"  ) { goBack   (); return }

    if (e.code === "Enter") { doCloseZoom() }
    if (e.code === "F1") doHelp(); 
  },
  searchAndMark : function(node, finalRegex) {
      var htmlContent = (spb.singleLineMode)
           ? node.innerHTML 
           : node.innerHTML.replace(/\n/gm, ' ')
      var searchFound = finalRegex.test(htmlContent)
      // reset after search:
      // REF: https://stackoverflow.com/questions/11477415/why-does-javascripts-regex-exec-not-always-return-the-same-value
      finalRegex.lastIndex = 0;
      node.setAttribute("textFound", searchFound?"true":"false")
      if (searchFound) {
          nodeListList =  (node.parentNode.parentNode.tagName != "BODY")
            ? [node.parentNode.parentNode.querySelectorAll(':not(div)[title]'),
               node.parentNode.querySelectorAll('[title]')]
            : [node.parentNode.querySelectorAll('[title]')]
          nodeListList.forEach( nodeList => {
               nodeList.forEach( labelEl => {
                 labelEl.removeAttribute("hidden")
               })
          })
          spb.visited.push(node)
          window.lastElementFound = node
      }
      return searchFound
  }
}

export function doCloseZoom() {
  spb.zoomStatus = 0 
  document.getElementById("buttonZoomIn" ).innerHTML="[dive]";
  document.getElementById("buttonZoomOut").innerHTML="[orbit]";
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
         spb.zoomStatus = 1
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
       spb.zoomStatus = 1
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

export function onZoomOut(){
  if (spb.zoomDivDOM.innerHTML != '') {
    spb.zoomFontSize = (spb.zoomFontSize > 0.05) ? spb.zoomFontSize - spb.zoomStepOut : 0.0006
    spb.cssRules[spb.idxZoomDivRule].style['font-size']=spb.zoomFontSize+'rem'
    return
  }
  if     (spb.zoomableFontSize > 0.05) {
     spb.zoomableFontSize = spb.zoomableFontSize - spb.zoomStepOut
  } else if (spb.  xsmallFontSize > 0.4 ){
     spb.zoomableFontSize = 0.0006 // Absolute cero causes rendering problems in Firefox.
                                   // REF: https://bugzilla.mozilla.org/show_bug.cgi?id=1606305
     spb.  xsmallFontSize = spb.  xsmallFontSize - spb.zoomStepOut
  } else {
     spb.zoomableFontSize = 0.0006
     spb.  xsmallFontSize = 0.4
  }
  spb.cssRules[spb.idxZoomRule  ].style['font-size']=spb.zoomableFontSize+'rem'
  spb.cssRules[spb.idxXSmallRule].style['font-size']=spb.  xsmallFontSize+'rem'
  spb.cssRules[spb.idxXTitleRule].style['font-size']=spb.  xsmallFontSize+'rem'
}
export function onZoomIn(){
  if (spb.zoomDivDOM.innerHTML != '') {
    spb.zoomFontSize = spb.zoomFontSize + spb.zoomStepIn
    spb.cssRules[spb.idxZoomDivRule].style['font-size']=spb.zoomFontSize+'rem'
    return;
  }
  if (spb.  xsmallFontSize < 1.2) {
    spb.  xsmallFontSize = spb.  xsmallFontSize + spb.zoomStepIn
  } else {
    spb.zoomableFontSize = spb.zoomableFontSize + spb.zoomStepIn
  }
  spb.cssRules[spb.idxZoomRule  ].style['font-size']=spb.zoomableFontSize+'rem'
  spb.cssRules[spb.idxXSmallRule].style['font-size']=spb.  xsmallFontSize+'rem'
  spb.cssRules[spb.idxXTitleRule].style['font-size']=spb.  xsmallFontSize+'rem'
}

export function goBack() {
    if(spb.visited_idx == 0) return
    spb.visited_idx--
    let e = spb.visited[spb.visited_idx]
    doOpenZoom.call(e, e, true, true, false);
    spb.zoomStatus = 1
}
export function goForward() {
    if(spb.visited_idx == spb.visited.length-1) return
    spb.visited_idx++
    let e = spb.visited[spb.visited_idx]
    doOpenZoom.call(e, e, true, true, false);
    spb.zoomStatus = 1
}


export function doOpenZoom(e, isHistoric, showTimeControl, CallbackOnClose, strCloseLabel) {
  spb.CallbackOnClose = CallbackOnClose
  if (!!!spb.CallbackOnClose /* This mean showing real content. */ ) {
    document.getElementById("buttonZoomIn" ).innerHTML="[zoom-in]";
    document.getElementById("buttonZoomOut").innerHTML="[zoom-out]";
  }
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
      /* list -> Set -> array leaves non-repeated/unique elements*/
    Array
      .from(
        new Set(e.attributes.labels.value.split(",")))
      .filter(e => !!e)
      .forEach(label_i => { sLabels += renderLabel(label_i) })
  }
  strCloseLabel = (!!strCloseLabel)?strCloseLabel:"✕ (close)"
  spb.zoomDivDOM.innerHTML = 
     "<div style='margin-bottom:0.5rem'>" 
   + " <div id='divCloseZoom' onClick='doCloseZoom()'>"+strCloseLabel+"</div>" 
   + " <span style='font-weight:bold' text-align='center'>"+document.title+"</span>"
   + ((showTimeControl) 
       ? "<div id='historyBackFor' style='display:inline; '>" + backControl + " "+ forwControl + "</div>" 
       : ""
     )
   + " <div id='divElementLabels'>"+sLabels+"</div>" 
   + "</div>" 

   + e.outerHTML; 
  spb.zoomDivDOM.style.display="block";
  spb.zoomDivDOM.scrollTop = 0;
  if (!!this.stopPropagation) { this.stopPropagation(); }
  return false;
}

export function updateRegexQuery() {
    spb.regexQuery = this.value
}



function onLabelClicked(e) {
    const dom = e.target;
    const label = dom.value;
    if (!dom.attributes) {
         dom.attributes = { selected : { value : "false" } }
    }
    if (dom.attributes.selected.value == "false") {
        dom.attributes.selected.value = "true"
        spb.labelMapSelected[label] = true
    } else {
        dom.attributes.selected.value = "false"
        delete spb.labelMapSelected[label]
    }
    if (isAnyLabelSelected()){
      document.getElementById("idLabelsFilter").setAttribute("active","true"); 
    } else {
      document.getElementById("idLabelsFilter").removeAttribute("active"); 
    }
}

function renderLabel(sLabel,selected) {
  sLabel = sLabel.toLowerCase()
  let cssAtribute    = (sLabel.startsWith("todo")) ? "red"  : ""
  return "<input "+cssAtribute+" class='labelButton' selected="+(!!spb.labelMapSelected[sLabel])+
         " type='button' value='"+sLabel+"' /><span labelcount>"+spb.labelMap[sLabel].length+"</span>" ;
}


function switchANDORSearch() {
  spb.labelANDMode=!spb.labelANDMode
  document.getElementById("idLabelSearchAndMode").innerHTML= spb.labelAndOrText[spb.labelANDMode]
}
function switchSingleLineMode() { spb.singleLineMode=document.getElementById("singleLineOnly").checked; }
function switchCaseMode()       { spb.matchCaseMode=document.getElementById("caseSensitive").checked; }

function getDomListForLabel(label) {
    if (!!!spb.labelMap[label]) return [];
    else return spb.labelMap[label];
}

function labelMapSelectedToCSV() {
  return Object.keys(spb.labelMapSelected).sort().join(",")
}
function createLabelIndex() {
  var labeled_dom_l = document.querySelectorAll('*[labels]');
  for (let idx1 in labeled_dom_l) {
    var node = labeled_dom_l[idx1]
    if (!node.getAttribute    ) continue
    let csvAttributes = node.getAttribute("labels")
    if (!csvAttributes || !csvAttributes.trim()) continue;
    var labelCount = 0
    csvAttributes.split(",").forEach( label => {
        if (!!! label) return
        label = label.toLowerCase()
        let list = getDomListForLabel(label)
            list.push(node)
        spb.labelMap[label] = list
        labelCount++
    })
    if (labelCount>0) {
      var countEl = document.createElement('div');
          countEl.setAttribute("tagCount", "")
          countEl.innerHTML = labelCount
      node.insertBefore(countEl,node.children[0])
    }
  }
  // console.dir(spb.labelMap)
}

function spbQuickPrint() {
  if (window.confirm('Use browser [print...] for print-previsualization.-')) {
      window.print()
  }
}

function addSearchForm() { // @mb
  const div = document.createElement('div');
        div.setAttribute("id", "searchForm")
  document.body.insertBefore(div,document.body.children[0])
  let html = ''
    + '  <input id="inputQuery" type="text" placeholder="(regex)search" maxlength="30" />'
    + '  <input id="singleLineOnly" type="checkbox" onClick="switchSingleLineMode()" > '
    + '  <code style="font-size:0.7em;">single-line</code>'
    + '  <input id="caseSensitive"  type="checkbox" onClick="switchCaseMode()"><code style="font-size:0.7em;">Case-match </code>'
    + '  <br/><hr/>'
    if (Object.keys(spb.labelMap).length > 0) {
        html += 
         '<b>Filter by topic</b>:<br/>\n '
      +  '<input type="checkbox" '+(spb.labelANDMode?"checked":"")+' onClick="switchANDORSearch()"><span id="idLabelSearchAndMode" mono>'+spb.labelAndOrText[spb.labelANDMode]+'</span>'
      +  '<br/>\n'
      +  '<div id="searchFormLabels">\n'
      +  '</div><br/>\n'
    } else {
      html += "(No topics found).<br/>\n"
    }
    html += '<br/>'
    + '<div id="doSearchButton">Search⏵</div>'
    div.innerHTML = html;

    const domInputQuery = document.getElementById("inputQuery")
    domInputQuery.addEventListener("change",  updateRegexQuery )
    const doSearchButton = document.getElementById("doSearchButton")
    doSearchButton.addEventListener('click',  doHideSearchFormAndSearch )

    domInputQuery.focus()

    spb.searchFormDOM = div;
    spb.searchForm_labelsDOM = document.getElementById("searchFormLabels")

}


function showSearchForm() {
  spb.searchFormDOM.style.display="block";
  document.getElementById("inputQuery").value = spb.regexQuery
  document.getElementById("singleLineOnly").checked = spb.singleLineMode
  document.getElementById("caseSensitive" ).checked = spb.matchCaseMode

  var htmlLabels = ''
  Object.keys(spb.labelMap).sort()
     .forEach(label_i => {
      htmlLabels += renderLabel(label_i)
  })
  spb.searchForm_labelsDOM.innerHTML = htmlLabels;
  document.querySelectorAll('.labelButton').forEach(
    domElement => {
      domElement.addEventListener('click', onLabelClicked) // @ma
    }
  )
}
function hideSearchForm() {
  spb.searchFormDOM.style.display="none";
}
function doHideSearchFormAndSearch() {
    hideSearchForm();
    highlightSearch();
}

function onPageLoaded() {
  try {   preLoad(); } catch(err) {console.dir(err)}
  spb.cssRules = document.styleSheets[0]['cssRules'][0].cssRules;
  var zoomDiv = document.createElement('div');
      zoomDiv.setAttribute("id", "zoomDiv")
  document.body.insertBefore(zoomDiv,document.body.children[0])
  var zoomSearch = document.createElement('div');
      zoomDiv.setAttribute("id", "")
  document.body.insertBefore(zoomDiv,document.body.children[0])
  var searchDiv = document.createElement('div');
      searchDiv.setAttribute("id", "upper_bar")
      searchDiv.innerHTML = ''
   + '<img id="idLabelsFilter" class="noprint" src="/labelIcon.svg"  '
   +   ' onerror="src = \'https://singlepagebookproject.github.io/SPB/labelIcon.svg\';" />'
   + '&nbsp;<span blue class="noprint" id="unhide" hidden style="cursor:ns-resize" onClick="resetTextFoundAttr(true)">[unhide]</span>'
   + '&nbsp;<a href="../help.html" class="noprint" style="cursor:help" target="_blank">[HelpMan]</a>'
   + '&nbsp;<span onClick="spbQuickPrint()" blue id="printButton">[Print]</span>'
   + '<span id="buttonZoomIn" onclick="onZoomIn ()" blue>[dive]</span>'
   + '&nbsp;<span id="buttonZoomOut" onclick="onZoomOut()" blue>[orbit]&nbsp;&nbsp;</span>'
   + '<br/>'
  document.body.insertBefore(searchDiv,document.body.children[0])
  document.getElementById("idLabelsFilter").addEventListener("click",  function() {  showSearchForm() })

  spb.zoomDivDOM = document.getElementById('zoomDiv')

  document.addEventListener('keyup'  , spb.onKeyUp)

  // Change default a.target to blank. Ussually this is bad practice 
  // but this is the exception to the rule
  var nodeList = document.querySelectorAll('a')
  var thisDoc=document.location.origin+document.location.pathname;
  for (let idx in nodeList) { 
      var nodeHref = nodeList[idx].href;
      if (!nodeHref) { continue; }
      if (! (nodeHref.startsWith("http")) ) continue;
      if ( nodeHref.startsWith(thisDoc)) continue;
      nodeList[idx].target='_blank'; 
  }

  nodeList = document.querySelectorAll('*[zoom]')
  for (let idx in nodeList) { 
     if (!!! nodeList[idx].addEventListener) continue;
     longPress.enableDblClick (nodeList[idx]);
     longPress.enableLongTouch(nodeList[idx]);
  }

  // create re-usable regex outside loop.
  Object.keys(spb.replaceMap).forEach( key => 
     spb.replaceMap[key] = [new RegExp("[$][{]"+key+"[}]",'g'), spb.replaceMap[key]]
  )

  nodeList = document.querySelectorAll('*[zoom]')
  for (let idx in nodeList) { 
      if (!!! nodeList[idx].innerHTML) { continue }

      Object.keys(spb.replaceMap).forEach( key => 
        nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(spb.replaceMap[key][0],spb.replaceMap[key][1])
      )
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
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/[$]º([^º\n]*)º/g, "  <span console>$1</span> ")   
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

  for (let idx=0; idx<spb.cssRules.length; idx++){
      if( spb.cssRules[idx].selectorText == "#zoomDiv") {
          spb.idxZoomDivRule=idx
      }
      if( spb.cssRules[idx].selectorText == "[zoom]") {
          spb.idxZoomRule=idx
      }
      if( spb.cssRules[idx].selectorText == "[xsmall]") {
          spb.idxXSmallRule=idx
      }
      if( spb.cssRules[idx].selectorText == "[title]") {
          spb.idxXTitleRule=idx
      }
  }

  createLabelIndex()

  let csvLabels = getParameterByName("topics") || ""
      csvLabels = csvLabels.toLowerCase()
  let label_l = (!!csvLabels) ? csvLabels.split(",") : []
  label_l.forEach(label => {
      onLabelClicked({value : label});
  })
  let query = getParameterByName("query")
  if (!!query) { spb.regexQuery = query; }
  if (!!query || !!label_l) {
    highlightSearch()
  }
  let doShowSearchMenu = getParameterByName("showSearchMenu") 
  if (!!doShowSearchMenu || doShowSearchMenu == "") {
    showSearchForm();
  }

  addSearchForm()

  try {  
      postLoad();
  } catch(err) {console.dir(err)}
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

function resetTextFoundAttr(bKeepHighlightedSearch) {
  /*
   * bKeepHighlightedSearch = true: => Do not reset textFound== true attribute
   *                                  (keep highlighted content in the context of the full page)
   *                                  Just remove textFound=false to 'unhide' non-matching zoomable content
   *                                  (textFound==false is assigned to display none in css)
   * bKeepHighlightedSearch = false => Reset all (remove any textFound attribute)
   */
  [document.querySelectorAll('body>div>[title]'),
   document.querySelectorAll('body>div>div[title]')].forEach(nodeList => {
      nodeList.forEach(node => {
          node.removeAttribute("hidden")
      })
   })
  var removeNodeList = document.querySelectorAll('*[textFound]');
  if (removeNodeList.length == 0) return; // Nothing to do.
  for (let idx in removeNodeList) {
      if (!removeNodeList[idx].setAttribute) continue; // <- Umm: works fine at page-load, fails in following searchs
      if (bKeepHighlightedSearch && removeNodeList[idx].getAttribute("textFound") == "true") continue;
      removeNodeList[idx].removeAttribute("textFound"); 
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
  let unhideButton = document.getElementById("unhide");
      unhideButton.setAttribute("hidden","");

  if (typeof query != "string") query = "";
  if (!!query) { spb.regexQuery = query; }
  let finalQueryRegex = spb.regexQuery.replace(/ +/g,".*");
  resetTextFoundAttr(false);
  let isEmptyQuery = /^\s*$/.test(finalQueryRegex)

  if ((!isAnyLabelSelected()) && isEmptyQuery) { return false; /* Nothing to do */ }

  [document.querySelectorAll('body>div>[title]'),
   document.querySelectorAll('body>div>div>[title]')].forEach(nodeList => {
      nodeList.forEach(node => {
          node.setAttribute("hidden", "true")
      })
   })
  // If some label has been selected then choose only those with matching labels
  document.querySelectorAll('*[zoom]').forEach(node => { 
      node.setAttribute("textFound", "false")
  })
  var innerZoom_l = []
  if (isAnyLabelSelected()) {
      let label_l=Object.keys(spb.labelMapSelected)
      innerZoom_l = getDomListForLabel(label_l[0]);
      for (let idx=0; idx<label_l.length; idx++) {
        innerZoom_l = spb.labelANDMode 
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
  var finalRegex = (isEmptyQuery) 
        ? new RegExp(".*")
        : new RegExp("[^=>;]?(" + finalQueryRegex + ")", regexFlags)

  var numberOfMatches = 0

  spb.visited=[]

  var foundElement = false
  for (let idx2 in innerZoom_l) {
    var node = innerZoom_l[idx2]
    if (false/* true => change node background in debug mode */) {
        node.setAttribute("textFound", "debug") 
    }
    if (node.innerHTML == null) continue
    if (!node.setAttribute    ) continue
    if (spb.searchAndMark(node,finalRegex)) { 
        numberOfMatches++ 
        foundElement = true
    }
  }
  if (numberOfMatches == 1) {
      doOpenZoom.call(lastElementFound, lastElementFound, false, true, false);
      spb.zoomStatus = 1
  }
  unhideButton.removeAttribute("hidden","");
  return false // avoid event propagation
}
