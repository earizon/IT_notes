import { preLoad , postLoad } from '/custom.js';

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
  switchANDORSearch : function() {
    SF.labelANDMode=!SF.labelANDMode  
    document.getElementById("idLabelSearchAndMode").innerHTML = SF.labelAndOrText[SF.labelANDMode]
  },
  renderSearchForm : function() {
    const div = document.createElement('div');
          div.setAttribute("id", "searchForm")
    document.body.insertBefore(div,document.body.children[0])
    let html = ''
      + '  <input id="inputQuery" type="text" placeholder="(regex)search" maxlength="30" />'
      + '  <input id="singleLineOnly" type="checkbox" > '
      + '  <span class="regexFlags">single-line</span>'
      + '  <input id="caseSensitive"  type="checkbox">'
      + '  <span class="regexFlags">Case-Match</span>'
      + '  <br/><hr/>'
      if (Object.keys(LM.labelMap).length > 0) {
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
      + '<div id="doSearchButton">&#128065;Search</div>'
      div.innerHTML = html;
  
      document.getElementById("searchAndMode").addEventListener("change",  SF.switchANDORSearch )
      document.getElementById("doSearchButton").addEventListener('click', SF.doHideSearchFormAndSearch )
      const swithSingleLineDom = document.getElementById("singleLineOnly");
            swithSingleLineDom.addEventListener('click', function (){ SF.singleLineMode=swithSingleLineDom.checked; } )
      const swithCaseSensitDom = document.getElementById("caseSensitive");
      swithCaseSensitDom.addEventListener('click',  function () { SF.matchCaseMode=swithCaseSensitDom.checked; } )

      const domInputQuery = document.getElementById("inputQuery")
      domInputQuery.addEventListener("change",  function () { SF.regexQuery = this.value } )
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
    Object.keys(LM.labelMap).sort()
       .forEach(label_i => {
        htmlLabels += LM.renderLabel(label_i)
    })
    SF.searchForm_labelsDOM.innerHTML = htmlLabels;
    document.querySelectorAll('.labelButton').forEach(
      domElement => {
        domElement.addEventListener('click', LM.onLabelClicked)
      }
    )
  },
  hideSearchForm : function() {
    SF.searchFormDOM.style.display="none";
  },
  doHideSearchFormAndSearch : function () {
    SF.hideSearchForm();
    SE.highlightSearch();
  },


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
    ZC.zoomStatus = 1
    document.getElementById(MB.buttonZoomIn ).innerHTML="<span style='font-size:1.0em'>ABC</span>";
    document.getElementById(MB.buttonZoomOut).innerHTML="<span style='font-size:0.7em'>🔍︎ABC</span>";
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
        .forEach(label_i => { sLabels += LM.renderLabel(label_i) })
    }
    document.getElementById("divElementLabels").innerHTML = sLabels;
    const zoomHTML = document.getElementById("zoomHTMLContent")
    zoomHTML.innerHTML = e.outerHTML; 
    zoomHTML.querySelectorAll('.innerSearch').forEach(
      dom => {
        dom.addEventListener('click', function() { SE.highlightSearch(dom.innerHTML) })
      }
    )

    ZW.dom.style.display="block";
    ZW.dom.scrollTop = 0;
    return false;
  },
  doCloseZoom : function() {
    ZC.zoomStatus = 0 
    ZW.dom.style.display="none";
    MB.onZoomClosed()
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
  cssRules : [],
  initCSSIndexes : function() {
    ZC.cssRules = document.styleSheets[0]['cssRules'][0].cssRules;
    for (let idx=0; idx<ZC.cssRules.length; idx++){
        if( ZC.cssRules[idx].selectorText == "#zoomDiv, #searchForm") {
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
  }
}

const NAV = { // Navigation
  visited:[],
  visited_idx:-1,
  goBack : function() {
    if(NAV.visited_idx == 0) return
    NAV.visited_idx--
    let e = NAV.visited[NAV.visited_idx]
    ZW.doOpenZoom(e);
  },
  goForward : function() {
    if(NAV.visited_idx == NAV.visited.length-1) return
    NAV.visited_idx++
    let e = NAV.visited[NAV.visited_idx]
    ZW.doOpenZoom(e);
  }
}

const LM = { // Lavel management
  labelMapSelected : { /* label : isSelected true|false */ },
  labelMap : { /* label : dom_list*/ },

  isAnyLabelSelected : function() {
    return Object.keys(LM.labelMapSelected).length > 0
  },
  onLabelClicked : function (e) {
    const dom = e.target;
    const label = dom.value;
    if (!dom.attributes) {
         dom.attributes = { selected : { value : "false" } }
    }
    if (dom.attributes.selected.value == "false") {
        dom.attributes.selected.value = "true"
        LM.labelMapSelected[label] = true
    } else {
        dom.attributes.selected.value = "false"
        delete LM.labelMapSelected[label]
    }
    if (LM.isAnyLabelSelected()){
      document.getElementById("idLabelsFilter").setAttribute("active","true"); 
    } else {
      document.getElementById("idLabelsFilter").removeAttribute("active"); 
    }
  },
  renderLabel : function(sLabel) {
    sLabel = sLabel.toLowerCase()
    let cssAtribute    = (sLabel.startsWith("todo")) ? "red"  : ""
    return "<input "+cssAtribute+" class='labelButton' selected="+(!!LM.labelMapSelected[sLabel])+
           " type='button' value='"+sLabel+"' /><span labelcount>"+LM.labelMap[sLabel].length+"</span>" ;
  },
  getDomListForLabel: function (label) {
      if (!!!LM.labelMap[label]) return [];
      else return LM.labelMap[label];
  },
  labelMapSelectedToCSV: function() {
    return Object.keys(LM.labelMapSelected).sort().join(",")
  },
  createLabelIndex : function () {
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
          let list = LM.getDomListForLabel(label)
              list.push(node)
          LM.labelMap[label] = list
          labelCount++
      })
      if (labelCount>0) {
        var countEl = document.createElement('div');
            countEl.setAttribute("tagCount", "")
            countEl.innerHTML = labelCount
        node.insertBefore(countEl,node.children[0])
      }
    }
  }
}

