function symbol(resolvers, ast) {
    return `__var("${ast.name}")`;
}

function integer(resolvers, ast) {
    return `${ast.value}`;
}

function string(resolvers, ast) {
    return `"${ast.value}"`;
}

module.exports = {
    symbol,
    integer,
    string
}