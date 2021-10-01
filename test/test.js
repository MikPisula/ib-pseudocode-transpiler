const assert = require("assert");
const peggy = require("peggy");
const fs = require("fs");

const read = file => fs.readFileSync(file, "utf8");


describe("parser", function() {
    const parser = peggy.generate(read("grammar.pegjs"));

    describe("parse()", function() {
        it("returns an empty program", function() {
            assert.equal(JSON.stringify(parser.parse("")), JSON.stringify({type:"program",statements:[]}));
        })

        describe("ignores whitespaces", function() {
            const path = "./test/whitespaces";

            let example = parser.parse(read(path + "/example.ib"));
            let tests = fs.readdirSync(path + "/tests");

            tests.forEach(name => {
                let test = parser.parse(read(`${path}/tests/${name}`));
                it(`${name}`, () => assert.deepStrictEqual(test, example));
            })
        })
    })
})