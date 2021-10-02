const fs = require("fs");

function program(resolvers, ast) {
    let runtime = fs.readFileSync("./src/generator/runtime.js");
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