import transpiler from "./dist/es/index.js";

document.querySelector("#input").value = `
input X
S = 1

loop while X != 0
    S = S * X
    X = X - 1
end loop

output S
`.trim();

document.querySelector("#run").addEventListener("click", () => {
    try {
        let code = transpiler.transpile(document.querySelector("#input").value);
        document.querySelector("#error").value = "";
        eval(`(${code})();`);
    } catch (e) {
        document.querySelector("#error").value = e;
        throw e;
    }
})