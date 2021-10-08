import transpiler from "./dist/es/index.js";

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


let old = "",
    parseTimer = null;

function schedule() {
    console.log("schedule")
    if (editor.getValue() == old) return 

    if (parseTimer !== null) {
        clearTimeout(parseTimer);
        parseTimer = null;
    }

    parseTimer = setTimeout(() => {
        old = editor.getValue();

        try {
            let output = transpiler.transpile(old, {
                debug: true,
                output: x => {
                    _("#output")[0].innerHTML += `<div class="line"><div class="text">${x}</div></div>`;
                    _("#io")[0].scrollTop = _("#io")[0].scrollHeight;
                },
                input: () => {
                    let x = prompt();
                    _("#output")[0].innerHTML += `<div class="line in"><div class="text">${x}</div></div>`;
                    _("#io")[0].scrollTop = _("#io")[0].scrollHeight;

                    return parseInt(x);
                }
            });
            eval(`(${output})();`);

        } catch (e) {
            throw e;
        }


        parseTimer = null;
    }, 500);
}

const scroll = () => _("#io")[0].scrollTop = _("#io")[0].scrollHeight;

_("#run")[0].onclick = () => {
    try {
        let output = transpiler.transpile(editor.getValue(), {
            debug: true,
            output: x => {
                _("#output")[0].innerHTML += `<div class="line"><div class="text">${x}</div></div>`;
                scroll();
            },
            input: () => {
                let x = prompt("input:");
                _("#output")[0].innerHTML += `<div class="line in"><div class="text">${x}</div></div>`;
                scroll();

                return parseInt(x);
            }
        });
        eval(`(${output})();`);

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