const peggy = require("peggy");
const fs = require("fs");

const generator = require("./generator");

const parser = peggy.generate(fs.readFileSync("grammar.pegjs", "utf8"));

let code = `
X = 21

Z = [2, 3, 4]

loop L from 0 to X
    Y = Y + L
endloop

Z[1] = 8

output Z[3]
output Y
`;

let ast = {};
try {
    ast = parser.parse(code);
} catch (e) {
    throw new SyntaxError(`line ${e.location.start.line}, column ${e.location.start.column}: Expected ${e.expected.map(v => {
        switch (v.type) {
            case "other": return v.description;
            case "literal": return `"${v.text}"`;
            case "end": return "EOF";
        }
    }).join(", ")} but found "${e.found}"`);
}
let output = generator.generate(ast);

console.log(output);

eval(`(${output})();`);