const IC = { // Input Control
  onKeyUp: function(e) {  // Keyboard controller
    if (e.key === "z") { ZW.onZoomOut(); return }
    if (e.key === "Z") { ZW.onZoomIn (); return }
    if (e.code === "Escape") {
      if (ZC.zoomStatus === 0) {
        SE.resetTextFoundAttr(true)
      } else {
           ZW.doCloseZoom()
      }
    }
    if (e.key === "PageDown") { NAV.goForward(); return }
    if (e.key === "PageUp"  ) { NAV.goBack   (); return }
  
    if (e.code === "Enter") { ZW.doCloseZoom() }
    if (e.code === "F1") doHelp() 
  },
  initInputControl: function(){
    document.addEventListener('keyup'  , IC.onKeyUp)
    var nodeList = document.querySelectorAll('*[zoom]')
    for (let idx in nodeList) { 
       if (!!! nodeList[idx].addEventListener) continue
       IC.LPC.enableDblClick (nodeList[idx])
       IC.LPC.enableLongTouch(nodeList[idx])
    }
  },
  LPC : { /* (L)ong (P)ress (C)control */
     longpress : false,
     presstimer : null,
     click : function(e) {
       if (IC.LPC.presstimer !== null) {
         clearTimeout(IC.LPC.presstimer)
         IC.LPC.presstimer = null
       }
       if (IC.LPC.longpress) { return false }
     },
     start : function(e) {
       var self = this
       if (e.type === "click" && e.button !== 0) { return }
       IC.LPC.longpress = false
     
       if (IC.LPC.presstimer === null) {
         IC.LPC.presstimer = setTimeout(function() {
           ZW.doOpenZoom(self)
           IC.LPC.longpress = true
         }, 1000)
       }
     
       return false;
     },
     cancel : function(e) {
       if (IC.LPC.presstimer !== null) {
         clearTimeout(IC.LPC.presstimer);
         IC.LPC.presstimer = null;
       }
     },
     enableDblClick : function (node) {
       let self = node
       node.addEventListener('dblclick', function() { 
         ZW.doOpenZoom(self) 
       } , true)
     },
     enableLongTouch : function (node) { 
       node.addEventListener("mousedown" , IC.LPC.start);
       node.addEventListener("touchstart", IC.LPC.start);
       node.addEventListener("click"     , IC.LPC.click);
       node.addEventListener("mouseout"  , IC.LPC.cancel);
       node.addEventListener("touchend"  , IC.LPC.cancel);
       node.addEventListener("touchleave", IC.LPC.cancel);
       node.addEventListener("touchcancel",IC.LPC.cancel);
     }
  }

}

