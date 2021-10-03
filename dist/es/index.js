import generator from "./generator.js";
import { parse } from "./parser.js";

/**
 * Transpiles IB pseudocode into JavaScript
 *
 * @param {String} [code = ""] - The input code to be transpiled
 *
 * @param {Object} [options = { optimize: true, debug: false, output: x => alert(x), input: () => parseInt(prompt()) }] - Additional options
 * @param {Boolean} [options.optimize=true] - Optimize the transpiled JavaScript
 * @param {Boolean} [options.debug=false] - Print debug messages to console
 *
 * @param {Function} [options.output=x => alert(x)] - Function to be called on `output` statement
 * @param {Function} [options.input=() => parseInt(prompt())] - Function to be called on `input` statement
 *
 * @returns {String}
 */
function transpile(code = "", options = { optimize: true, debug: false, output: x => alert(x), input: () => parseInt(prompt()) }) {
    const __options = {
        optimize: true,
        debug: false,
        output: x => alert(x),
        input: () => parseInt(prompt())
    };
    
    Object.assign(__options, options);
    
    const dg = (...data) => (__options.debug) ? console.log(...data) : undefined;


    let ast = {}, output = "";

    try {
        ast = parse(code);
        dg("abstract syntax tree:\n", ast);
    } catch (e) {
        throw new SyntaxError(`line ${e.location.start.line}, column ${e.location.start.column}: Expected ${e.expected.map(v => {
            switch (v.type) {
                case "other": return v.description;
                case "literal": return `"${v.text}"`;
                case "end": return "EOF";
            }
        }).join(", ")} but found "${e.found}"`);
    }

    try {
        output = generator.generate(ast, __options);
        dg("generated output:\n", output);
    } catch (e) {
        throw new Error("Error while generating code", e);
    }

    if (__options["optimize"]) {
        output = UglifyJS.minify(output).code;
        dg("optimized output:\n", output);
    }

    return output;
}

export default {
    transpile
}