import { preLoad , postLoad } from '/custom.js';

const labelMap = { /* label : dom_list*/ }

const SF = {  /* search Form */
  searchFormDOM : window,
  searchForm_labelsDOM : window,
  regexQuery: "",
  singleLineMode : false,
  matchCaseMode : false,
  labelANDMode : true,
  labelAndOrText : { 
      true : "←<span brown>AND</span> mode must contains <span brown>all</span> selected topics",
      false: "←<span green>OR </span> mode must contains <span green>any</span> selected topics"
  },

  renderSearchForm : function() {
    const div = document.createElement('div');
          div.setAttribute("id", "searchForm")
    document.body.insertBefore(div,document.body.children[0])
    let html = ''
      + '  <input id="inputQuery" type="text" placeholder="(regex)search" maxlength="30" />'
      + '  <input id="singleLineOnly" type="checkbox" onClick="switchSingleLineMode()" > '
      + '  <code style="font-size:0.7em;">single-line</code>'
      + '  <input id="caseSensitive"  type="checkbox" onClick="switchCaseMode()"><code style="font-size:0.7em;">Case-match </code>'
      + '  <br/><hr/>'
      if (Object.keys(labelMap).length > 0) {
          html += 
           '<b>Filter by topic</b>:<br/>\n '
        +  '<input id="searchAndMode" type="checkbox">'
        +  '<span id="idLabelSearchAndMode" mono></span>'
        +  '<br/>\n'
        +  '<div id="searchFormLabels">\n'
        +  '</div><br/>\n'
      } else {
        html += "(No topics found).<br/>\n"
      }
      html += '<br/>'
      + '<div id="doSearchButton">Search&#128065;</div>'
      div.innerHTML = html;
  
      const domSearchAndMode = document.getElementById("searchAndMode")
      domSearchAndMode.addEventListener("change",  switchANDORSearch )
  
  
      const domInputQuery = document.getElementById("inputQuery")
      domInputQuery.addEventListener("change",  function () { SF.regexQuery = this.value } )
      const doSearchButton = document.getElementById("doSearchButton")
      doSearchButton.addEventListener('click', SF.doHideSearchFormAndSearch )
  
      domInputQuery.focus()
  
      SF.searchFormDOM = div;
      SF.searchForm_labelsDOM = document.getElementById("searchFormLabels")
  },
  showSearchForm : function() {
    SF.searchFormDOM.style.display="block";
    document.getElementById("inputQuery").value = SF.regexQuery
    document.getElementById("searchAndMode").checked = SF.labelANDMode
    document.getElementById("singleLineOnly").checked = SF.singleLineMode
    document.getElementById("caseSensitive" ).checked = SF.matchCaseMode
    document.getElementById("idLabelSearchAndMode" ).innerHTML = SF.labelAndOrText[SF.labelANDMode]
  
    var htmlLabels = ''
    Object.keys(labelMap).sort()
       .forEach(label_i => {
        htmlLabels += renderLabel(label_i)
    })
    SF.searchForm_labelsDOM.innerHTML = htmlLabels;
    document.querySelectorAll('.labelButton').forEach(
      domElement => {
        domElement.addEventListener('click', onLabelClicked)
      }
    )
  },
  hideSearchForm : function() {
    SF.searchFormDOM.style.display="none";
  },
  doHideSearchFormAndSearch : function () {
    SF.hideSearchForm();
    SE.highlightSearch();
  }
}

