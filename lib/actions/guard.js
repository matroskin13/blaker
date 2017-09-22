const pathToRegexp = require('path-to-regexp');

const { createAction, getActionValue, createStep } = require('../helpers');
const { getUrl, getBody } = require('./get');
const { json } = require('./responses');
const { setStatusCode } = require('./set');
const { useV } = require('../validators');

const matchCache = {};

module.exports = {
    match: (method, url) => createAction(cycle => {
        if (cycle.req.method !== method) {
            return createStep(null, true);
        }

        const currentUrl = getActionValue(getUrl(), cycle);
        let router = matchCache[url];

        if (!router) {
            let keys = [];

            matchCache[url] = [ pathToRegexp(url, keys), keys ];
            router = matchCache[url];
        }

        let result = router[0].exec(currentUrl);
        let params = {};

        if (result) {

            for (let j = 0; j < router[1].length; j++) {
                params[router[1][j].name] = result[j + 1];
            }

            cycle.setCache('params', params);
        }

        return createStep(params, !result);
    }),

    matchBody: (params, type = 'json') => createAction(cycle => {
        return Promise
            .resolve(getBody(type)(cycle))
            .then(result => result.value)
            .then(body => {
                const result = useV(params, body);

                if (!result) {
                    getActionValue(json({ success: false, error: 'params is not valid' }), cycle);
                    getActionValue(setStatusCode(400), cycle);
                }

                return createStep(body, !result);
            })
    })
};