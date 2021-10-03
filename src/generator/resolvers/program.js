let runtime = `
/* RUNTIME BEGIN */

var __vars = {};
function __var(name, index = null) {
    if (__vars[name] === undefined) __vars[name] = 0;
    if (Array.isArray(__vars[name]) && index !== null) {
        if (__vars[name][index] === undefined) {
            __vars[name][index] = 0;
            return __vars[name][index];
        }
    }

    return __vars[name];
}
function __range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

/* IO */

/* RUNTIME END */
`;

function program(resolvers, ast, options) {
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

export default {
    program,
    statements
}