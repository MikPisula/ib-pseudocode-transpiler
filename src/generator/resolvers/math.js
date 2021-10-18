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

export default {
    additiveexpression,
    multiplicativeexpression,
    operation,
    quotient,
    modulo,
    postfixoperation
}