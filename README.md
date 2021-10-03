# ib-pseudocode-transpiler
[![Node.js CI](https://github.com/MikPisula/ib-pseudocode-transpiler/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/MikPisula/ib-pseudocode-transpiler/actions/workflows/node.js.yml)
[![Github License](https://img.shields.io/github/license/MikPisula/ib-pseudocode-transpiler)](https://github.com/MikPisula/ib-pseudocode-transpiler/blob/main/LICENSE)
![Lines of code](https://img.shields.io/tokei/lines/github/MikPisula/ib-pseudocode-transpiler)

Transpiles IB pseudocode into JavaScript. An early version of the transpiler is available at https://mikpisula.github.io/ib-pseudocode-transpiler.

**Note: This project is at a very early stage.**

## Parser
The grammar is written in accordance with [the approved notation sheet from the IB](https://computersciencewiki.org/images/3/3e/Approved_notation_for_developing_pseudocode.pdf).

### Currently, the following features are recognized and parsed:
- Variables
  - Assignable values
    - [x] Integers
    - [x] Strings
    - [x] Arrays
      - [ ] Elision [^3]
- Comments
  - [x] Single line comments
- `if` statements
  - [ ] Conditions
    - [x] `>`, `<`, `>=`, `<=`, `!=` conditions[^1]
    - [ ] `AND`, `OR` logical operator support (partial)[^2]
    - [ ] `NOT` logical operator support (partial)[^2]
  - [x] Alternate statements
- `loop` statements
  - [x] `while` loops
  - [x] `from/to` loops
- I/O
  - [x] `output` statements
  - [x] `input` statements (im lazy ok?)
- Mathematical Expressions
  - [x] Additive & Multiplicative
  - [ ] Modulo
  - [ ] Quotient

[^1]: Instead of using `≠` as the not equal operator `!=` is being used for accessibility
[^2]: Currently only one `AND` or `OR` operator can be used per condition, and one `NOT` operator per `>`, `<`, `>=`, `<=`, `!=` condition, since condition scoping has not been implemented yet.
[^3]: Ellision is not implemented as it is not part of the spec (at least for now).
