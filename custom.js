export function preLoad() {
  console.log("debug custom preLoad");
}

export function postLoad() {
  console.log("debug custom postLoad");
  let html = ''
      +'<span style="float:left;">'
      + '<a href="https://github.com/SinglePageBookProject/IT_notes/stargazers" target="_blank">'
      + '<svg style="color:yellow" height="16" class="octicon octicon-star-fill" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path></svg>'
      + '[GitHub]</a>'
      + '</span>'
    
  const div1 = document.getElementById('printButton');
  div1.insertAdjacentHTML('afterend', html)
}


