var zoomDivDOM
function doCloseZoom() {
  zoomDivDOM.innerHTML = ''; 
  zoomDivDOM.style.display="none";
}
var zoomDivFW = true; // FW Full Width
var zoomDivFH = true; // FW Full Height 
var zoomDivTop = true; 
var zoomDivLft = true; 

var idxZoomDivRule=-1;
var idxXXXsmallRule=-1;
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

var cellFontSize=0.05
var zoomFontSize=1.00
function onZoomOut(){
  if (zoomDivDOM.innerHTML != '') {
    zoomFontSize = zoomFontSize - 0.05
    document.styleSheets[0]['cssRules'][idxZoomDivRule].style['font-size']=zoomFontSize+'rem';
    return;
  }
  cellFontSize=cellFontSize - 0.05
  document.styleSheets[0]['cssRules'][idxXXXsmallRule].style['font-size']=cellFontSize+'rem';
}
function onZoomIn(){
  if (zoomDivDOM.innerHTML != '') {
    zoomFontSize = zoomFontSize + 0.05
    document.styleSheets[0]['cssRules'][idxZoomDivRule].style['font-size']=zoomFontSize+'rem';
    return;
  }
  cellFontSize=cellFontSize + 0.05
  document.styleSheets[0]['cssRules'][idxXXXsmallRule].style['font-size']=cellFontSize+'rem';
}
var _visited=[]
var _visited_idx=-1
function goBack() {
    if(_visited_idx == 0) return
    _visited_idx--
    let e = _visited[_visited_idx]
    doOpenZoom.call(e, e, true);
}
function goForward() {
    if(_visited_idx == _visited.length-1) return
    _visited_idx++
    let e = _visited[_visited_idx]
    doOpenZoom.call(e, e, true);
}
function doOpenZoom(e, isHistoric)      { 
  if (!!!isHistoric) { // Apend new history
    _visited.push(this)
    _visited_idx =_visited.length-1
  }
  let backNumber = _visited_idx;
  let forwNumber = (_visited.length-1)-_visited_idx;
  let backControl = (backNumber>0) ? "<span onClick='goBack   ()' style='color:blue; font-size:2.0rem'>"+backNumber+"⇦</span>" : ""
  let forwControl = (forwNumber>0) ? "<span onClick='goForward()' style='color:blue; font-size:2.0rem'>⇨"+forwNumber+"</span>" : "" 
  zoomDivDOM.innerHTML = 
     "<div style='float:left; font-size:2.0rem; color:blue;' onClick='doCloseZoom()'><span style='border:4px solid blue; background-color:#DDD'>✕</span>(or press 'Esc' to close)<br/></div>" 
   + "<div style='float:left; '>"
   + backControl
   + forwControl
   + "</div><br/>" 

   + this.outerHTML; 
  zoomDivDOM.style.display="block";
  window.zoomDivDOM.scrollTop = 0;
  if (!!e) { e.stopPropagation(); }
  return false;
}

