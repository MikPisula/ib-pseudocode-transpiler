function inputstatement(resolvers, ast) {
    return `__vars["${ast.symbol.name}"] = input()\n`;
}

function outputstatement(resolvers, ast) {
    return `output(${resolvers[ast.value.type](resolvers, ast.value)})`;
}

export default {
    inputstatement,
    outputstatement
}