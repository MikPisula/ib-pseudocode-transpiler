function ifstatement(resolvers, ast) {
    let condition = resolvers[ast.condition.type](resolvers, ast.condition);
    let consequent = resolvers.statements(resolvers, ast.consequent), alternate = false;
    
    if (ast.alternate !== null) alternate = resolvers.statements(resolvers, ast.alternate);

    return `if (${condition}) {\n${consequent}} ${alternate ? `else {\n${alternate}}` : ""}`;
}
/*
"condition": {
    "type": "condition",
    "token": "=",
    "negation": false,
    "left": {
        "type": "symbol",
        "name": "X"
    },
    "right": {
        "type": "integer",
        "value": 0
    }
},
*/
function condition(resolvers, ast) {
    let token = (ast.token == "=") ? "==" : ast.token;
    let left = resolvers[ast.left.type](resolvers, ast.left),
        right = resolvers[ast.right.type](resolvers, ast.right);

    return `${ast.negation ? "!" : ""}(${left} ${token} ${right})`;
}

module.exports = {
    ifstatement,
    condition
}