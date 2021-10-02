const peggy = require("peggy");
const fs = require("fs");

const generator = require("./generator");

const parser = peggy.generate(fs.readFileSync("grammar.pegjs", "utf8"));

let code = `
X = 21

loop L from 0 to X
    Y = Y + L
endloop

output "LETSSSSSSSS GOOOOOOOOOOO"
output Y
`


let ast = parser.parse(code);
let output = generator.generate(ast);

eval(`(${output})();`);