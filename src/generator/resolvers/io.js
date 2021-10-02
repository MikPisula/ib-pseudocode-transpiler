function inputstatement(resolvers, ast) {
    return `__vars["${ast.symbol.name}"] = parseInt(prompt())\n`;
}

function outputstatement(resolvers, ast) {
    return `alert(${resolvers[ast.value.type](resolvers, ast.value)})`;
}

module.exports = {
    inputstatement,
    outputstatement
}