var help = '<h1>HELPMan to the rescue!!!</h1>' 
         + '<h2>Using the content:</h2>' 
         + '<ul>' 
         + '<li> Enter a text and press the "Regex Search" button to highlight cells with matching content.<br/>'
         + '     Browse visually around the highlighted content to see if the context matches with the search.'
         + '</li>' 
         + '<li> <b>double-click</b> or <b>long-press</b> to zoom into highlighted content</b><br/></li>' 
         + '<li> All cells and all "greyed" context can be zoom-in for reading</li>' 
         + '<li> TIP: If just a single search is found it will automatically zoom-in the content.'
         + '     This can be used to create external links to you page that automatically opens the '
         + '     desired cell/content using a link similar to: '
         + '     <a href="https://singlepagebookproject.github.io/IT_notes/DevOps/linux_administration_summary.html?query=port+knock">this link</a>'
         + '</li>' 
         + '</ul>' 
         + '' 
         + '<h2>Editing the content:</h2>' 
         + '<ul>' 
         + '<li>Content is plain html</li>' 
         + '<li> Use <a href="https://github.com/singlepagebookproject/IT_notes/issues">GitHub pull request</a> to request occasional changes.<br/></li>' 
         + '<li> Become a member of <a href="https://github.com/singlepagebookproject/">The Single-Page-Book Project@GitHub</a> to add you own page books.<br/></li>' 
         + '<li> Highly random UUID can be generated <a href="#" onClick="generate_uuidv4()"> clicking here </a>'
         + '<input type=text id="id_uuid_display" size="40rem"/><br/>'
         + 'The UUID can then be placed anywhere and use the URL extra query param ?query=UUID to point to a concrete block of info'
         + '</li>'
         + '(useful for safe internal links)'

         + '<li> Text diagrams are really welcome in this project. Some basic help to create txt diagram follows: '
         + '<pre style="float:none;">'
         + '(Copy&Paste into your favourite editor)              \n'
         + '<b>Common Arrows</b>         <b>Less/Greater-than</b>\n'
         + '← →  ↑ ↓  ⇿           html-friendly replacements     \n'
         + '                      ˂  ˃                           \n'
         + '<b>Boxes</b>                                    <b>Trees</b> \n'
         + '┌─────┬─────┐ ┌───┐  ┌────┐  ┌───┬───┬───┐ ├─ level1.1     \n'
         + '│     │     │ │   │  │    │  │   │   │   │ │  │            \n'
         + '│     │     │ │   │  ├────┤  │   │   │   │ │  ├─ level2.1  \n'
         + '├─────┼─────┤ │   │  │    │  │   │   │   │ │  │   │        \n'
         + '│     │     │ └───┘  ├────┤  │   │   │   │ │  │   └─ level3\n'
         + '│     │     │        │    │  └───┴───┴───┘ │  │            \n'
         + '└─────┴─────┘        └────┘                │  └─ level2.2  \n'
         + '                                           │               \n'
         + '                                           └─ level1.2     \n'
         + '<b>Other useful symbols:</b>                        \n'
         + ' https://en.wikipedia.org/wiki/Arrows_(Unicode_block)  \n'
         + '    0   1   2   3   4   5   6   7   8   9   A   B   C   D   E   F     \n'
         + 'U+219x  ←   ↑   →   ↓   ↔   ↕   ↖   ↗   ↘   ↙   ↚   ↛   ↜   ↝   ↞   ↟ \n'
         + 'U+21Ax  ↠   ↡   ↢   ↣   ↤   ↥   ↦   ↧   ↨   ↩   ↪   ↫   ↬   ↭   ↮   ↯ \n'
         + 'U+21Bx  ↰   ↱   ↲   ↳   ↴   ↵   ↶   ↷   ↸   ↹   ↺   ↻   ↼   ↽   ↾   ↿ \n'
         + 'U+21Cx  ⇀   ⇁   ⇂   ⇃   ⇄   ⇅   ⇆   ⇇   ⇈   ⇉   ⇊   ⇋   ⇌   ⇍   ⇎   ⇏ \n'
         + 'U+21Dx  ⇐   ⇑   ⇒   ⇓   ⇔   ⇕   ⇖   ⇗   ⇘   ⇙   ⇚   ⇛   ⇜   ⇝   ⇞   ⇟ \n'
         + 'U+21Ex  ⇠   ⇡   ⇢   ⇣   ⇤   ⇥   ⇦   ⇧   ⇨   ⇩   ⇪   ⇫   ⇬   ⇭   ⇮   ⇯ \n'
         + 'U+21Fx  ⇰   ⇱   ⇲   ⇳   ⇴   ⇵   ⇶   ⇷   ⇸   ⇹   ⇺   ⇻   ⇼   ⇽   ⇾   ⇿ \n'
         + '\n'
         + '\n'
         + '</pre>'
         + '<br/>'
         + '</li>'
         + '<li><a href="http://asciiflow.com/">Ascii Flow online diagram editor</a> easify txt diagrams</li>'
         + '<li><a href="http://www.figlet.org/">figlet.org</a>: Create large ascii letters</li>'
         + '<li><a href="https://htmleditor.io">htmleditor.io</a> light-weigth online html editor</li>'

         + '<li>HINT: txt editors with block and/or column edit mode (Vim, UltraEdit, gedit, Notepad++, Eclipse, ...) will make your life much easier</li>'
         + '<li>HINT: Vim is the best text editor. Love him and it will love you for the rest of your life!</li>'
         + '</ul>'

   
function doHelp() {
    ctx = {
        outerHTML : help
    }
    doOpenZoom.call(ctx);
}

