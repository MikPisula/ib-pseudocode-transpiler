const fs = require("fs");

const resolvers = {};

fs.readdirSync("./src/generator/resolvers/").forEach(name => {
    let resolver = require(`./resolvers/${name}`);
    Object.assign(resolvers, resolver);
});

/**
 * Generates JavaScript
 * 
 * @param {object} ast - An Abstract Syntax Tree
 * @param {object} options - Additional options
 */
function generate(ast, options) {
    return resolvers[ast.type](resolvers, ast, options);
}

module.exports = { generate };