const ZW = { /* ZOOM Window */ 
    dom : window,
  onZoomOut : function(){
    if (ZC.zoomStatus == 1) {
      ZC.zoomFontSize = (ZC.zoomFontSize > 0.05) ? ZC.zoomFontSize - ZC.zoomStepOut : 0.0006
      ZC.cssRules[ZC.idxZoomDivRule].style['font-size']=ZC.zoomFontSize+'rem'
      return
    }
    if     (ZC.zoomableFontSize > 0.05) {
       ZC.zoomableFontSize = ZC.zoomableFontSize - ZC.zoomStepOut
    } else if (ZC.xsmallFontSize > 0.4 ){
       ZC.zoomableFontSize = 0.0006 // Absolute cero causes rendering problems in Firefox.
                                     // REF: https://bugzilla.mozilla.org/show_bug.cgi?id=1606305
       ZC.xsmallFontSize   = ZC.xsmallFontSize - ZC.zoomStepOut
    } else {
       ZC.zoomableFontSize = 0.0006
       ZC.xsmallFontSize   = 0.4
    }
    ZC.cssRules[ZC.idxZoomRule  ].style['font-size']=ZC.zoomableFontSize+'rem'
    ZC.cssRules[ZC.idxXSmallRule].style['font-size']=ZC.xsmallFontSize  +'rem'
    ZC.cssRules[ZC.idxXTitleRule].style['font-size']=ZC.xsmallFontSize  +'rem'
  },
  onZoomIn : function() {
    if (ZC.zoomStatus == 1) {
      ZC.zoomFontSize = ZC.zoomFontSize + ZC.zoomStepIn
      ZC.cssRules[ZC.idxZoomDivRule].style['font-size']=ZC.zoomFontSize+'rem'
      return;
    }
    if (ZC.xsmallFontSize < 1.2) {
      ZC.xsmallFontSize = ZC.xsmallFontSize + ZC.zoomStepIn
    } else {
      ZC.zoomableFontSize = ZC.zoomableFontSize + ZC.zoomStepIn
    }
    ZC.cssRules[ZC.idxZoomRule  ].style['font-size']=ZC.zoomableFontSize+'rem'
    ZC.cssRules[ZC.idxXSmallRule].style['font-size']=ZC.xsmallFontSize  +'rem'
    ZC.cssRules[ZC.idxXTitleRule].style['font-size']=ZC.xsmallFontSize  +'rem'
  },
  renderZoomBox : function() {
    const dom1 = document.createElement('div');
        dom1.setAttribute("id", "zoomDiv")
    dom1.innerHTML = ""
       + "<div style='margin-bottom:0.5rem'>" 
       + " <div id='divCloseZoom'>✕ (close)</div>" 
       + " <span style='font-weight:bold' text-align='center'>"+document.title+"</span>"
       + " <div id='historyBackFor' style='display:inline; '>"
       +    "<span id='GoBack'>?</span>"
       +    "<span id='GoForw'>?</span>"
       + " </div>" 
       + " <div id='divElementLabels'></div>" 
       + "</div>"
       + "<div id='zoomHTMLContent'/>"
    ZW.dom = dom1
    ZW.dom = dom1
    document.body.insertBefore(dom1,document.body.children[0])
    document.getElementById("divCloseZoom").addEventListener("click", ZW.doCloseZoom);
    document.getElementById("GoBack"      ).addEventListener("click", NAV.goBack);
    document.getElementById("GoForw"      ).addEventListener("click", NAV.goForward);
  },
  doOpenZoom : function(e) {
    document.getElementById("buttonZoomIn" ).innerHTML="[zoom-in]";
    document.getElementById("buttonZoomOut").innerHTML="[zoom-out]";
    // if(NAV.visited[NAV.visited.length-1] == e) { isHistoric = true }
    if(NAV.visited.indexOf(e)>=0) { 
        NAV.visited_idx = NAV.visited.indexOf(e)
    } else { // Apend new visits only
      NAV.visited.push(e)
      NAV.visited_idx =NAV.visited.length-1
    }

    if (NAV.visited.length > 0) {
      let nbackNumber =  NAV.visited_idx                       
      let nforwNumber = (NAV.visited.length-1)-NAV.visited_idx
      let backNumber = ((nbackNumber>0) ? ("xxx"+nbackNumber).slice(-3)+"←" : "xxxx").replace(/x/g,"&nbsp;")
      let forwNumber = ((nforwNumber>0) ? "→"+("xxx"+nforwNumber).slice(-3) : "xxxx").replace(/x/g,"&nbsp;")
      document.getElementById("historyBackFor").style.display="inline"
      document.getElementById("GoBack").innerHTML = backNumber
      document.getElementById("GoForw").innerHTML = forwNumber
    } else {
      document.getElementById("historyBackFor").style.display="none"
    }

  
    let sLabels="";
    if (e.attributes && e.attributes.labels) {
        /* list -> Set -> array leaves non-repeated/unique elements*/
      Array
        .from(
          new Set(e.attributes.labels.value.split(",")))
        .filter(e => !!e)
        .forEach(label_i => { sLabels += renderLabel(label_i) })
    }
    document.getElementById("divElementLabels").innerHTML = sLabels;
    document.getElementById("zoomHTMLContent").innerHTML = e.outerHTML; 
    ZW.dom.style.display="block";
    ZW.dom.scrollTop = 0;
    return false;
  },
  doCloseZoom : function() {
    ZC.zoomStatus = 0 
    document.getElementById("buttonZoomIn" ).innerHTML="[dive]";
    document.getElementById("buttonZoomOut").innerHTML="[orbit]";
    ZW.dom.style.display="none";
  }
}

const ZC = { /* zoom Control */
  idxZoomDivRule :-1,
  idxZoomRule:-1,
  idxXSmallRule:-1,
  idxXTitleRule:-1,
  zoomStatus: 0, // 0 = inactive, 1 = zoomedContent
  zoomableFontSize:0.05,
  xsmallFontSize:0.7, // must match initial size xsmall/title in css
  zoomFontSize:1.00,
  zoomStepIn:0.20,
  zoomStepOut:0.10,
  cssRules : []
}

