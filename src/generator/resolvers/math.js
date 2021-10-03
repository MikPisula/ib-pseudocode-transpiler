function additiveexpression(resolvers, ast) {
    return `${resolvers.statements(resolvers, ast.terms)}`.split("\n").join("");
}

function multiplicativeexpression(resolvers, ast) {
    return `(${resolvers.statements(resolvers, ast.factors)})`.split("\n").join("");
}

function operation(resolvers, ast) {
    return ` ${ast.operator} ${resolvers[ast.value.type](resolvers, ast.value)}`;
}

export default {
    additiveexpression,
    multiplicativeexpression,
    operation
}