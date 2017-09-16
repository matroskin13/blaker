const qs = require('querystring');
const url = require('url');

const { createAction, getActionValue, createStep } = require('../helpers');

module.exports = {
    getUrl: () => createAction(cycle => {
        let parsedUrl = cycle.getCache('url');

        if (!parsedUrl) {
            parsedUrl = url.parse(cycle.req.url);

            cycle.setCache('url', parsedUrl);
        }

        return createStep(parsedUrl.pathname, false);
    }),

    getQuery: () => createAction(cycle => {
        let query = cycle.getCache('query');

        if (!query) {
            getActionValue(module.exports.getUrl, cycle); // set url cache

            query = qs.parse(cycle.getCache('url').query);

            cycle.setCache('query', query);
        }

        return qs.parse(cycle.getCache('url').query);
    }),

    getHeader: key => createAction(cycle => createStep(cycle.req.headers[key.toLowerCase()], false)),

    getHeaders: () => createAction(cycle => createStep(cycle.req.headers, false)),

    getParams: () => createAction(cycle => createStep(cycle.getCache('params'), false)),

    getBody: type => createAction(cycle => {
        const cachedBody = cycle.getCache('body');

        if (cachedBody) {
            return createStep(cachedBody, false);
        }

        return new Promise((resolve, reject) => {
            let raw = '';

            cycle.req.on('data', data => raw += data);
            cycle.req.on('end', () => {
                let body;

                switch (type) {
                    case 'json':
                        body = raw ? JSON.parse(raw) : {};
                        break;
                    default:
                        body = raw;
                }

                cycle.setCache('body', body);

                resolve(body);
            });
        }).then(body => createStep(body, false));
    })
};
