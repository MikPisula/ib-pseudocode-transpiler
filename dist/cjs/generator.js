'use strict';

function ifstatement(resolvers, ast) {
    let condition = resolvers[ast.condition.type](resolvers, ast.condition);
    let consequent = resolvers.statements(resolvers, ast.consequent), alternate = false;
    
    if (ast.alternate !== null) alternate = resolvers.statements(resolvers, ast.alternate);

    return `if (${condition}) {\n${consequent}} ${alternate ? `else {\n${alternate}}` : ""}`;
}


function condition(resolvers, ast) {
    let token = (ast.token == "=") ? "==" : ast.token;
    let left = resolvers[ast.left.type](resolvers, ast.left),
        right = resolvers[ast.right.type](resolvers, ast.right);

    return `${ast.negation ? "!(" : ""}${left} ${token} ${right}${ast.negation ? ")" : ""}`;
}

const tokens = { "AND": "&&", "OR": "||" };

function logicalcondition(resolvers, ast) {
    let token = tokens[ast.token];
    let left = resolvers[ast.left.type](resolvers, ast.left),
        right = resolvers[ast.right.type](resolvers, ast.right);

    return `(${left} ${token} ${right})`
}

var _if = {
    ifstatement,
    condition,
    logicalcondition
};

function inputstatement(resolvers, ast) {
    return `__vars["${ast.symbol.name}"] = input()\n`;
}

function outputstatement(resolvers, ast) {
    return `output(${resolvers[ast.value.type](resolvers, ast.value)})`;
}

var io = {
    inputstatement,
    outputstatement
};

function loopwhile(resolvers, ast) {
    let condition = resolvers[ast.condition.type](resolvers, ast.condition);
    let statements = resolvers.statements(resolvers, ast.statements);

    return `while (${condition}) {\n${statements}}\n`
}

function loopfromto(resolvers, ast) {
    let statements = resolvers.statements(resolvers, ast.statements);

    return `for (__vars["${ast.symbol.name}"] of __range(${resolvers[ast.to.type](resolvers, ast.to)}, ${resolvers[ast.from.type](resolvers, ast.from)})) {\n${statements}}\n`
}

var loop = {
    loopwhile,
    loopfromto
};

function additiveexpression(resolvers, ast) {
    return `(${resolvers.statements(resolvers, ast.terms)})`.split("\n").join("");
}

function multiplicativeexpression(resolvers, ast) {
    return `(${resolvers.statements(resolvers, ast.factors)})`.split("\n").join("");
}

function operation(resolvers, ast) {
    return ` ${ast.operator} ${resolvers[ast.value.type](resolvers, ast.value)}`;
}

function quotient(resolvers, ast) {
    return `Math.floor(${resolvers[ast.left.type](resolvers, ast.left)} / ${resolvers[ast.right.type](resolvers, ast.right)})`
}

function modulo(resolvers, ast) {
    return `(${resolvers[ast.left.type](resolvers, ast.left)} % ${resolvers[ast.right.type](resolvers, ast.right)})`
}

function postfixoperation(resolvers, ast) {
    return `__vars["${ast.symbol.name}"] = ${resolvers[ast.symbol.type](resolvers, ast.symbol)} ${ast.operator.slice(0,1)} 1`
}

var math = {
    additiveexpression,
    multiplicativeexpression,
    operation,
    quotient,
    modulo,
    postfixoperation
};

var runtime = "/* RUNTIME BEGIN */\r\n\r\nvar __vars = {};\r\nfunction __var(name, index = null) {\r\n    if (__vars[name] === undefined) __vars[name] = 0;\r\n    if (Array.isArray(__vars[name]) && index !== null) {\r\n        if (__vars[name][index] === undefined) __vars[name][index] = 0;\r\n        return __vars[name][index];\r\n    }\r\n\r\n    return __vars[name];\r\n}\r\nfunction __range(size, startAt = 0) {\r\n    return [...Array(size - startAt).keys()].map(i => i + startAt);\r\n}\r\n\r\n/* IO */\r\n\r\n/* RUNTIME END */";

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

var program$1 = {
    program,
    statements
};

function symbol(resolvers, ast) {
    return `__var("${ast.name}")`;
}

function integer(resolvers, ast) {
    return `${ast.value}`;
}

function string(resolvers, ast) {
    return `"${ast.value}"`;
}

function array(resolvers, ast) {
    let elements = "";

    for (let element of ast.elements) {
        elements += `${resolvers[element.type](resolvers, element)}, `;
    }

    return `[${elements.slice(0, -2)}]`;
}

function arrayaccess(resolvers, ast) {
    return `__var("${ast.symbol.name}", ${resolvers[ast.index.type](resolvers, ast.index)})`;
}

function arrayassignment(resolvers, ast) {
    return `__vars["${ast.symbol.name}"][${resolvers[ast.index.type](resolvers, ast.index)}] = ${resolvers[ast.value.type](resolvers, ast.value)}`;
}


function assignment(resolvers, ast) {
    return `__vars["${ast.into.name}"] = ${resolvers[ast.value.type](resolvers, ast.value)}`;
}


var variables = {
    symbol,
    integer,
    string,
    array,
    arrayaccess,
    arrayassignment,
    assignment
};

var res = {
    if: _if,
    io,
    loop,
    math,
    program: program$1,
    variables
};

const resolvers = {};
for (let r in res) {
    Object.assign(resolvers, res[r]);
}

/**
 * Generates JavaScript
 * 
 * @param {object} ast - An Abstract Syntax Tree
 * @param {object} options - Additional options
 */
function generate(ast, options) {
    return resolvers[ast.type](resolvers, ast, options);
}

var generator = { generate };

module.exports = generator;
