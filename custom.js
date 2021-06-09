export function preLoad() {
  console.log("debug custom preLoad");
}

export function postLoad() {
  console.log("debug custom postLoad");
  let html = ''
      +'<image style="height:0; width:0; size:0;" src="http://www.oficina24x7.com/visited/'+escape(document.location)+'" ></image>'
      +'<span style="float:left;">'
      + '<a href="https://github.com/SinglePageBookProject/IT_notes/stargazers" target="_blank">'
//    + '<svg style="stroke: blue; fill:yellow" height="32" viewBox="0 0 16 16" version="1.1" width="40" aria-hidden="true">'
      + '<svg style="stroke: blue; fill:blue  " height="32" viewBox="32 31 448 448" version="1.1" width="40" aria-hidden="true">'

      + '  <path d="M 256 32 C 132.3,32 32,134.9 32,261.7 C 32,363.2 96.2,449.2 185.2,479.6 C 186.6,479.9 187.8,480 189,480 C 197.3,480 200.5,473.9 200.5,468.6 C 200.5,463.1 200.3,448.7 200.2,429.5 C 191.8,431.4 184.3,432.2 177.6,432.2 C 134.5,432.2 124.7,398.7 124.7,398.7 C 114.5,372.2 99.8,365.1 99.8,365.1 C 80.3,351.4 99.7,351 101.2,351 L 101.3,351 C 123.8,353 135.6,374.8 135.6,374.8 C 146.8,394.4 161.8,399.9 175.2,399.9 C 185.7,399.9 195.2,396.5 200.8,393.9 C 202.8,379.1 208.6,369 215,363.2 C 165.3,357.4 113,337.7 113,249.7 C 113,224.6 121.7,204.1 136,188.1 C 133.7,182.3 126,158.9 138.2,127.3 C 138.2,127.3 139.8,126.8 143.2,126.8 C 151.3,126.8 169.6,129.9 199.8,150.9 C 217.7,145.8 236.8,143.3 255.9,143.2 C 274.9,143.3 294.1,145.8 312,150.9 C 342.2,129.9 360.5,126.8 368.6,126.8 C 372,126.8 373.6,127.3 373.6,127.3 C 385.8,158.9 378.1,182.3 375.8,188.1 C 390.1,204.2 398.8,224.7 398.8,249.7 C 398.8,337.9 346.4,357.3 296.5,363 C 304.5,370.1 311.7,384.1 311.7,405.5 C 311.7,436.2 311.4,461 311.4,468.5 C 311.4,473.9 314.5,480 322.8,480 C 324,480 325.4,479.9 326.8,479.6 C 415.9,449.2 480,363.1 480,261.7 C 480,134.9 379.7,32 256,32"/>'
      + '</path>' 
      + '</svg>' 
      + '</a>'
      + '</span>'
    
  const div1 = document.getElementById('printButton');
  div1.insertAdjacentHTML('afterend', html)
}


