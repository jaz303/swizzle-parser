var grammar = [
    "start =",
    "    space? pipeline:pipeline { return pipeline; }",
    "",
    "pipeline =",
    "    ch:chunk '|' space? cons:pipeline { return [ch].concat(cons); }",
    "    / ch:chunk { return [ch]; }",
    "",
    "chunk =",
    "    cmd:command space? { return cmd; }",
    "    / sbsh:subshell space? { return sbsh; }",
    "",
    "command =",
    "    ident:ident space? { return {type: 'command', command: ident}; }",
    "",
    // TODO: should tolerate nested ) and be string-aware
    "subshell =",
    "    '$(' str:[^\)]* ')' { return {type: 'subshell', command: str.join('')}; }",
    "",
    "space =",
    "    [ \\t\\r\\n]+",
    "",
    "ident =",
    "    start:[a-zA-Z_] rest:[a-zA-Z0-9_]* { return start + rest.join(''); }"
].join("\n");

var parser = require('pegjs').buildParser(grammar);

module.exports = function(code) {
    return parser.parse(code);
}
