const assert = require("assert");
const peggy = require("peggy");
const fs = require("fs");

const read = file => fs.readFileSync(file, "utf8");

const transpiler = require("../dist/cjs");

describe("parser", function() {
    const parser = peggy.generate(read("grammar.pegjs"));

    describe("parsing", function() {
        it("returns an empty program", function() {
            assert.equal(JSON.stringify(parser.parse("")), JSON.stringify({type:"program",statements:[]}));
        })

        describe("ignores whitespaces and comments", function() {
            const path = "./test/whitespaces";

            let example = parser.parse(read(path + "/example.ib"));
            let tests = fs.readdirSync(path + "/tests");

            tests.forEach(name => {
                let test = parser.parse(read(`${path}/tests/${name}`));
                it(`${name}`, () => assert.deepStrictEqual(test, example));
            })
        })
    })

    //TODO: tests

    describe("generating", function() {
        describe("mathematical expressions", function() {
            let lines = [];

            let program = transpiler.transpile(`
                X = 23
                Y = 3

                output (10 * 6) + 9
                output (6 * 6) + 24 + Y * 3
                output 6 * 9 + 6 + 9
                output 169 - 150 + 50 - 3 + Y
                output 3 + 2 * 2 + 2 + 6 * 9 + 6
                output X * Y
                output (Y + 20) * 3
            `, { debug: false, output: x => lines.push(x) });

            eval(`(${program})();`);

            lines.map((line, index) => {
                it(`test${index+1}`, () => assert.deepStrictEqual(line, 69));
            })


            lines = [];

            program = transpiler.transpile(`
                X = 23
                Y = 3

                output 2 mod 2
                output (6 * 6) mod 2 + 2
                output (2 * 3) mod (2 * 3)
                output (2 * 3) div (2 * 3)
                output 3 div 4
                output 23 mod 6
            `, { debug: false, output: x => lines.push(x) });

            eval(`(${program})();`);

            it(`modulo & quotient`, () => assert.deepStrictEqual(lines, [0, 2, 0, 1, 0, 5]));
        })

        describe("postfix operations" , function() {
            let lines = [];

            let program = transpiler.transpile(`
                X = 23
                Y = 3

                X++
                output X
                X--
                X--
                Y++
                X--
                output X
                output Y++
                Y--
                outputY
                Z++
                output Z
                output SHITE--
            `, { debug: false, output: x => lines.push(x) });

            eval(`(${program})();`);

            it(`test1`, () => assert.deepStrictEqual(lines, [24, 21, 5, 4, 1, -1]));
        })
    })
})