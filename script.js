import transpiler from "./dist/es/index.js";
let runs = 0;

_("#input").element.value = `
input X
S = 1

loop while X != 0
    S = S * X
    X = X - 1
end loop

output S
`.trim();

CodeMirror.defineSimpleMode("ib", {
    start: [
      {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},
      {regex: /'(?:[^\\]|\\.)*?(?:'|$)/, token: "string"},

      {regex: /(?:if|while|else|then|end|loop|from|to|output|input)/, token: "keyword"},
      {regex: /(?:AND|NOT|OR)/, token: "atom"},

      {regex: /[0-9]+/, token: "number"},
      {regex: /\/\/.*/, token: "comment"},
      
      {regex: /[-+\/*=<>!]+/, token: "variable-2"},
      {regex: /(?:mod|div)/, token: "variable-2"},
      {regex: /[A-Z_0-9]+/, token: "variable"},
    ],

    meta: {
      lineComment: "//"
    }
  });
  

let editor = CodeMirror.fromTextArea(_("#input")[0], {
    lineNumbers: true,
    mode: "ib"
})


const scroll = () => _("#io")[0].scrollTop = _("#io")[0].scrollHeight;

_("#run")[0].onclick = () => {
    try {
        _(`#output`)[0].innerHTML = "";
        
        let output = transpiler.transpile(editor.getValue(), {
            debug: true,
            output: x => {
                _("#output")[0].innerHTML += `<div class="line"><div class="text">${x.map(v => v.toString()).join("")}</div></div>`;
                scroll();
            },
            input: () => {
                let x = prompt("input:");
                _("#output")[0].innerHTML += `<div class="line in"><div class="text">${x}</div></div>`;
                scroll();

                return parseInt(x);
            }
        });
        
        _("#output")[0].innerHTML += `<div class="line run" id="running"><div class="text">Running...</div></div>`;
        _("#io")[0].scrollTop = _("#io")[0].scrollHeight;
        
        let b = performance.now();
        eval(`(${output})();`);
        let a = performance.now();

        
        let running = document.querySelector("#running");
        console.log(running.children[0]);

        running.children[0].innerText = `Run ${runs++}: Evaluated in ${a - b}ms`;
        running.classList.add("success");
        running.id = "";


    } catch (e) {
        _("#output")[0].innerHTML += `<div class="line error"><div class="text">${e}</div></div>`;
        scroll();
    }
}

window.addEventListener("beforeunload", (e) => {
    editor.save();

    e.preventDefault();
    e.returnValue = "";
});

// editor.on("change", schedule);


//   _("#run").element.onclick = () => {
//     try {
//         let code = transpiler.transpile(editor.value());
//         _("#error").element.value = "";

//         eval(`(${code})();`);
//     } catch (e) {
//         _("#error").element.value = e;
//         throw e;
//     }
// }