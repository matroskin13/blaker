const http = require('http');

const Cycle = require('./cycle');
const actions = require('./actions');
const helpers = require('./helpers');
const { validators } = require('./validators');

exports.getUrl = actions.getUrl;
exports.getHeader = actions.getHeader;
exports.getHeaders = actions.getHeaders;
exports.getQuery = actions.getQuery;
exports.getParams = actions.getParams;
exports.getBody = actions.getBody;
exports.getState = actions.getState;

exports.json = actions.json;
exports.match = actions.match;
exports.matchBody = actions.matchBody;
exports.start = start;

exports.setStatusCode = actions.setStatusCode;
exports.setHeader = actions.setHeader;
exports.redirect = actions.redirect;
exports.send = actions.send;

exports.useGenerator = helpers.useGenerator;
exports.mock = mock;
exports.mockCycle = mockCycle;

exports.v = validators;

function start(...handlers) {
    return port => {
        http.createServer((req, res) => {
            const cycle = new Cycle(req, res);

            const promises = handlers.map(handler => {
                const makeHandler = handler();

                if ('next' in makeHandler) {
                    return () => helpers.useGenerator(makeHandler, null, cycle);
                }
            });

            helpers
                .waterfall(promises)
                .then(() => cycle.finish())
                .catch(e => {
                    console.error(e);

                    cycle.statusCode = 500;
                    cycle.response = e.toString();

                    cycle.finish();
                })
        }).listen(port);
    };
}

function mockCycle({ url = '/', headers = {}, body } = {}) {
    const cycle = new Cycle({ headers, url }, {});

    cycle.setCache('body', body);

    return cycle;
}

function mock(handler) {
    return ({ url, headers, body }) => {
        const cycle = mockCycle({ url, headers, body });

        return helpers
            .useGenerator(handler(), null, cycle)
            .then(() => cycle);
    };
}