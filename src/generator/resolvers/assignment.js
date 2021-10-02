function assignment(resolvers, ast) {
    return `__vars["${ast.into.name}"] = ${resolvers[ast.value.type](resolvers, ast.value)}`
}

module.exports = {
    assignment
}