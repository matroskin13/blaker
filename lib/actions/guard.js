const pathToRegexp = require('path-to-regexp');

const { createAction, getActionValue, createStep } = require('../helpers');
const { getUrl } = require('./get');

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
    })
};