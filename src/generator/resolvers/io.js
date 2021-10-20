function inputstatement(resolvers, ast) {
    return `__vars["${ast.symbol.name}"] = input()\n`;
}

function outputstatement(resolvers, ast) {
    return `output([${ast.values.map(v => resolvers[v.type](resolvers, v)).join(", ")}])`;
}

export default {
    inputstatement,
    outputstatement
}