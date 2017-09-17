const { createAction, createStep } = require('../helpers');

module.exports = {
    setHeader: (key, value) => createAction(cycle => {
        cycle.setHeader(key, value);

        return createStep(null, false);
    }),

    setStatusCode: (statusCode) => createAction(cycle => {
        cycle.statusCode = statusCode;

        return createStep(null, false);
    }),

    getState: () => createAction(cycle => {
        return createStep(cycle.getCache('state'), false);
    })
};