const NAV = { // Navigation
  visited:[],
  visited_idx:-1,
  goBack : function() {
    if(NAV.visited_idx == 0) return
    NAV.visited_idx--
    let e = NAV.visited[NAV.visited_idx]
    ZW.doOpenZoom(e);
    ZC.zoomStatus = 1
  },
  goForward : function() {
    if(NAV.visited_idx == NAV.visited.length-1) return
    NAV.visited_idx++
    let e = NAV.visited[NAV.visited_idx]
    ZW.doOpenZoom(e);
    ZC.zoomStatus = 1
  }
}

function onKeyUp(e) {  // Keyboard controller
  if (e.key === "z") { ZW.onZoomOut(); return }
  if (e.key === "Z") { ZW.onZoomIn (); return }
  if (e.code === "Escape") {
    if (ZC.zoomStatus === 0) {
      resetTextFoundAttr(true)
    } else {
         ZW.doCloseZoom()
    }
  }
  if (e.key === "PageDown") { NAV.goForward(); return }
  if (e.key === "PageUp"  ) { NAV.goBack   (); return }

  if (e.code === "Enter") { ZW.doCloseZoom() }
  if (e.code === "F1") doHelp(); 
}

var replaceMap = { "wikipedia" : "https://en.wikipedia.org/wiki" }
var labelMapSelected = { /* label : isSelected true|false */ }



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
         ZW.doOpenZoom(self)
         ZC.zoomStatus = 1
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
       ZW.doOpenZoom(self) 
       ZC.zoomStatus = 1
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

function onLabelClicked(e) {
    const dom = e.target;
    const label = dom.value;
    if (!dom.attributes) {
         dom.attributes = { selected : { value : "false" } }
    }
    if (dom.attributes.selected.value == "false") {
        dom.attributes.selected.value = "true"
        labelMapSelected[label] = true
    } else {
        dom.attributes.selected.value = "false"
        delete labelMapSelected[label]
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
  return "<input "+cssAtribute+" class='labelButton' selected="+(!!labelMapSelected[sLabel])+
         " type='button' value='"+sLabel+"' /><span labelcount>"+labelMap[sLabel].length+"</span>" ;
}

function switchANDORSearch() { // @ma
  SF.labelANDMode=!SF.labelANDMode  
  document.getElementById("idLabelSearchAndMode").innerHTML = SF.labelAndOrText[SF.labelANDMode]
}

function switchSingleLineMode() { SF.singleLineMode=document.getElementById("singleLineOnly").checked; }
function switchCaseMode()       { SF.matchCaseMode=document.getElementById("caseSensitive").checked; }

function getDomListForLabel(label) {
    if (!!!labelMap[label]) return [];
    else return labelMap[label];
}

function labelMapSelectedToCSV() {
  return Object.keys(labelMapSelected).sort().join(",")
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
        labelMap[label] = list
        labelCount++
    })
    if (labelCount>0) {
      var countEl = document.createElement('div');
          countEl.setAttribute("tagCount", "")
          countEl.innerHTML = labelCount
      node.insertBefore(countEl,node.children[0])
    }
  }
  // console.dir(labelMap)
}

function spbQuickPrint() {
  if (window.confirm('Use browser [print...] for print-previsualization.-')) {
      window.print()
  }
}



