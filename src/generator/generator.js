import res from "./resolvers";

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

export default { generate };