function doExtraOptions() {
    ctx = {
        outerHTML : getSearchOptions()
    }
    doOpenZoom.call(ctx, false);
}
function onLabelClicked(e) {
    let label = e.value;
//  debugger;
    var newInputQuery;
    if (e.attributes.selected.value == "false") {
        e.attributes.selected.value = "true"
        _labelMapSelected[label] = true
    } else {
        e.attributes.selected.value = "false"
        delete _labelMapSelected[label]
    }
}

function getSearchOptions() {
    if (Object.keys(_labelMap).length == 0) {
        return "No labels found"
    }
    var result = "";
    result += ""
      + "<hr/>\n"
      + "Labels<br/>\n";
    Object.keys(_labelMap).forEach(label_i => {
        result += "<input class='labelButton' selected="+(!!_labelMapSelected[label_i])+" type='button' onClick='onLabelClicked(this, \""+label_i+"\")' value='"+label_i+"' />" ;
    })

    return result;
}

var _labelMap = { /* label : dom_list*/ }
var _labelMapSelected = { /* label : isSelected true|false */ }
function getDomListForLabel(label) {
    if (!!!_labelMap[label]) return [];
    else return _labelMap[label];
}
function createLabelIndex() {
  var labeled_dom_l = document.querySelectorAll('*[label]');
 // debugger
  for (idx1 in labeled_dom_l) {
    var node = labeled_dom_l[idx1]
    if (!node.getAttribute    ) continue
    let csvAttributes = node.getAttribute("label")
    // TODO:(0) Remove whitespaces
    csvAttributes.split(",").forEach( label => {
        let list = getDomListForLabel(label.toLowerCase())
            list.push(node)
        _labelMap[label] = list
    })
  }
  console.dir(_labelMap)
}