function onPageLoaded() {
  try {   preLoad(); } catch(err) {console.dir(err)}
  ZC.cssRules = document.styleSheets[0]['cssRules'][0].cssRules;
  ZW.renderZoomBox();
  var searchDiv = document.createElement('div');
      searchDiv.setAttribute("id", "upper_bar")
      searchDiv.innerHTML = ''
   + '<img id="idLabelsFilter" class="noprint" src="/labelIcon.svg"  '
   +   ' onerror="src = \'https://singlepagebookproject.github.io/SPB/labelIcon.svg\';" />'
   + '&nbsp;<span blue class="noprint" id="unhide" hidden style="cursor:ns-resize" onClick="resetTextFoundAttr(true)">[unhide]</span>'
   + '&nbsp;<a href="../help.html" class="noprint" style="cursor:help" target="_blank">[HelpMan]</a>'
   + '&nbsp;<span onClick="spbQuickPrint()" blue id="printButton">[Print]</span>'
   + '<span id="buttonZoomIn"  blue>[🔍︎ dive]             </span>'
   + '<span id="buttonZoomOut" blue>[📷 orbit]&nbsp;&nbsp;</span>'
   + '<br/>'
  document.body.insertBefore(searchDiv,document.body.children[0])
  document.getElementById("idLabelsFilter").addEventListener("click", SF.showSearchForm)
  document.getElementById("buttonZoomIn"  ).addEventListener("click", ZW.onZoomIn   )
  document.getElementById("buttonZoomOut" ).addEventListener("click", ZW.onZoomOut  )

  document.addEventListener('keyup'  , onKeyUp)

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
  Object.keys(replaceMap).forEach( key => 
     replaceMap[key] = [new RegExp("[$][{]"+key+"[}]",'g'), replaceMap[key]]
  )

  nodeList = document.querySelectorAll('*[zoom]')
  for (let idx in nodeList) { 
      if (!!! nodeList[idx].innerHTML) { continue }

      Object.keys(replaceMap).forEach( key => 
        nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(replaceMap[key][0],replaceMap[key][1])
      )
   // COMMENTED: Needs more testings 
   // nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/(http.?:\/\/[^\b]*)\b/,"<a target='_blank' href='$1'>$1</a>")
      // Open new window with pre-recoded search:[[Troubleshooting+restorecon?]]
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(
          /\[\[([^\?]*)\?\]\]/g,
          "<a href='#' TODO onClick='SE.highlightSearch(\"$1\")'>$1</a>"
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

  for (let idx=0; idx<ZC.cssRules.length; idx++){
      if( ZC.cssRules[idx].selectorText == "#zoomDiv") {
          ZC.idxZoomDivRule=idx
      }
      if( ZC.cssRules[idx].selectorText == "[zoom]") {
          ZC.idxZoomRule=idx
      }
      if( ZC.cssRules[idx].selectorText == "[xsmall]") {
          ZC.idxXSmallRule=idx
      }
      if( ZC.cssRules[idx].selectorText == "[title]") {
          ZC.idxXTitleRule=idx
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
  if (!!query) { SF.regexQuery = query; }
  if (!!query || !!label_l) {
    SE.highlightSearch()
  }
  let doShowSearchMenu = getParameterByName("showSearchMenu") 
  if (!!doShowSearchMenu || doShowSearchMenu == "") {
    SF.showSearchForm();
  }

  SF.renderSearchForm()

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
  return Object.keys(labelMapSelected).length > 0
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

const SE = { // (S)earch (E)ngine
  searchAndMark : function (node, finalRegex) {
    var htmlContent = (SF.singleLineMode)
         ? node.innerHTML 
         : node.innerHTML.replace(/\n/gm, ' ')
    var searchFound = finalRegex.test(htmlContent)
    // reset after search:
    // REF: https://stackoverflow.com/questions/11477415/why-does-javascripts-regex-exec-not-always-return-the-same-value
    finalRegex.lastIndex = 0;
    node.setAttribute("textFound", searchFound?"true":"false")
    if (searchFound) {
        const nodeListList =  (node.parentNode.parentNode.tagName != "BODY")
          ? [node.parentNode.parentNode.querySelectorAll(':not(div)[title]'),
             node.parentNode.querySelectorAll('[title]')]
          : [node.parentNode.querySelectorAll('[title]')]
        nodeListList.forEach( nodeList => {
             nodeList.forEach( labelEl => {
               labelEl.removeAttribute("hidden")
             })
        })
        NAV.visited.push(node)
        window.lastElementFound = node
    }
    return searchFound
  },
  highlightSearch :   function(query) {
    let unhideButton = document.getElementById("unhide");
    unhideButton.setAttribute("hidden","");

    if (typeof query != "string") query = "";
    if (!!query) { SF.regexQuery = query; }
    let finalQueryRegex = SF.regexQuery.replace(/ +/g,".*");
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
        let label_l=Object.keys(labelMapSelected)
        innerZoom_l = getDomListForLabel(label_l[0]);
        for (let idx=0; idx<label_l.length; idx++) {
            innerZoom_l = SF.labelANDMode 
                ? innerZoom_l.intersection( getDomListForLabel(label_l[idx]) )
                : innerZoom_l.union       ( getDomListForLabel(label_l[idx]) )
        }
    } else {
        // By default search inside all zoomable elements
        var innerZoom_l = document.querySelectorAll('*[zoom]')
    }
    var regexFlags = "g";
    if (!SF.matchCaseMode) regexFlags += "i";
    if (!SF.singleLineMode) regexFlags += "m";
    var finalRegex = (isEmptyQuery) 
        ? new RegExp(".*")
        : new RegExp("[^=>;]?(" + finalQueryRegex + ")", regexFlags)

    var numberOfMatches = 0

    NAV.visited=[]

    var foundElement = false
    for (let idx2 in innerZoom_l) {
        var node = innerZoom_l[idx2]
        if (false/* true => change node background in debug mode */) {
            node.setAttribute("textFound", "debug") 
        }
        if (node.innerHTML == null) continue
        if (!node.setAttribute    ) continue
        if (SE.searchAndMark(node,finalRegex)) { 
            numberOfMatches++ 
            foundElement = true
        }
    }
    if (numberOfMatches == 1) {
        ZW.doOpenZoom(lastElementFound);
        ZC.zoomStatus = 1
    }
    unhideButton.removeAttribute("hidden","");
    return false // avoid event propagation
  }
}
