const {
    start,
    json,
    match,
    getUrl,
    getQuery,
    getBody
} = require('blaker');

let heroes = [
    { id: 1, superhero: 'Superman', rating: 10 },
    { id: 2, superhero: 'Batman', rating: 20 },
    { id: 3, superhero: 'Spider-Man', rating: 5 }
];

const getHeroes = () => Promise.resolve(heroes); // for async

function* mainHandler() {
    yield match('GET', '/');

    const url = yield getUrl();
    const { city } = yield getQuery();

    return json({
        title: 'This site is about superheroes.',
        bestSuperhero: city === 'metropolis' ? 'Superman' : 'Batman',
        currentUrl: url
    });
}

function* heroesHandler() {
    yield match('GET', '/heroes');

    const { sortByRating } = yield getQuery();

    let heroes = yield getHeroes();

    if (sortByRating) {
        heroes = heroes.sort((prev, current) => {
            if (current.rating > prev.rating) {
                return 1;
            } else if (current.rating < prev.rating) {
                return -1;
            } else {
                return 1;
            }
        });
    }

    return json({ heroes });
}

function* heroHandler() {
    const { id } = yield match('GET', '/heroes/:id');

    return getHeroes()
        .then(heroes => heroes.find(hero => hero.id === Number(id)))
        .then(hero => json({ hero }));
}

function* addSuperhero() {
    yield match('POST', '/heroes');

    const { name, rating } = yield getBody('json');
    const hero = { id: Math.round(Date.now() / 1000), name, rating };

    heroes.push(hero);

    return json({ hero });
}

start(
    mainHandler,
    heroesHandler,
    heroHandler,
    addSuperhero
)(3000);