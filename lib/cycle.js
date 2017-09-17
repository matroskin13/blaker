class Cycle {
    constructor(req, res) {
        this.req = req;
        this.res = res;

        this.response = 'Not found';
        this.error = null;
        this.statusCode = 404;
        this.headers = {};

        this.cache = {
            state: {}
        };
    }

    getCache(key) {
        return this.cache[key];
    }

    setCache(key, value) {
        this.cache[key] = value;
    }

    setHeader(key, value) {
        this.headers[key] = value;
    }

    setResponse(response) {
        this.response = response;
    }

    setError(err) {
        this.error = err;
    }

    finish() {
        for (let header in this.headers) {
            if (this.headers.hasOwnProperty(header)) {
                this.res.setHeader(header, this.headers[header]);
            }
        }

        this.res.statusCode = this.statusCode;
        this.res.write(this.response);
        this.res.end();
    }
}

module.exports = Cycle;