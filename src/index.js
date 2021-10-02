const peggy = require("peggy");
const fs = require("fs");

const generator = require("./generator");

const parser = peggy.generate(fs.readFileSync("grammar.pegjs", "utf8"));

let code = `
X = 3

if X > 0 then
    output "X > 0"
else
    if X = 0 then
        output "X = 0"
    else
        output "X < 0"
    end if
end if
`


let ast = parser.parse(code);
let output = generator.generate(ast);

console.log("\n\n" + output);