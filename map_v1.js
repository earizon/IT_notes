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
function doOpenZoom(e)      { 
  zoomDivDOM.innerHTML = 
     "<div style='float:left; font-size:2.0rem; color:blue;' onClick='doCloseZoom()'><span style='border:4px solid blue; background-color:#DDD'>✕</span>(or press 'Esc' to close)<br/></div><br/>" 
   + this.outerHTML; 
  zoomDivDOM.style.display="block";
  window.zoomDivDOM.scrollTop = 0;
  e.stopPropagation();
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

function onPageLoaded() {
  var UP = "../"
  // Append search, zoomDiv, zoom Buttons :
  var searchDiv = document.createElement('spam');
      searchDiv.innerHTML = 
     '<form action="" method="" id="search" name="search">'
   + '  <input name="query" id="query" type="text" size="30" maxlength="30">'
   + '  <input name="searchit" type="button" value="Regex Search" onClick="highlightSearch()">'
   + '  <input id="singleLineOnly" type="checkbox"><code xsmall>single-line</code>'
   + '  <input id="caseSensitive"  type="checkbox"><code xsmall>Case-match</code>'
   + '  &nbsp;<input type="button" value="Please, HELP MeeEeeeEeeee!" bggreen onClick="doHelp()">'
   + '</form>'
   + '<a href="'+UP+'">[FOLDER UP]</a>&nbsp;'
   + '<a href="https://github.com/singlepagebookproject/IT_notes/issues">[Github pull requests]</a>&nbsp;'
   + '<div id="zoomDiv"></div>'
   + '<div style="position:fixed; right:0.3%; top:0; width:auto;">'
   + '<b style="font-size:1.5rem" orange><a onclick="onZoomOut()">[-A]</a></b>'
   + '<b style="font-size:1.5rem"       >                                 </b>'
   + '<b style="font-size:2.0rem" orange><a onclick="onZoomIn ()">[A+]</a></b>'
   + '</div>'
   + '<br/>'
  document.body.insertBefore(searchDiv,document.body.children[0]);

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
          "<a href='"+window.location.href.split('?')[0]+"?query=$1'>$1</a>"
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

  var query = getParameterByName("query");
  if (query != null) {
    document.getElementById("query").value = getParameterByName("query");
    highlightSearch();
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
function highlightSearch() {
  var text = document.getElementById("query").value.replace(/ +/g,".*");

  var removeNodeList = document.querySelectorAll('*[textFound]');
  if (removeNodeList.length > 0) {
      for (idx in removeNodeList) {
       if (!removeNodeList[idx].setAttribute) continue; // < TODO: Check why it works fine when loading, but fails when doing a second search
       removeNodeList[idx].setAttribute("textFound", "false"); 
    }
  }

  if (/^\s*$/.test(text) /*empty string -> reset and return */) { return; }

  
  var caseSensitive  = document.getElementById("singleLineOnly").checked;
  var singleLineOnly = document.getElementById("caseSensitive").checked;
  var regexFlags = "g";
  if (!caseSensitive) regexFlags += "i";
  if (!singleLineOnly) regexFlags += "m";
  var query = new RegExp("[^=>](" + text + ")", regexFlags);

//var matrix = [
//   document.querySelectorAll('td'),
//   document.querySelectorAll('*[zoom]') ]
  var td_matrix = document.querySelectorAll('td')

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
  for (td_idx in td_matrix) { 
    var td = td_matrix[td_idx];
    if (td.querySelectorAll == undefined) continue;
    var innerZoom_l = td.querySelectorAll('*[zoom]')
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
    if (!foundElement) {
      if (searchAndMark(td)) { 
          numberOfMatches++ 
          foundElement = true
      }
    }

  }
  if (numberOfMatches == 1) {
      doOpenZoom.call(window.lastElementFound, longPress.element);
  }
}


function generate_uuidv4() {
  let UUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  document.getElementById("id_uuid_display").value=UUID;

}

