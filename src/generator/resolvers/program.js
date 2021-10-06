import runtime from "../runtime.js";

function program(resolvers, ast, options) {
    let r = runtime.replace("/* IO */", `const output = ${options.output.toString()};\nconst input = ${options.input.toString()};`);
    
    return `function run() {\n${r}\n${resolvers.statements(resolvers, ast.statements)}}`;
}

function statements(resolvers, ast) {
    let output = "";

    for (let statement of ast) {
        output += `${resolvers[statement.type](resolvers, statement)}\n`;
    }

    return output;
}

export default {
    program,
    statements
}