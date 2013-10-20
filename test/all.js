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

    var ast = parse("  $[a b c > d]   ");

    t.ok(ast.length === 1);
    t.ok(ast[0].type === 'subshell');
    t.ok(ast[0].command === 'a b c > d');

    t.end();

});

test('parse pipeline', function(t) {

    var ast = parse("  foo | baz | rawr | $[cat *.txt > ../out.txt]  ");

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

test('parse switches', function(t) {

    var ast = parse("foo +a -b");

    t.ok(ast[0].args.length === 2);

    t.ok(ast[0].args[0].type === 'switch');
    t.ok(ast[0].args[0].name === 'a');
    t.ok(ast[0].args[0].on === true);

    t.ok(ast[0].args[1].type === 'switch');
    t.ok(ast[0].args[1].name === 'b');
    t.ok(ast[0].args[1].on === false);

    t.end();

});

test('parse bareword args', function(t) {

    var ast = parse("foo jason@localhost.localdomain 123");

    t.ok(ast[0].args.length === 2);

    t.ok(ast[0].args[0].type === 'bare');
    t.ok(ast[0].args[0].text === 'jason@localhost.localdomain');
    
    t.ok(ast[0].args[1].type === 'bare');
    t.ok(ast[0].args[1].text === '123');

    t.end();
    
});

test('parse pair args', function(t) {

    var ast = parse("foo foo:bar baz:a@b.com");

    t.ok(ast[0].args.length === 2);

    t.ok(ast[0].args[0].type === 'pair');
    t.ok(ast[0].args[0].key === 'foo');
    t.ok(ast[0].args[0].value.type === 'bare');
    t.ok(ast[0].args[0].value.text === 'bar');

    t.ok(ast[0].args[1].type === 'pair');
    t.ok(ast[0].args[1].key === 'baz');
    t.ok(ast[0].args[1].value.type === 'bare');
    t.ok(ast[0].args[1].value.text === 'a@b.com');
    
    t.end();
    
});