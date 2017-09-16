const { createAction, createStep } = require('../helpers');

module.exports = {
    json: data => createAction(cycle => {
        cycle.statusCode = 200;
        cycle.setHeader('Content-Type', 'application/json');
        cycle.setResponse(JSON.stringify(data));

        return createStep(null, true);
    }),

    send: data => createAction(cycle => {
        cycle.statusCode = 200;
        cycle.setResponse(data);

        return createStep(null, true);
    }),

    redirect: url => createAction(cycle => {
        cycle.statusCode = 302;
        cycle.setHeader('Location', url);

        return createStep(null, true);
    })
};