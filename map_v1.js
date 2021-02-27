import { preLoad , postLoad } from './custom.js';

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
          div.classList.add("noprint")
    document.body.insertBefore(div,document.body.children[0])
    let html = ''
      + ' <div id="divClose">✕ (close)</div>' 
      + ' <div id="doSearchButton">&#128065;Search/Filter</div>&nbsp;'
      + ' <div id="unhide" hidden >show all</div>'
      + '  <input id="inputQuery" type="text" placeholder="(regex)search" maxlength="30" />&nbsp;'
      + '  <input id="singleLineOnly" type="checkbox" > '
      + '  <span class="regexFlags">single-line</span>'
      + '  <input id="caseSensitive"  type="checkbox">'
      + '  <span class="regexFlags">Case-Match</span>'
      + '  <br/>'
      if (Object.keys(LM.labelMap).length > 0) {
          html += 
           '<b>Filter by topic</b>:\n '
        +  '<input id="searchAndMode" type="checkbox">'
        +  '<span id="idLabelSearchAndMode" mono></span>'
        +  '<br/>\n'
        +  '<div id="searchFormLabels">\n'
        +  '</div>\n'
      } else {
        html += "(No topics found).<br/>\n"
      }
      div.innerHTML = html;
      document.getElementById("divClose").addEventListener("click", SF.hideSearchForm);
      document.getElementById("unhide"        ).addEventListener("click", function () { 
          SE.resetTextFoundAttr(true);
          this.setAttribute("hidden","true"); 
      })
    
      if (Object.keys(LM.labelMap).length > 0) {
        document.getElementById("searchAndMode").addEventListener("change",  SF.switchANDORSearch )
      }
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
    IC.hidePreview()
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
    // SF.hideSearchForm();
    SE.highlightSearch();
  },
}

