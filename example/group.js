const { start, json, match } = require('../lib');

function* handler1() {
    yield match('GET', '/one');

    return json({ one: true });
}

function* handler2() {
    yield match('GET', '/two');

    return json({ two: true });
}

function* mainHandler() {
    yield handler1;
    yield handler2;
}

start(mainHandler)(3000);