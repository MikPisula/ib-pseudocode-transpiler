const fs = require("fs");

function program(resolvers, ast, options) {
    let runtime = fs.readFileSync("./src/generator/runtime.js", "utf8");
    runtime = runtime.replace("/* IO */", `const output = ${options.output.toString()};\nconst input = ${options.input.toString()};`);

    return `function run() {\n${runtime}\n${resolvers.statements(resolvers, ast.statements)}}`;
}

function statements(resolvers, ast) {
    let output = "";

    for (let statement of ast) {
        output += `${resolvers[statement.type](resolvers, statement)}\n`;
    }

    return output;
}

module.exports = {
    program,
    statements
}