const ZW = { /* ZOOM Window */ 
  dom : window,
  zoomFontSize:1.00,
  onZoomText : function(mode /* 0 => Zoom In, 1 => Zoom Out*/){
    ZW.zoomFontSize = ZW.zoomFontSize + ((mode == 0) ? 0.1 : -0.1)
    document.getElementById("zoomHTMLContent").querySelector("*[zoom]").style.fontSize=""+ZW.zoomFontSize+"rem"
    return
  },
  renderZoomBox : function() {
    const dom1 = document.createElement('div');
        dom1.setAttribute("id", "zoomDiv")
    dom1.innerHTML = ""
       + "<div style='margin-bottom:0.5rem'>" 
       + " <div id='divClose'>✕ (close)</div>" 
   //  + " <span style='font-weight:bold' text-align='center'>"+document.title+"</span>"
       + " <div id='historyBackFor' style='display:inline; '>"
       +    "<span id='GoBack'>←</span>&nbsp;"
       +    "<span id='GoForw'>→</span>"
       +    "<span id='cellNofM'>?</span> "
       + " </div>" 
       + ' <div id="butSwitchLectureMode" >?</div>'
       + ' <div id="textZoomIn" ><span style="font-size:0.7em">🔍︎+</span></div>'
       + ' <div id="textZoomOut"><span style="font-size:0.7em">🔍︎-</span></div>'
       + ' <br/>'
       + " <div id='divElementLabels' class='noprint'></div>" 
       + "</div>"
       + "<div id='zoomHTMLContent'/>"
    ZW.dom = dom1
    document.body.insertBefore(dom1,document.body.children[0])
    const dom2 = document.createElement('div');
          dom2.setAttribute("id", "previewHTMLContent")
    
    document.body.insertBefore(dom2,document.body.children[1])
    document.getElementById("divClose").addEventListener("click", ZW.doCloseZoom);
    document.getElementById("GoBack" ).addEventListener("click", NAV.goBack);
    document.getElementById("GoForw" ).addEventListener("click", NAV.goForward);
    document.getElementById("butSwitchLectureMode" ).addEventListener("click", ZW.switchLectureMode);
    document.getElementById("textZoomIn"  ).addEventListener("click", () => ZW.onZoomText(0));
    document.getElementById("textZoomOut" ).addEventListener("click", () => ZW.onZoomText(1));
    ZW.updateButtonSwitchLectureMode()
  },
  doOpenZoom : function(e) {
    IC.hidePreview()
    if (e.target != null ) e = e.target;
    for (let c = 0 ; c < 4; c++) {
      if (e.getAttribute("zoom") != null)  break
      e = e.parentNode
    }
    ZC.zoomStatus = 1
    if(NAV.visited.indexOf(e)>=0) { 
        NAV.visited_idx = NAV.visited.indexOf(e)
    } else { // Apend new visits only
      NAV.visited.push(e)
      NAV.visited_idx =NAV.visited.length-1
    }

    if (NAV.visited.length > 1) {
      document.getElementById("historyBackFor").style.display="inline"
      document.getElementById("cellNofM").innerHTML = NAV.visited_idx+1 + "/"+(NAV.visited.length)
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
    zoomHTML.querySelectorAll('.innerLink').forEach(
      dom => {
        const target = document.getElementById(dom.getAttribute("value"))
        dom.addEventListener('click', function() { ZW.doOpenZoom(target) } )
      }
    )


    ZW.dom.style.display="block"
    ZW.dom.style.opacity="0"
    setTimeout(() => { ZW.dom.style.opacity="1" } , 300)
    ZW.dom.scrollTop = 0
    setTimeout(function() {
      zoomHTML.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 1)
    return false;
  },
  lectureModePtr : 0,
  lecturModeDescriptionList : ["&nbsp;⍈&nbsp;", "&nbsp;⍇&nbsp;", "&nbsp;🕮&nbsp;" ],
  getNextLectureMode : function () {
     let result = (ZW.lectureModePtr+1) % ZW.lecturModeDescriptionList.length;
     return result;
  },
  switchLectureMode : function () {
     const zoomHTML = document.getElementById("zoomHTMLContent").querySelector('pre[zoom]')
     zoomHTML.classList.remove("lectureMode"+ZW.lectureModePtr)
     ZW.lectureModePtr =  ZW.getNextLectureMode();
     zoomHTML.classList.add("lectureMode"+ZW.lectureModePtr)
     ZW.updateButtonSwitchLectureMode()
  },
  updateButtonSwitchLectureMode : function() {
    document.getElementById("butSwitchLectureMode" ).innerHTML = 
             ZW.lecturModeDescriptionList[ ZW.getNextLectureMode() ];
  },
  doCloseZoom : function() {
    ZW.dom.style.display="none";
    ZW.dom.style.opacity="0";
    MB.onZoomClosed()
  }
}

const ZC = { /* map zoom Control */
  idxZoomRule:-1,
  idxXSmallRule:-1,
  idxXTitleRule:-1,
  zoomStatus: 0, // 0 = inactive, 1 = zoomedContent
  zoomableFontSize:0.05,
  xsmallFontSize:0.7, // must match initial size xsmall/title in css
  zoomStepIn:0.20,
  zoomStepOut:0.10,
  cssRules : [],
  initCSSIndexes : function() {
    ZC.cssRules = document.styleSheets[0]['cssRules'][0].cssRules;
    for (let idx=0; idx<ZC.cssRules.length; idx++){
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
  },
  onZoomOut : function(){
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
  onZoomIn : function(mode /* 0 = Zoom Map; 1 = Zoom Text*/) {
    if (ZC.xsmallFontSize < 1.2) {
      ZC.xsmallFontSize = ZC.xsmallFontSize + ZC.zoomStepIn
    } else {
      ZC.zoomableFontSize = ZC.zoomableFontSize + ZC.zoomStepIn
    }
    ZC.cssRules[ZC.idxZoomRule  ].style['font-size']=ZC.zoomableFontSize+'rem'
    ZC.cssRules[ZC.idxXSmallRule].style['font-size']=ZC.xsmallFontSize  +'rem'
    ZC.cssRules[ZC.idxXTitleRule].style['font-size']=ZC.xsmallFontSize  +'rem'
  },
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
    const labeled_dom_l = document.querySelectorAll('*[labels]');
    for (let idx1 in labeled_dom_l) {
      const node = labeled_dom_l[idx1]
      if (!node.getAttribute    ) continue
      const csvAttributes = node.getAttribute("labels")
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
        const countEl = document.createElement('div');
            countEl.setAttribute("tagCount", "")
            countEl.innerHTML = labelCount
        node.insertBefore(countEl,node.children[0])
      }
    }
  }
}

const IC = { // Input Control
  onKeyUp: function(e) {  // Keyboard controller
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
  showPreviewTimeout : null,
  showPreviewEvent : null,
  showPreviewInZoom : function() { ZW.doOpenZoom(IC.showPreviewEvent) },
  showPreview : function(event) {
    if (!!IC.showPreviewTimeout)  {
        window.clearTimeout(IC.showPreviewTimeout) 
    }
    IC.showPreviewTimeout = setTimeout( () => {
      const e = event.target
   // const docWidth = document.body.getBoundingClientRect().width;
      const docWidth = window.innerWidth
      const margin = 10
      const previewDom = document.getElementById("previewHTMLContent")
      if (!!!IC.showPreviewEvent /* First execution */) { 
        previewDom.addEventListener('dblclick', IC.showPreviewInZoom, true)
        IC.showPreviewEvent = event;
      } else {
        IC.showPreviewEvent = event;
      }
            previewDom.style["top"]  = "" + (e.offsetTop + e.getBoundingClientRect().height ) + "px"
      previewDom.style["left" ] = ""
      previewDom.style["right" ] = ""
      const freeToLeft  = ( e.getBoundingClientRect().left  )
      const freeToRight = ( docWidth - e.getBoundingClientRect().right )

      previewDom.style["display"] = "block"
   // previewDom.style["max-width"] = "96%"
      previewDom.innerHTML =
         "<div id='previewTop'>" +
         "<span id='previewHints'> (double click for details)</span>" +
         "<span id='closePreview'>X</span><br/>" +
         "</div>" +
         e.outerHTML
      // TODO:(qa) closePreview listener never released. Done automatically ?
      document.getElementById("closePreview").
              addEventListener('click', IC.hidePreview ) 
      setTimeout( () => {
        if (freeToLeft > freeToRight ) {
console.log(1)
             previewDom.style["left" ] = "" + e.getBoundingClientRect().right - previewDom.getBoundingClientRect().width + "px"
        } else {
console.log(2)
           previewDom.style["left"  ] = "" + e.getBoundingClientRect().left                                             + "px"
        }

        // const previewWidthBy2 = previewDom.getBoundingClientRect().width / 2
        let overflowRight = false
        if (previewDom.getBoundingClientRect().right > docWidth ) {
console.log(3)
          previewDom.style["right" ] = "calc(100% - 98vw)"
//        if (previewDom.getBoundingClientRect().width < docWidth ) {
//          console.log(3.1)
//          previewDom.style["left" ] = ""
//        }
        }
        if (previewDom.getBoundingClientRect().left < 0 ) {
console.log(4)
          previewDom.style["left" ] = "calc(2vw)"
//        if (previewDom.getBoundingClientRect().width < docWidth ) {
//  console.log(4.1)
//          previewDom.style["right" ] = ""
//        }
        }
      }, 1 /* on next tick */)
    }, 500)
  },

  hidePreview : function(event) {
    const preview = document.getElementById("closePreview")
    if (!!preview) { preview.removeEventListener('click', IC.hidePreview ) }
    const previewDom = document.getElementById("previewHTMLContent")
    previewDom.style["display"] = "none"
    previewDom.innerHTML = ""
  },
  initInputControl: function(){
    document.addEventListener('keyup'  , IC.onKeyUp)
    const nodeList = document.querySelectorAll('*[zoom]')
    for (let idx in nodeList) { 
       const node = nodeList[idx]
       if (!!! node.addEventListener) continue
       IC.LPC.enableDblClick (node)
       IC.LPC.enableLongTouch(node)
       node.addEventListener('mouseenter', IC.showPreview )
       node.addEventListener('mouseleave', function() { window.clearTimeout(IC.showPreviewTimeout) } )
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
       node.addEventListener('dblclick', ZW.doOpenZoom, true)
     },
     enableLongTouch : function (node) { 
    // node.addEventListener("mousedown" , IC.LPC.start);
       node.addEventListener("touchstart", IC.LPC.start);
    // node.addEventListener("click"     , IC.LPC.click);
       node.addEventListener("mouseleave", IC.LPC.cancel);
       node.addEventListener("touchend"  , IC.LPC.cancel);
       node.addEventListener("touchleave", IC.LPC.cancel);
       node.addEventListener("touchcancel",IC.LPC.cancel);
     }
  }

}

const TPP = {  // (T)ext (P)re (P)rocessor
  doTextPreProcessing : function () {
    // create re-usable regex outside loop.
    const  document_name=window.location.pathname.split("/").pop()

    const nodeList = document.querySelectorAll('*[zoom]')
    for (let idx in nodeList) { // TODO:(?) Replace on demand, when cell opened.
        let N = nodeList[idx]
        let H = N.innerHTML
        if (!!! H) { continue }

        // Open new window with pre-recoded search:[[Troubleshooting+restorecon?]]
        H = H.replace( /\[\[([^\?]*)\?\]\]/g,
            "<div class='innerSearch'>$1</div>"
          + "<a target='_blank' "
          + " href='"+window.location.href.split('?')[0]+"?query=$1&labels="+LM.labelMapSelectedToCSV()+"'>"
          + " (⏏ )</a>"
        )
        H = H.replace(/@\[(http[^\]]*)\]/g,"<a target='_new' href='$1'> [$1]</a>")   
        // Add support for inner links: '@[#internalId]'
        H = H.replace(/@\[#([^\]]*)\]/g,   "<div class='innerLink' value='$1'> [$1]</div>")   
        H = H.replace(/Gº([^º\n]*)º/g, "<b green >  $1 </b>")   
        H = H.replace(/Rº([^º\n]*)º/g, "<b red   >  $1 </b>")   
        H = H.replace(/Bº([^º\n]*)º/g, "<b blue  >  $1 </b>")   
        H = H.replace(/Oº([^º\n]*)º/g, "<b orange>  $1 </b>")   
        H = H.replace(/Qº([^º\n]*)º/g, "<b brown >  $1 </b>")   
        H = H.replace(/Yº([^º\n]*)º/g, "<b yellow>  $1 </b>")   
        H = H.replace(/[$]º([^º\n]*)º/g, "  <span console>$1</span>")   
        H = H.replace(/_º([^º\n]*)º/g, "<span sub>$1   </span>")
        H = H.replace(/^º([^º\n]*)º/g, "<span super>$1   </span>")
        H = H.replace( /º([^º\n]*)º/g, "<b        > $1 </b>")   
        H = H.replace( /[˂]/g, "&lt;")
        H = H.replace( /[˃]/g, "&gt;")
        H = H.replace( /[⅋]/g, "&amp;")
        // Some utf-8 hand icons do not work properly while editing in vim/terminal
        // but looks much better in the final HTML. Replace icons:
        H = H.replace(/☜/g, "👈")   
        H = H.replace(/☝/g, "👆")
        H = H.replace(/☞/g, "👉")
        H = H.replace(/☟/g, "👇")
        H = H.replace(/[.]\n/g, ".<br/>")   
        H = H.replace(/[:]\n/g, ":<br/>")   
        H = H.replace(/\n\s*\n/g, "<br/><br/>")   
        N.innerHTML = H

        // TODO: Add markdown table parser. REF: https://github.com/blattmann/mdtablesparser/blob/master/js/parser.js

    }

  },
}

const MB = { // Menu Bar
  renderMenuBar : function (){
    const searchDiv = document.createElement('div');
        searchDiv.setAttribute("id", "upper_bar")
        searchDiv.innerHTML = ''
     + '<img id="idLabelsFilter" class="noprint" src="/labelIcon.svg"  '
     +   ' onerror="src = \'https://singlepagebookproject.github.io/SPB/labelIcon.svg\';" />'
     + '║<a href="../help.html" class="noprint" style="cursor:help" target="_blank" >HelpMan</a>'
     + '║<span blue id="printButton">Print</span>'
     + '║<div id="hint01">☞move mouse over cell<br/> for preview</div>'
     + '<span id="buttonZoomIn"  blue>🔍︎ dive</span>'
     + '<span id="buttonZoomSep" >⇆</span>'
     + '<span id="buttonZoomOut" blue>📷 orbit</span>'
     + '<br/>'
    document.body.insertBefore(searchDiv,document.body.children[0])
    document.getElementById("idLabelsFilter").addEventListener("click", SF.showSearchForm)
    document.getElementById("idLabelsFilter").addEventListener("click", SF.showSearchForm)
    document.getElementById("buttonZoomIn"  ).addEventListener("click", ZC.onZoomIn  )
    document.getElementById("buttonZoomOut" ).addEventListener("click", ZC.onZoomOut )
    { 
      // https://stackoverflow.com/questions/27116221/prevent-zoom-cross-browser
      const meta = document.createElement('meta')
            meta.setAttribute("name", "viewport")
            meta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no")
      document.head.insertBefore(meta,document.head.children[0])

      function addGestureZoom() {
        // https://stackoverflow.com/questions/11183174/simplest-way-to-detect-a-pinch/11183333#11183333 {
        let last = 0;
        let lock = false;
        window.addEventListener('touchmove', 
          function(event) {
            if (lock == true) return
         // if (event.targetTouches.length === 2) {
            if (event.touches.length == 2) {
                let hypo1 = Math.hypot((event.targetTouches[0].pageX - event.targetTouches[1].pageX),
                    (event.targetTouches[0].pageY - event.targetTouches[1].pageY));
                if (last == 0) { last = hypo1; return; }
                if      (hypo1  == last) { return        }
                lock = true
                if      (hypo1 >  last)  { ZC.onZoomIn ()}
                else if (hypo1 <  last)  { ZC.onZoomOut()}
                last = 0;
                setTimeout(function(){ lock = false; }, 1000)
            } else {
                lock = false
            }
          }, false);
      }
      addGestureZoom()
    }
    document.getElementById("printButton").addEventListener("click", MB.spbQuickPrint )
  },
  spbQuickPrint : function() {
    if (window.confirm('Use browser [print...] for print-previsualization.-')) {
        window.print()
    }
  },
  onZoomClosed : function() { },
}

function switchLinksToBlankTarget() {
  // Change default a.target to blank.
  const nodeList = document.querySelectorAll('a')
  const thisDoc=document.location.origin+document.location.pathname;
  for (let idx in nodeList) { 
    const nodeHref = nodeList[idx].href
    if (!nodeHref) { continue }
    if (! (nodeHref.startsWith("http")) ) continue
    if ( nodeHref.startsWith(thisDoc)) continue
    nodeList[idx].target='_blank' 
  }
}

function pageLoadedEnd() {
  let id=window.location.hash.replace("#","")
  if (id=="") {
      id = getParameterByName("id") || ""
  }
  if (!!id) {
    const targetDom = document.getElementById(id)
    if (!!targetDom) {
      ZW.doOpenZoom(targetDom);
      return;
    }
  }


  // Parse query parameters
  let csvLabels = getParameterByName("topics") || ""
      csvLabels = csvLabels.toLowerCase()
  let label_l = (!!csvLabels) ? csvLabels.split(",") : []
  label_l.forEach(label => {
      LM.onLabelClicked({ target : {value : label} });
  })
  let query = getParameterByName("query")
  if (!!query) { SF.regexQuery = query; }
  if (!!query || !!label_l) {
    SE.highlightSearch()
  }

  let doShowSearchMenu = getParameterByName("showSearchMenu")  || ""
  if (["0","false"].indexOf(doShowSearchMenu.toLowerCase())<0) {
    SF.showSearchForm();
  }
  try {  
      postLoad();
  } catch(err) {console.dir(err)}
}

function onPageLoaded() {
  if  ( window.spbLoaded ) {
      console.log("Already loaded")
      return
  }
  console.log("Initializing SPB")
  window.spbLoaded = true
  try { preLoad(); } catch(err) {console.dir(err)}

  IC.initInputControl();
  switchLinksToBlankTarget();

  TPP.doTextPreProcessing()
  ZC.initCSSIndexes()
  LM.createLabelIndex()

  ZW.renderZoomBox();
  SF.renderSearchForm()
  MB.renderMenuBar();

  pageLoadedEnd()
}

window.addEventListener('load', onPageLoaded )

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
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
    const htmlContent = (SF.singleLineMode)
         ? node.innerHTML 
         : node.innerHTML.replace(/\n/gm, ' ')
    const searchFound = finalRegex.test(htmlContent)
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
        innerZoom_l = document.querySelectorAll('*[zoom]')
    }
    var regexFlags = "g";
    if (!SF.matchCaseMode) regexFlags += "i";
    if (!SF.singleLineMode) regexFlags += "m";
    const finalRegex = (isEmptyQuery) 
        ? new RegExp(".*")
        : new RegExp("[^=>;]?(" + finalQueryRegex + ")", regexFlags)

    var numberOfMatches = 0

    NAV.visited=[]

    var foundElement = false
    for (let idx2 in innerZoom_l) {
        const node = innerZoom_l[idx2]
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
    const removeNodeList = document.querySelectorAll('*[textFound]');
    if (removeNodeList.length == 0) return; // Nothing to do.
    for (let idx in removeNodeList) {
        if (!removeNodeList[idx].setAttribute) continue; // <- Umm: works fine at page-load, fails in following searchs
        if (bKeepHighlightedSearch && removeNodeList[idx].getAttribute("textFound") == "true") continue;
        removeNodeList[idx].removeAttribute("textFound"); 
    }
  }
}