function onPageLoaded() {
    let lenseIconSVG=
     ''
    +'<svg id="idLenseIcon" viewBox="0 141 68 103" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >'
    +'  <ellipse style="fill: none; fill-opacity:0; stroke-width: 4; stroke: #0000ff" cx="43.312" cy="165.209" rx="22" ry="22"/>'
    +'  <ellipse style="fill: none; fill-opacity:0; stroke-width: 4; stroke: #0000ff" cx="43.312" cy="165.209" rx="22" ry="22"/>'
    +'</g>'
    +'  <line style="fill: none; fill-opacity:0; stroke-width: 4; stroke: #0000ff" x1="16.138" y1="45.443" x2="410.291" y2="195.409"/>'
    +'  <line style="fill: none; fill-opacity:0; stroke-width: 12; stroke: #0000ff" x1="8.114" y1="235.317" x2="29.243" y2="190.48"/>'
    +'  <path style="fill: none; fill-opacity:0; stroke-width: 4; stroke: #0000ff" d="M 54.448,154.894 A 14.5762,14.5762 0 0 0 28.108,160.286"/>'
    +'</svg>'

    let labelFilterIconSVG=
      ''
    +'<svg id="idLabelsFilter" viewBox="172 -25 81 43" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
    +'  <g>'
    +'    <polygon style="fill: #800080" points="172,-4 182,-14 192,-14 192,-4 182,6 "/>'
    +'    <polygon style="fill: none; fill-opacity:0; stroke-width: 2.35099e-37; stroke: #00ff00" points="172,-4 182,-14 192,-14 192,-4 182,6 "/>'
    +'  </g>'
    +'  <g>'
    +'    <polygon style="fill: #00ff00" points="232,-4 242,-14 252,-14 252,-4 242,6 "/>'
    +'    <polygon style="fill: none; fill-opacity:0; stroke-width: 2.35099e-37; stroke: #00ff00" points="232,-4 242,-14 252,-14 252,-4 242,6 "/>'
    +'  </g>'
    +'  <g>'
    +'    <polygon style="fill: #ff0000" points="200,-4 210,-14 220,-14 220,-4 210,6 "/>'
    +'    <polygon style="fill: none; fill-opacity:0; stroke-width: 2.35099e-37; stroke: #ff0000" points="200,-4 210,-14 220,-14 220,-4 210,6 "/>'
    +'  </g>'
    +'  <g>'
    +'    <g>'
    +'      <ellipse style="fill: none; fill-opacity:0; stroke-width: 2; stroke: #000000" cx="213" cy="-3" rx="17" ry="17"/>'
    +'      <ellipse style="fill: none; fill-opacity:0; stroke-width: 2; stroke: #000000" cx="213" cy="-3" rx="17" ry="17"/>'
    +'    </g>'
    +'    <g>'
    +'      <ellipse style="fill: none; fill-opacity:0; stroke-width: 2; stroke: #000000" cx="213" cy="-3" rx="10" ry="10"/>'
    +'      <ellipse style="fill: none; fill-opacity:0; stroke-width: 2; stroke: #000000" cx="213" cy="-3" rx="10" ry="10"/>'
    +'    </g>'
    +'    <line style="fill: none; fill-opacity:0; stroke-width: 2; stroke: #000000" x1="192" y1="-3" x2="207" y2="-3"/>'
    +'    <line style="fill: none; fill-opacity:0; stroke-width: 2; stroke: #000000" x1="219" y1="-3" x2="233" y2="-3"/>'
    +'    <line style="fill: none; fill-opacity:0; stroke-width: 2; stroke: #000000" x1="213" y1="-10" x2="213" y2="-24"/>'
    +'    <line style="fill: none; fill-opacity:0; stroke-width: 2; stroke: #000000" x1="213" y1="17" x2="213" y2="4"/>'
    +'  </g>'
    +'</svg>'
  var UP = "../"
  var searchDiv = document.createElement('spam');
      searchDiv.innerHTML = 
     '<form action="#" method="" id="search" name="search">'
   + '  <input name="inputQuery" id="inputQuery" type="text" size="30" maxlength="30">'
   +  lenseIconSVG
   + '&nbsp;'
   +  labelFilterIconSVG
   + '  <div style="float:left;">'
   + '  <input id="singleLineOnly" type="checkbox"><code xsmall>single-line</code><br/>'
   + '  <input id="caseSensitive"  type="checkbox"><code xsmall>Case-match</code>'
   + '  </div>'
   + '  &nbsp;<input id="idButtonHelp" type="button" value="?" onClick="doHelp()">'
   + '</form>'
   + '<a href="'+UP+'">[FOLDER UP]</a>&nbsp;'
   + '<a href="https://github.com/singlepagebookproject/IT_notes/issues">[Github pull requests]</a>&nbsp;'
   + '<div id="zoomDiv"></div>'
   + '<div style="position:fixed; right:0.3%; top:0;">'
   + '<b style="font-size:1.5rem" orange><a onclick="onZoomOut()">[-A]</a></b>'
   + '<b style="font-size:1.5rem"       >                                 </b>'
   + '<b style="font-size:2.0rem" orange><a onclick="onZoomIn ()">[A+]</a></b>'
   + '</div>'
   + '<br/>'
  document.body.insertBefore(searchDiv,document.body.children[0])
  document.getElementById("idLenseIcon"   ).addEventListener("click",  function() { highlightSearch() })
  document.getElementById("idLabelsFilter").addEventListener("click",  function() {  doExtraOptions() })
  document.getElementById("search"     ).addEventListener("submit",  function(e) {e.preventDefault(); highlightSearch(); return false })
  

  zoomDivDOM = document.getElementById('zoomDiv')
  document.addEventListener('keyup',
      function(e) {
          if (e.code === "Escape") doCloseZoom(); 
          if (e.code === "F1")     doHelp(); 

      }
  )

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
  nodeList = document.querySelectorAll('*[zoom]')
  for (idx in nodeList) { 
      if (!!! nodeList[idx].innerHTML) continue;
   // COMMENTED: Needs more testings 
   // nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/(http.?:\/\/[^\b]*)\b/,"<a target='_blank' href='$1'>$1</a>")
      // Open new window with pre-recoded search:[[Troubleshooting+restorecon?]]
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(
          /\[\[([^\?]*)\?\]\]/g,
//        "<a href='"+window.location.href.split('?')[0]+"?query=$1'>$1</a>"
          "<a href='#' onClick='highlightSearch(\"$1\",true)'>$1</a>"
        + "<a target='_blank' href='"+window.location.href.split('?')[0]+"?query=$1'>( ⏏ )</a>"
      )
                                                              // @[   http.....  ]
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/@\[(http[^\]]*)\]/g,"<a target='_new' href='$1'> [$1]</a>")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/@\[([^\]]*)\]/g,    "<a               href='$1'> [$1]</a>")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/g\*([^\*\n]*)\*/g, "<b green >  $1 </b>")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/r\*([^\*\n]*)\*/g, "<b red   >  $1 </b>")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/b\*([^\*\n]*)\*/g, "<b blue  >  $1 </b>")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/o\*([^\*\n]*)\*/g, "<b orange>  $1 </b>")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace( /\*([^\*\n]*)\*/g, "<b       > $1 </b>")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace( /[˂]/g, "&lt;")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace( /[˃]/g, "&gt;")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/g\|([^\*\n]*)\|/g, "<span green >  $1 </span>")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/r\|([^\*\n]*)\|/g, "<span red   >  $1 </span>")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/b\|([^\*\n]*)\|/g, "<span blue  >  $1 </span>")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/o\|([^\*\n]*)\|/g, "<span orange>  $1 </span>")   
      // Some utf-8 hand icons do not work properly while editing in vim/terminal
      // but looks much better in the final HTML. Replace icons:
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/☜/g, "👈")   
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/☝/g, "👆")
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/☞/g, "👉")
      nodeList[idx].innerHTML = nodeList[idx].innerHTML.replace(/☟/g, "👇")
  }


  for (idx=0; idx<document.styleSheets[0]['cssRules'].length; idx++){
      if( document.styleSheets[0]['cssRules'][idx].selectorText == "#zoomDiv") {
          idxZoomDivRule=idx;
      }
      if( document.styleSheets[0]['cssRules'][idx].selectorText == "[zoom]") {
          idxXXXsmallRule=idx;
      }
      if( document.styleSheets[0]['cssRules'][idx].selectorText == "[xsmall]"  ) {
          idxXsmallRule=idx;
      }
  }

  createLabelIndex()

  window.QUERY = document.getElementById("inputQuery");
  var query = getParameterByName("query");
  if (!!query) {
    highlightSearch(getParameterByName("query"));
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
function highlightSearch(query) {
  if (typeof query != "string") query = "";
  if (!!query) { QUERY.value = query; }
  var text = QUERY.value.replace(/ +/g,".*");
  var removeNodeList = document.querySelectorAll('*[textFound]');
  if (removeNodeList.length > 0) {
      for (idx in removeNodeList) {
       if (!removeNodeList[idx].setAttribute) continue; // < TODO: Check why it works fine when loading, but fails when doing a second search
       removeNodeList[idx].setAttribute("textFound", "false"); 
    }
  }
  let isAnyLabelSelected = (Object.keys(_labelMapSelected).length > 0)
  let isEmptyQuery = /^\s*$/.test(text)

  if ((!isAnyLabelSelected) && isEmptyQuery) {
      return false; // Nothing to do
  }

  // If some label has been selected then choose only those with matching labels
  // debugger
  if (isAnyLabelSelected) {
      var innerZoom_l = []
      let label_l=Object.keys(_labelMapSelected)
      label_l.forEach( label => {
        if (_labelMap[label]!=undefined) {
          innerZoom_l = innerZoom_l.concat(_labelMap[label])
        }
      })
  } else {
      // By default search inside all zoomable elements
      var innerZoom_l = document.querySelectorAll('*[zoom]')
  }
  var caseSensitive  = document.getElementById("singleLineOnly").checked;
  var singleLineOnly = document.getElementById("caseSensitive").checked;
  var regexFlags = "g";
  if (!caseSensitive) regexFlags += "i";
  if (!singleLineOnly) regexFlags += "m";
  var query = (isEmptyQuery) 
        ? new RegExp(".*")
        : new RegExp("[^=>;](" + text + ")", regexFlags)

  var numberOfMatches = 0
  var searchAndMark = function(node) {
      var htmlContent = (singleLineOnly) 
           ? node.innerHTML 
           : node.innerHTML.replace(/\n/gm, '')
      var searchFound = htmlContent.match(query)
      node.setAttribute("textFound", searchFound?"true":"false")
      if (searchFound) {
          window.lastElementFound = node
      }
      return searchFound
  }
  var foundElement = false
  for (idx2 in innerZoom_l) {
    var node = innerZoom_l[idx2]
    if (node.innerHTML == null) continue
    if (!node.setAttribute    ) continue
    if (searchAndMark(node)) { 
        numberOfMatches++ 
        foundElement = true
    }
  }
  if (numberOfMatches == 1) {
   // doOpenZoom.call(window.lastElementFound, longPress.element);
      doOpenZoom.call(window.lastElementFound, window.lastElementFound);
  }
  return false // avoid event propagation
}


function generate_uuidv4() {
  let UUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  document.getElementById("id_uuid_display").value=UUID;

}
