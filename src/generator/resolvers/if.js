function ifstatement(resolvers, ast) {
    console.log("pog2")
    let condition = resolvers[ast.condition.type](resolvers, ast.condition);
    let consequent = resolvers.statements(resolvers, ast.consequent), alternate = false;
    
    if (ast.alternate !== null) alternate = resolvers.statements(resolvers, ast.alternate);
    let conditional_alternate = ast.conditional_alternate.map(v => ` else ${ifstatement(resolvers, v)}`);


    return `if (${condition}) {\n${consequent}}${conditional_alternate}${alternate ? ` else {\n${alternate}}` : ""}`;
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

export default {
    ifstatement,
    condition,
    logicalcondition
}