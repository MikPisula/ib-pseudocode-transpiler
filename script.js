import transpiler from "./dist/es/index.js";

document.querySelector("#input").value = `
input X
S = 1

loop while X != 0
    S = S * X
    X = X - 1
end loop

output S
`.trim();

document.querySelector("#run").addEventListener("click", () => {
    try {
        let code = transpiler.transpile(document.querySelector("#input").value);
        document.querySelector("#error").value = "";
        eval(`(${code})();`);
    } catch (e) {
        document.querySelector("#error").value = e;
        throw e;
    }
})

// import transpiler from "../../dist/es/index.js";
// import codemirror from "codemirror";
// import mode from "";

// console.log(mode)

// document.querySelector("#input").value = `
// input X
// S = 1

// loop while X != 0
//     S = S * X
//     X = X - 1
// end loop

// output S
// `.trim();

// codemirror.defineSimpleMode("simplemode", {
//     // The start state contains the rules that are initially used
//     start: [
//       // The regex matches the token, the token property contains the type
//       {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},
//       // You can match multiple tokens at once. Note that the captured
//       // groups must span the whole string in this case
//       {regex: /(function)(\s+)([a-z$][\w$]*)/,
//        token: ["keyword", null, "variable-2"]},
//       // Rules are matched in the order in which they appear, so there is
//       // no ambiguity between this one and the one above
//       {regex: /(?:function|var|return|if|for|while|else|do|this)\b/,
//        token: "keyword"},
//       {regex: /true|false|null|undefined/, token: "atom"},
//       {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
//        token: "number"},
//       {regex: /\/\/.*/, token: "comment"},
//       {regex: /\/(?:[^\\]|\\.)*?\//, token: "variable-3"},
//       // A next property will cause the mode to move to a different state
//       {regex: /\/\*/, token: "comment", next: "comment"},
//       {regex: /[-+\/*=<>!]+/, token: "operator"},
//       // indent and dedent properties guide autoindentation
//       {regex: /[\{\[\(]/, indent: true},
//       {regex: /[\}\]\)]/, dedent: true},
//       {regex: /[a-z$][\w$]*/, token: "variable"},
//       // You can embed other modes with the mode property. This rule
//       // causes all code between << and >> to be highlighted with the XML
//       // mode.
//       {regex: /<</, token: "meta", mode: {spec: "xml", end: />>/}}
//     ],
//     // The multi-line comment state.
//     comment: [
//       {regex: /.*?\*\//, token: "comment", next: "start"},
//       {regex: /.*/, token: "comment"}
//     ],
//     // The meta property contains global information about the mode. It
//     // can contain properties like lineComment, which are supported by
//     // all modes, and also directives like dontIndentStates, which are
//     // specific to simple modes.
//     meta: {
//       dontIndentStates: ["comment"],
//       lineComment: "//"
//     }
//   });
  

// let editor = codemirror.fromTextArea(document.querySelector("#input"), {
//     lineNumbers: true,
//     mode: "simplemode"
// });

// console.log(editor);

// document.querySelector("#run").addEventListener("click", () => {
//     try {
//         let code = transpiler.transpile(document.querySelector("#input").value);
//         document.querySelector("#error").value = "";
//         eval(`(${code})();`);
//     } catch (e) {
//         document.querySelector("#error").value = e;
//         throw e;
//     }
// })