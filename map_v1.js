import { preLoad , postLoad } from './custom.js';

// TODO:(0) put document.getElementById("zoomDiv") is const var. 
const SF = {  /* search Form */
  searchFormDOM : window,
  searchForm_labelsDOM : window,
  regexQuery: "",
  singleLineMode : false,
  matchCaseMode : false,
  fullWordMode : false,
  labelANDMode : true,
  labelAndOrText : { 
      true : "Note contains ALL selected topics",
      false: "Note contains ANY selected topic"
  },
  copyLabels : function() {
    var text = "";
    LM.labelMap_key_list.forEach( label_i => { text += label_i + "\n" } )
    alert("select and copy:\n\n" + text)
  },
  switchANDORSearch : function() {
    SF.labelANDMode=!SF.labelANDMode  
    document.getElementById("idLabelSearchAndMode").innerHTML = SF.labelAndOrText[SF.labelANDMode]
    SE.executeSearch()
  },
  onRegexInputChanged : function () {
        if (SF.regexInputTimer !== null) {
           clearTimeout(SF.regexInputTimer)
           SF.regexInputTimer = null
        }
        SF.regexQuery = this.value
        SF.regexInputTimer = setTimeout(
             SE.executeSearch, 1000)
    },
  renderSearchForm : function() {
    const div = document.createElement('div');
          div.setAttribute("id", "searchForm")
          div.classList.add("noprint")
    document.body.insertBefore(div,document.body.children[0])
    let html = ''
      + ' <div id="divClose1">✕</div>' 
      + ' <div id="unhide" hidden >&nbsp;show all&nbsp;</div>'
      + '  <div id="divRegexForm">'
      + '  <input id="inputQuery"  type="text" placeholder="(regex)search"  />'
      + '  <div   id="matchNumber" ></div>'
      + '  <br/>'
      + '  <input id="singleLineOnly" type="checkbox" /> '
      + '  <label for="singleLineOnly">single-line</label>'
      + '  <input id="caseSensitive"  type="checkbox" />'
      + '  <label for="caseSensitive">Case-Match</label>'
      + '  <input id="fullWord"  type="checkbox" />'
      + '  <label for="fullWord">Full Word</label>'
      + '  </div>'
      + '  <br/>'
      + '  <div id="copyLabels">Copy Labels</div>'
      if (LM.DDBB.labelMap_key_list.length > 0) {
          html += 
           '<input id="searchAndMode" type="checkbox">'
        +  '<span id="idLabelSearchAndMode" mono></span>'
        +  '<br/>\n'
        +  '<div id="searchFormLabels">\n'
        +  '</div>\n'
      } else {
        html += "(No topics found).<br/>\n"
      }
      div.innerHTML = html;
      document.getElementById("divClose1").addEventListener("click", SF.hideSearchForm);
      document.getElementById("unhide"        ).addEventListener("click", function () { 
          SE.resetTextFoundAttr(true);
          this.setAttribute("hidden","true"); 
      })
      document.getElementById("copyLabels").addEventListener("click",  SF.copyLabels )
      if (LM.DDBB.labelMap_key_list.length > 0) {
        document.getElementById("searchAndMode").addEventListener("change",  SF.switchANDORSearch )
      }
      const swithSingleLineDom = document.getElementById("singleLineOnly")
      const swithCaseSensitDom = document.getElementById("caseSensitive")
      const swithCaseFullWord  = document.getElementById("fullWord")
      swithSingleLineDom.addEventListener('click', ()=>{ SF.singleLineMode=swithSingleLineDom.checked; } )
      swithCaseSensitDom.addEventListener('click', ()=>{ SF.matchCaseMode =swithCaseSensitDom.checked; } )
      swithCaseFullWord .addEventListener('click', ()=>{ SF.fullWordMode  =swithCaseFullWord.checked; } )

      const domInputQuery = document.getElementById("inputQuery")
      domInputQuery.addEventListener("input",  SF.onRegexInputChanged )
      domInputQuery.focus()
  
      SF.searchFormDOM = div;
      SF.searchForm_labelsDOM = document.getElementById("searchFormLabels")
  },
  regexInputTimer : null,
  sorterForRootTopicCache : {},
  generateSorterForRootTopic : function (root) {
      let result = SF.sorterForRootTopicCache[root]
      if (result != null) { return result }
      result = function(a,b) {
        const aStartsWithRoot = ( a.indexOf(root) == 0 )
        const bStartsWithRoot = ( b.indexOf(root) == 0 )
        if ( aStartsWithRoot && !bStartsWithRoot) return -1
        if (!aStartsWithRoot &&  bStartsWithRoot) return  1
        if (a > b) return  1 
        if (a < b) return -1 
        return 0 
      }
      SF.sorterForRootTopicCache[root] = result
      return result
  },
  showSearchForm : function() {
    SF.searchFormDOM.style.display="block";
    document.getElementById("inputQuery").value = SF.regexQuery
    document.getElementById("searchAndMode").checked = SF.labelANDMode
    document.getElementById("singleLineOnly").checked = SF.singleLineMode
    document.getElementById("caseSensitive" ).checked = SF.matchCaseMode
    document.getElementById("fullWord" ).checked = SF.fullWordMode
    document.getElementById("idLabelSearchAndMode" ).innerHTML = SF.labelAndOrText[SF.labelANDMode]
    const openDiv = '<div class="labelBlock">'
    var htmlLabels = openDiv
    Object.keys(LM.DDBB.topicTree).sort()
    // Render topics without children "packed" in one group
    .filter  ( root_topic => { return LM.DDBB.topicTree[root_topic].length == 1 } )
    .forEach ( root_topic => { htmlLabels += LM.renderLabel(root_topic, false, true, "prefixIgnoredForTrue" )} );
    htmlLabels += "</div>"
    // Render topics with    children "packed" in their own group
    Object.keys(LM.DDBB.topicTree).sort()
      .filter  ( root_topic => { return LM.DDBB.topicTree[root_topic].length != 1 } )
      .forEach ( root_topic      => {
          const root_topic_prefix = root_topic.replace(".*", "")
          htmlLabels += openDiv + "<div class='labelBlockTitle'>"+ root_topic_prefix +":</div>" 
          LM.DDBB.topicTree[root_topic]
          .sort(SF.generateSorterForRootTopic(root_topic))
          .forEach( topic => {
              htmlLabels += LM.renderLabel(topic, true, false, root_topic_prefix  )
          })
          htmlLabels += "</div>"
    });
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
}

const ZW = { /* ZOOM Window */ 
  dom : window,
  
  getMouseType : function () {
    // 2021-06-09: Not used, but can be very useful in a future.
    if (window.matchMedia("(pointer: coarse)").matches) { return "finger" }
    if (window.matchMedia("(pointer: fine)"  ).matches) { return "mouse" }
    return "none"
  },
  textSizeSlider : document.body,
  renderZoomBox : function() { /* Executed once at page load */
    const dom1 = document.createElement('div');
        dom1.setAttribute("id", "zoomDiv")
    dom1.innerHTML = ""
       + "<div class='noprint' id='zoomDivControls' style='margin-bottom:0.5rem'>" 
       + " <div id='divClose2'>✕ </div>" 
       + ' <pre id="switchMaximize" >╔╗</pre>'
       + " <div id='historyBackFor' style='display:inline; '>"
       +    "<span id='GoBack'>←</span>&nbsp;"
       +    "<span id='GoForw'>→</span>"
       +    "<span id='cellNofM'>?</span> "
       + " </div>" 
       + ' <div id="cellIDPanell"></div>'
       + ' <div id="butSwitchLectureMode" >?</div>'
       + ' <input id="textSizeSlider" type="range" '
       + '   style="width:100px" value="100" min="30" max="250">'
       + "</div>"
       + " <div id='divElementLabels' class='noprint'></div>" 
       + "<div id='zoomHTMLContent'/>"
    ZW.dom = dom1
    document.body.insertBefore(dom1,document.body.children[0])
    document.getElementById("divClose2").addEventListener("click", ZW.doCloseZoom);
    document.getElementById("GoBack" ).addEventListener("click", NAV.goBack);
    document.getElementById("GoForw" ).addEventListener("click", NAV.goForward);
    ZW.textSizeSlider = document.getElementById("textSizeSlider" )
    ZW.textSizeSlider.addEventListener("input", 
      () => {
         document.getElementById("zoomHTMLContent").
           querySelector("*[zoom]").style.fontSize=""+(ZW.textSizeSlider.value/100.)+"rem"
        }
    );
    document.getElementById("switchMaximize" ).addEventListener("click", function () { 
       const state = document.getElementById("zoomDiv").getAttribute("maximized") 
       document.getElementById("zoomDiv").setAttribute("maximized", state=="true"?"false":"true")
    })
 
    document.getElementById("butSwitchLectureMode" )
       .addEventListener("click", ZW.switchLectureMode);
    ZW.updateButtonSwitchLectureMode()
  },
  doOpenZoom : function(e) {
    if (e.target != null ) e = e.target;
    for (let c = 0 ; c < 4 /* TODO:(qa) 4 max depth level is arbitraty */ ; c++) {
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
      document.getElementById("cellNofM").innerHTML = 
         NAV.visited_idx+1 + "/"+(NAV.visited.length)
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
        .forEach(label_i => { sLabels += LM.renderLabel(label_i, true, true ) })
    }
    document.getElementById("divElementLabels").innerHTML = sLabels;
    const zoomHTML = document.getElementById("zoomHTMLContent")
    zoomHTML.innerHTML = e.outerHTML; 
    document.getElementById("cellIDPanell").innerHTML=e.id ? ("id:"+e.id ):"";
    zoomHTML.querySelectorAll('.innerSearch').forEach(
      dom => {
        dom.addEventListener('click', function() { SE.executeSearch(dom.innerHTML) })
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
    setTimeout(function() {
      zoomHTML.scrollIntoView({ behavior: 'smooth', block: 'start' })
      document.getElementById("zoomDiv").scrollTop = 0
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
  idxXTitleRule:-1,
  zoomStatus: 0, // 0 = inactive, 1 = zoomedContent
  cssRules : [],
  initialZoomSize : 0.6, /* must match css * 1000 */
  initCSSIndexes : function() {
    ZC.cssRules = document.styleSheets[0]['cssRules'][0].cssRules;
    for (let idx=0; idx<ZC.cssRules.length; idx++) {
     // console.log(ZC.cssRules[idx].selectorText)
      if( ZC.cssRules[idx].selectorText == "[zoom]") { ZC.idxZoomRule=idx }
      if( ZC.cssRules[idx].selectorText == "[xsmall], [zoom] > [title]") {
          ZC.idxXTitleRule=idx
      }
    }
  },
  onZoom : function() {
    const switchElementsOn = 90
    if (ZC.slider.value < switchElementsOn /* change title size */) {
      const newFontSize = ZC.slider.value / 100.
      ZC.cssRules[ZC.idxXTitleRule].style['font-size']=newFontSize  +'rem'
      ZC.cssRules[ZC.idxZoomRule  ].style['font-size']=0.0001 + 'rem'
    } else /* change normal text size*/ {
      const  delta0 = (ZC.slider.value - switchElementsOn)
      const  delta1 = Math.pow(delta0, 1.3)
      const newFontSize = delta1/1000.
      ZC.cssRules[ZC.idxZoomRule  ].style['font-size']=newFontSize + 'rem'
    }
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
  state : {
      labelMapSelected : { /* label : isSelected true|false */ } 
  },
  DDBB : { // immutable once initialized. Convention: Use Upper Case for Immutable Objects
    flatMap : { /* label : dom_list*/ }, // TODO:(0) rename topic2DOMList
    topicTree : { /* topic_root_label : child_topics */ }, // TODO:(0) Rename to topicTree /* depth 1 */
    labelMap_key_list : [], // TODO:(0) rename to labelMap_key_list ordered
    countPerLabelStat : {}, 
    endInitialization : function (inputLabelMap) {
    // STEP 1: create flatMap topic -> [dom_element1, dom_element2, ... ]
    LM.DDBB.flatMap = inputLabelMap

    // STEP 2: create topic list ordered alphabetically
    const topic_list = Object.keys(inputLabelMap).sort()
    topic_list.forEach( (topic) => { 
        LM.DDBB.countPerLabelStat[topic] = inputLabelMap[topic].length } 
    )

    // STEP 3.1: create topic tree parent (depth 1)
    const tree_root_list = topic_list.filter(
        (topic) => topic.indexOf('.*') == topic.indexOf('.') &&  /* skip topic.subtopic.* */ 
                   topic.indexOf('.*') == topic.length-2  )      /* allow only topic.* (vs topic.*....) */

    /* STEP 3.2: Create topic tree children (depth 2)
     * 
     * "topic1.*" : [ "topic1.*" ]
     * "topic2.*" : [ "topic2.*", "topic2.sub1", "topic2.sub2, ... ]
     * "topic3.*" : ...
     */
     tree_root_list.forEach( (root_topic) => {
       const prefix = root_topic.replace(".*","")
       const child_topic_content = []
       topic_list.forEach( (topic) => {
         if ( topic.indexOf(prefix +"." ) == 0 ||
              topic.indexOf( "."+prefix ) > 0
         ) {
           child_topic_content.push(topic)
         }
       })
       if (child_topic_content.length == 0) {
           throw new Error("at least root_topic must match its prefix")
       }
       LM.DDBB.topicTree[root_topic]  = child_topic_content
     })
     LM.DDBB.labelMap_key_list = topic_list 
     window.LM = LM // deleteme
    }
  },
  isAnyLabelSelected : function() {
    return Object.keys(LM.state.labelMapSelected).length > 0
  },
  setLabelSelectedOnOff : function( labelKey, bOnOff ) {
    if (bOnOff) { 
      LM.state.labelMapSelected[labelKey] = bOnOff
    } else {
      delete LM.state.labelMapSelected[labelKey]
    }
  },
  refreshLabelsUI : function() {
    document.querySelectorAll('.labelButton').forEach( e => {
          e.addEventListener('click', LM.onLabelClicked)
          if (!e.attributes) {
            e.attributes = { selected : { value : "false" } }
          }
          const labelKey = e.getAttribute("value")
          const isSelected = !! LM.state.labelMapSelected[labelKey]
          e.attributes.selected.value = ""+isSelected
        }
    )
  },
  onLabelClicked : function (e) {
    const dom = e.target
    const labelKey = dom.value ? dom.value : dom.getAttribute("value")
    if (!dom.attributes) { // TODO:(0) Use internal DDBB (vs storing in DOM) @ma
         dom.attributes = { selected : { value : "false" } }
    }
    if (dom.attributes.selected.value == "false") {
        LM.setLabelSelectedOnOff( labelKey, true)
    } else {
        LM.setLabelSelectedOnOff( labelKey, false)
    }
    if (LM.isAnyLabelSelected()){
      document.getElementById("idLabelsFilter").setAttribute("active","true"); 
    } else {
      document.getElementById("idLabelsFilter").removeAttribute("active"); 
    }
    LM.refreshLabelsUI()
    SE.executeSearch()
  },
  renderLabel : function(topic, showAsterisk, showPrefix, prefix) {
    let sTopic = showAsterisk ? topic  : topic.replace(".*","")
    if (!showPrefix ) { 
        sTopic = sTopic
                 .replace(prefix + ".","") // prefix == 101, topic =  101.topic1
                 .replace("." + prefix,"") // prefix == 101, topic == topic1.101
    }
    let cssAtribute    = (topic.indexOf("todo")>=0) ? " red"  : ""
    let html = "<div "+cssAtribute+" class='labelButton' selected="+(!!LM.state.labelMapSelected[topic])+ 
           " type='button' value='"+topic+"' />"+sTopic+"</div>"
    if (sTopic!="*") html += "<span labelcount>"+LM.DDBB.countPerLabelStat[topic]+"</span>" ;
    return html
  },
  getDomListForLabelPrefix: function (labelKey) {
      const matchingKeys = LM.DDBB.labelMap_key_list
            .filter((k) => k.startsWith(labelKey.replace(".*","")) )
      var result = []
      for (let idx=0; idx<matchingKeys.length; idx++) {
          const key = matchingKeys[idx]
          if (!!!LM.DDBB.flatMap[key]) continue
          result = result.union( LM.DDBB.flatMap[key] )
      }
      return result
  },
  labelMapSelectedToCSV: function() {
    return Object.keys(LM.state.labelMapSelected).sort().join(",")
  },
  createLabelIndex : function () {
    const labeled_dom_l = document.querySelectorAll('*[labels]');
    const inputDDBB = { /* topic: related_node_list */ }
    // STEP 1: Clean topics  in html label attributes
    for (let idx1 in labeled_dom_l ) {
      const node = labeled_dom_l[idx1]
      if (!!!node.getAttribute ) continue
      const input_labels_csvAttributes = node.getAttribute("labels")
                                         .toLowerCase().trim().replace(",,",",")
      if (!!!input_labels_csvAttributes || input_labels_csvAttributes == "") continue;
      if (input_labels_csvAttributes == ",") continue;
      const inputTopicList = input_labels_csvAttributes.split(",")
      const effectiveTopicList = []
      var labelCount = 0
      inputTopicList.forEach(inputTopic => {
        inputTopic = inputTopic.trim()
        while (inputTopic.endsWith(".")) { inputTopic = inputTopic.substring(0,inputTopic.length-1) }
        if (inputTopic=="") return
        if (inputTopic == "aaa") {debugger;}
        inputTopic = inputTopic.indexOf(".") >= 0 ? inputTopic : inputTopic+".*" 
        let list = (!!inputDDBB[inputTopic]) ?  inputDDBB[inputTopic] : []
        effectiveTopicList.push( inputTopic )
        list.push(node)
        inputDDBB[inputTopic] = list
        const topicPrefixAsterisk = inputTopic.substring(0, inputTopic.indexOf(".") ) + ".*"
        if (!!! inputDDBB[topicPrefixAsterisk] /* maybe topic1.sub exists but topic1.* not */ ) { 
          inputDDBB[topicPrefixAsterisk] = []
        }
        labelCount++
      })
      node.setAttribute("labels",effectiveTopicList.join())
      if (labelCount>0) {
        const countEl = document.createElement('div');
            countEl.setAttribute("tagCount", "")
            countEl.innerHTML = labelCount
        node.insertBefore(countEl,node.children[0])
      }
    }
    LM.DDBB.endInitialization(inputDDBB)
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
  initInputControl: function(){
    document.addEventListener('keyup'  , IC.onKeyUp)
    const nodeList = document.querySelectorAll('*[zoom]')
    for (let idx in nodeList) { 
       const node = nodeList[idx]
       if (!!! node.addEventListener) continue
       IC.LPC.enableDblClick (node)
       IC.LPC.enableLongTouch(node)
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
       node.addEventListener("touchstart", IC.LPC.start);
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
    for (let idx in nodeList) { // TODO:(qa) Replace on demand, when cell opened.
        let N = nodeList[idx]
        let H = N.innerHTML
        if (!!! H) { continue }

        // Open new window with pre-recoded search:
        // [[Troubleshooting+restorecon?]]
        H = H.replace( /\[\[([^\?]*)\?\]\]/g,
            "<div class='innerSearch'>$1</div>"
          + "<a target='_blank' "
          + " href='"+window.location.href.split('?')[0]+"?query=$1&labels="+LM.labelMapSelectedToCSV()+"'>"
          + " (⏏ )</a>"
        )
        // 1st) replace External link
        H = H.replace(/@\[(http.?[^\]]*)\]/g,"<a target='_new' href='$1'> [$1]</a>")   
        // 2nd) replace relative (to page) link
        H = H.replace(/@\[([^\]]*)\]/g,"<a target='_new' href='$1'> [$1]</a>")   

        // Add support for inner links: '@[#internalId]'
        H = H.replace(/@\[#([^\]]*)\]/g,   "<div class='innerLink' value='$1'> [$1]</div>")   

        H = H.replace(/Gº([^º\n]*)º/g, "  <b green >$1</b> ")   
        H = H.replace(/Rº([^º\n]*)º/g, "  <b red   >$1</b> ")   
        H = H.replace(/Bº([^º\n]*)º/g, "  <b blue  >$1</b> ")   
        H = H.replace(/Oº([^º\n]*)º/g, "  <b orange>$1</b> ")   
        H = H.replace(/Qº([^º\n]*)º/g, "  <b brown >$1</b> ")   
        H = H.replace(/Yº([^º\n]*)º/g, "  <b yellow>$1</b> ")   
        H = H.replace(/[$]º([^º\n]*)º/g, "  <span console>$1</span>")   
        H = H.replace(/_º([^º\n]*)º/g, "<span sub>$1   </span>")
        H = H.replace(/^º([^º\n]*)º/g, "<span super>$1 </span>")
        H = H.replace( /º([^º\n]*)º/g, " <b        >$1</b> ")   
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
        // TODO:(enhancement) Add markdown table parser.
        // REF: https://github.com/blattmann/mdtablesparser/blob/master/js/parser.js
    }

  },
}

const MB = { // Menu Bar
  renderMenuBar : function (){
    const searchDiv = document.createElement('div');
        searchDiv.setAttribute("id", "upper_bar")
        searchDiv.classList.add("noprint")
        searchDiv.innerHTML = ''
     + '<img id="idLabelsFilter" class="noprint" src="/labelIcon.svg" />'
     + '<a href="../help.html" class="noprint" style="cursor:help" target="_blank" >❓</a>'
     + '<span blue id="printButton">Print</span>'
     + '<span id="loupe"  blue>🔍︎</span>'
     + '<input id="zoomSlider" type="range" '
     + '  style="width:100px" value="70.0" min="30.0" max="250">'
     + '<br/>'
    document.body.insertBefore(searchDiv,document.body.children[0])
    document.getElementById("idLabelsFilter").addEventListener("click", SF.showSearchForm)
    document.getElementById("idLabelsFilter").addEventListener("click", SF.showSearchForm)
    ZC.slider = document.getElementById("zoomSlider" )
    ZC.slider.addEventListener("input", ZC.onZoom  )
    {
      // https://stackoverflow.com/questions/27116221/prevent-zoom-cross-browser
      const meta = document.createElement('meta')
            meta.setAttribute("name", "viewport")
            meta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no")
      document.head.insertBefore(meta,document.head.children[0])
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
    SE.executeSearch()
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
        for (
            let nodeI = node.parentElement ;
            nodeI != null && nodeI != document.body ;
            nodeI = nodeI.parentElement ) {
          nodeI.setAttribute("textFound", "true")
        }
        NAV.visited.push(node)
        window.lastElementFound = node
    }
    return searchFound
  },
  executeSearch : function(query) {
    const unhideButton = document.getElementById("unhide");
    unhideButton.setAttribute("hidden","");

    if (typeof query != "string") query = "";
    if (!!query) { SF.regexQuery = query; }
    let finalQueryRegex = SF.regexQuery.replace(/ +/g,".*");
    SE.resetTextFoundAttr(false);
    const isEmptyQuery = /^\s*$/.test(finalQueryRegex)

    if (SF.fullWordMode) {
       finalQueryRegex = "\\b"+finalQueryRegex+"\\b"
    }

    if ((!LM.isAnyLabelSelected()) && isEmptyQuery) { return false; /* Nothing to do */ }

    [document.querySelectorAll('div[group]' ),
     document.querySelectorAll('div[groupv]')].forEach(nodeList => {
            nodeList.forEach(node => {
                node.setAttribute("textFound", "false")
            })
        })
    // If some label has been selected then choose only those with matching labels
    document.querySelectorAll('*[zoom]').forEach(node => { 
        node.setAttribute("textFound", "false")
    })
    var innerZoom_l = []
    if (LM.isAnyLabelSelected()) {
        let label_l=Object.keys(LM.state.labelMapSelected)
        innerZoom_l = LM.getDomListForLabelPrefix(label_l[0]);
        for (let idx=0; idx<label_l.length; idx++) {
            innerZoom_l = SF.labelANDMode 
                ? innerZoom_l.intersection( LM.getDomListForLabelPrefix(label_l[idx]) )
                : innerZoom_l.union       ( LM.getDomListForLabelPrefix(label_l[idx]) )
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
    let sMatchText = "<span red>no matches</span>"
    if (numberOfMatches > 0) {
        sMatchText = numberOfMatches + " found"
        document.getElementById("searchForm").setAttribute("resultFound","true")
        setTimeout(()=>{ document.getElementById("searchForm").removeAttribute("resultFound") } , 4500 )
    }
    document.getElementById("matchNumber").innerHTML = sMatchText
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
    const removeNodeList = document.querySelectorAll('*[textFound]');
    if (removeNodeList.length == 0) return; // Nothing to do.
    for (let idx in removeNodeList) {
        if (!removeNodeList[idx].setAttribute) continue; // <- Umm: works fine at page-load, fails in following searchs
        if (bKeepHighlightedSearch && removeNodeList[idx].getAttribute("textFound") == "true") continue;
        removeNodeList[idx].removeAttribute("textFound"); 
    }
  }
}
