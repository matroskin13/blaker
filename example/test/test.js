const { mock } = require('blaker');

const handler = require('./handler');

const request = mock(handler);

it('check default name', () => {
    return request({ url: '/?name=Superman' }).then(result => {
        expect(result.statusCode).toBe(200);
        expect(result.response).toBe('{"hero":{"id":1,"name":"Superman"}}');
    });
});

it('check Batman', () => {
    return request({ url: '/?name=Batman' }).then(result => {
        expect(result.statusCode).toBe(200);
        expect(result.response).toBe('{"hero":{"id":2,"name":"Batman"}}');
    });
});

it('check unknown name', () => {
    return request({ url: '/?name=Spider-Man' }).then(result => {
        expect(result.statusCode).toBe(404);
    });
});