const TPP = {  // (T)ext (P)re (P)rocessor
  replaceMap : { "wikipedia" : "https://en.wikipedia.org/wiki" },
  doTextPreProcessing : function () {
    var nodeList = document.querySelectorAll('*[zoom]')
    for (let idx in nodeList) { 
        if (!!! nodeList[idx].innerHTML) { continue }

        Object.keys(TPP.replaceMap).forEach( key => 
          nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(TPP.replaceMap[key][0],TPP.replaceMap[key][1])
        )
        // COMMENTED: Needs more testings 
        // nodeList[idx].innerHTML = nodeList[idx].innerHTML
        // .replace(/(http.?:\/\/[^\b]*)\b/,"<a target='_blank' href='$1'>$1</a>")
        //
        // Open new window with pre-recoded search:[[Troubleshooting+restorecon?]]
        nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(
            /\[\[([^\?]*)\?\]\]/g,
            "<div class='innerSearch'>$1</div>"
          + "<a target='_blank' "
          + " href='"+window.location.href.split('?')[0]+"?query=$1&labels="+LM.labelMapSelectedToCSV()+"'>"
          + " (⏏ )</a>"
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

        // TODO: Add markdown table parser. REF: https://github.com/blattmann/mdtablesparser/blob/master/js/parser.js

    }
    document.querySelectorAll('.innerSearch').forEach(
      dom => {
        dom.addEventListener('click', function() { SE.highlightSearch(dom.innerHTML) })
      }
    )
  },
}

const MB = { // Menu Bar
  sOrbit:"📷 orbit",
  sDive :"🔍︎ dive",
  buttonZoomIn  :"buttonZoomIn",
  buttonZoomOut :"buttonZoomOut",
  renderMenuBar : function (){
    var searchDiv = document.createElement('div');
        searchDiv.setAttribute("id", "upper_bar")
        searchDiv.innerHTML = ''
     + '<img id="idLabelsFilter" class="noprint" src="/labelIcon.svg"  '
     +   ' onerror="src = \'https://singlepagebookproject.github.io/SPB/labelIcon.svg\';" />'
     + ' <span blue class="noprint" id="unhide" hidden style="cursor:ns-resize">unhide</span>'
     + '║<a href="../help.html" class="noprint" style="cursor:help" target="_blank" >HelpMan</a>'
     + '║<span blue id="printButton">Print</span>'
     + '<span id="'+MB.buttonZoomIn +'"  blue>'+MB.sDive +'</span>'
     + '<span id="buttonZoomSep"             >⇆</span>'
     + '<span id="'+MB.buttonZoomOut+'" blue>'+MB.sOrbit+'</span>'
     + '<br/>'
    document.body.insertBefore(searchDiv,document.body.children[0])
    document.getElementById("idLabelsFilter").addEventListener("click", SF.showSearchForm)
    document.getElementById("idLabelsFilter").addEventListener("click", SF.showSearchForm)
    document.getElementById(MB.buttonZoomIn ).addEventListener("click", ZW.onZoomIn   )
    document.getElementById(MB.buttonZoomOut).addEventListener("click", ZW.onZoomOut  )
    document.getElementById("unhide"        ).addEventListener("click", function () { SE.resetTextFoundAttr(true) })
    document.getElementById("printButton"   ).addEventListener("click", MB.spbQuickPrint )
  },
  spbQuickPrint : function() {
    if (window.confirm('Use browser [print...] for print-previsualization.-')) {
        window.print()
    }
  },
  onZoomClosed : function() {
    document.getElementById(MB.buttonZoomIn ).innerHTML=MB.sDive 
    document.getElementById(MB.buttonZoomOut).innerHTML=MB.sOrbit
  },
}

function switchLinksToBlankTarget() {
  // Change default a.target to blank.
  var nodeList = document.querySelectorAll('a')
  var thisDoc=document.location.origin+document.location.pathname;
  for (let idx in nodeList) { 
    var nodeHref = nodeList[idx].href
    if (!nodeHref) { continue }
    if (! (nodeHref.startsWith("http")) ) continue
    if ( nodeHref.startsWith(thisDoc)) continue
    nodeList[idx].target='_blank' 
  }
}

function onPageLoaded() {
  try {   preLoad(); } catch(err) {console.dir(err)}
  ZW.renderZoomBox();
  MB.renderMenuBar();

  IC.initInputControl();
  switchLinksToBlankTarget();

  // create re-usable regex outside loop.
  Object.keys(TPP.replaceMap).forEach( key => 
     TPP.replaceMap[key] = [new RegExp("[$][{]"+key+"[}]",'g'), TPP.replaceMap[key]]
  )

  TPP.doTextPreProcessing()
  ZC.initCSSIndexes()
  LM.createLabelIndex()

  let csvLabels = getParameterByName("topics") || ""
      csvLabels = csvLabels.toLowerCase()
  let label_l = (!!csvLabels) ? csvLabels.split(",") : []
  label_l.forEach(label => {
      LM.onLabelClicked({value : label});
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
    SE.resetTextFoundAttr(false);
    let isEmptyQuery = /^\s*$/.test(finalQueryRegex)

    if ((!LM.isAnyLabelSelected()) && isEmptyQuery) { return false; /* Nothing to do */ }

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
    if (LM.isAnyLabelSelected()) {
        let label_l=Object.keys(LM.labelMapSelected)
        innerZoom_l = LM.getDomListForLabel(label_l[0]);
        for (let idx=0; idx<label_l.length; idx++) {
            innerZoom_l = SF.labelANDMode 
                ? innerZoom_l.intersection( LM.getDomListForLabel(label_l[idx]) )
                : innerZoom_l.union       ( LM.getDomListForLabel(label_l[idx]) )
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
    }
    unhideButton.removeAttribute("hidden","");
    return false // avoid event propagation
  },
  resetTextFoundAttr : function(bKeepHighlightedSearch) {
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
}
