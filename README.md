# ib-pseudocode-transpiler
[![Github License][license]](https://github.com/MikPisula/ib-pseudocode-transpiler/blob/mainLICENSE)

[license]: https://img.shields.io/github/license/MikPisula/ib-pseudocode-transpiler

This project is still in development. 

## Parser
The grammar is written in accordance with [the approved notation sheet from the IB](https://computersciencewiki.org/images/3/3e/Approved_notation_for_developing_pseudocode.pdf).

### Currently, the following features are recognized and parsed:
- Variables
  - Assignable values
    - [x] Integers
    - [x] Strings
- Comments
  - [x] Single line comments
- `if` statements
  - [ ] Conditions
    - [x] `>`, `<`, `>=`, `<=`, `!=` conditions<sup>[1](#f1)</sup>
    - [ ] `AND`, `OR` logical operator support (partial)<sup>[2](#f2)</sup>
    - [ ] `NOT` logical operator support (partial)<sup>[2](#f2)</sup>
  - [x] Alternate statements
- `loop` statements
  - [ ] `while` loops
  - [ ] `from/to` loops
- I/O
  - [x] `output` statements
  - [ ] `input` statements (im lazy ok?)

---

<sup id="f1">[1]</sup> Instead of using `≠` as the not equal operator `!=` is being used for accessibility

<sup id="f2">[2]</sup> Currently only one `AND` or `OR` operator can be used per condition, and one `NOT` operator per `>`, `<`, `>=`, `<=`, `!=` condition, since condition scoping has not been implemented yet.