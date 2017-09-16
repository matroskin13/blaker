const http = require('http');

const Cycle = require('./cycle');
const actions = require('./actions');
const helpers = require('./helpers');

exports.getUrl = actions.getUrl;
exports.getHeader = actions.getHeader;
exports.getHeaders = actions.getHeaders;
exports.getQuery = actions.getQuery;
exports.getParams = actions.getParams;
exports.getBody = actions.getBody;

exports.json = actions.json;
exports.match = actions.match;
exports.start = start;

exports.setStatusCode = actions.setStatusCode;
exports.setHeader = actions.setHeader;
exports.redirect = actions.redirect;
exports.send = actions.send;

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
