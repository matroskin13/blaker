const { start, json, match, getState } = require('blaker');

function* handler1() {
    yield match('GET', '/one');

    const { user } = yield getState();

    return json({ one: true, user });
}

function* handler2() {
    yield match('GET', '/two');

    const { user } = yield getState();

    return json({ two: true, user });
}

function* getUser() {
    const state = yield getState();

    state.user = { id: 1, name: 'Bruce Wayne' };
}

function* mainHandler() {
    yield getUser;

    yield handler1;
    yield handler2;
}

start(mainHandler)(3000);