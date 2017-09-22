const { start, matchBody, v, json } = require('blaker');

function* handler() {
    const { id, email } = yield matchBody({
        id: v.number(),
        email: v.string()
    });

    return json({ id, email });
}

start(handler)(3000);