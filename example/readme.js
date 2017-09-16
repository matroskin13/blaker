const { start, getUrl, getQuery, match, json } = require('../lib');

function* mainHandler() {
    const { id } = yield match('GET', '/users/:id');

    const url = yield getUrl(); // get current url
    const query = yield getQuery(); // get all query

    return json({ paramId: id, currentUrl: url, requestQuery: query });
}

start(mainHandler)(3000);