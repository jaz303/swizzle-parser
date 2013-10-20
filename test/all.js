var test = require('tape');
var parse = require('../');

test('parse command', function(t) {

    var ast = parse("  foo  ");

    t.ok(ast.length === 1);
    t.ok(ast[0].type === 'command');
    t.ok(ast[0].command === 'foo');

    t.end();

});

test('parse subshell', function(t) {

    var ast = parse("  $(a b c > d)   ");

    t.ok(ast.length === 1);
    t.ok(ast[0].type === 'subshell');
    t.ok(ast[0].command === 'a b c > d');

    t.end();

});

test('parse pipeline', function(t) {

    var ast = parse("  foo | baz | rawr | $(cat *.txt > ../out.txt)  ");

    t.ok(ast.length === 4);

    t.ok(ast[0].type === 'command');
    t.ok(ast[0].command === 'foo');

    t.ok(ast[1].type === 'command');
    t.ok(ast[1].command === 'baz');
    
    t.ok(ast[2].type === 'command');
    t.ok(ast[2].command === 'rawr');

    t.ok(ast[3].type === 'subshell');
    t.ok(ast[3].command === 'cat *.txt > ../out.txt');

    t.end();

});