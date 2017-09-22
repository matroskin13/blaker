const { getQuery, json, setStatusCode } = require('../../lib');

const mockUsers = [
    { id: 1, name: 'Superman' },
    { id: 2, name: 'Batman' }
];

const getUsers = () => Promise.resolve(mockUsers);

function *getHeroHandler() {
    const { name = 'Superman' } = yield getQuery();

    const hero = yield getUsers().then(users => users.find(user => user.name === name));

    if (!hero) {
        return setStatusCode(404);
    }

    return json({ hero });
}

module.exports = getHeroHandler;
