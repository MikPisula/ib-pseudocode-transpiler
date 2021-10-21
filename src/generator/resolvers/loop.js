function loopwhile(resolvers, ast) {
    let condition = resolvers[ast.condition.type](resolvers, ast.condition);
    let statements = resolvers.statements(resolvers, ast.statements);

    return `while (${condition}) {\n${statements}}\n`
}

function loopfromto(resolvers, ast) {
    let statements = resolvers.statements(resolvers, ast.statements);

    return `for (__vars["${ast.symbol.name}"] of __range(${resolvers[ast.to.type](resolvers, ast.to)}, ${resolvers[ast.from.type](resolvers, ast.from)})) {\n${statements}}\n`
}

function loopuntil(resolvers, ast) {
    let condition = resolvers[ast.condition.type](resolvers, ast.condition);
    let statements = resolvers.statements(resolvers, ast.statements);

    return `while (!${condition}) {\n${statements}}\n`
}

export default {
    loopwhile,
    loopfromto,
    loopuntil
}