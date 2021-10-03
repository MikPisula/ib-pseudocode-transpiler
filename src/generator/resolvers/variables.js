function symbol(resolvers, ast) {
    return `__var("${ast.name}")`;
}

function integer(resolvers, ast) {
    return `${ast.value}`;
}

function string(resolvers, ast) {
    return `"${ast.value}"`;
}

function array(resolvers, ast) {
    let elements = "";

    for (let element of ast.elements) {
        elements += `${resolvers[element.type](resolvers, element)}, `;
    }

    return `[${elements.slice(0, -2)}]`;
}

function arrayaccess(resolvers, ast) {
    return `__var("${ast.symbol.name}", ${resolvers[ast.index.type](resolvers, ast.index)})`;
}

function arrayassignment(resolvers, ast) {
    return `__vars["${ast.symbol.name}"][${resolvers[ast.index.type](resolvers, ast.index)}] = ${resolvers[ast.value.type](resolvers, ast.value)}`;
}


function assignment(resolvers, ast) {
    return `__vars["${ast.into.name}"] = ${resolvers[ast.value.type](resolvers, ast.value)}`;
}


export default {
    symbol,
    integer,
    string,
    array,
    arrayaccess,
    arrayassignment,
    assignment
}