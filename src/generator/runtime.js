var __vars = {};
function __var(name) {
    if (__vars[name] === undefined) __vars[name] = 0;
    return __vars[name]
}
function __range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}
