const { mockCycle, v } = require('../../lib');
const { matchBody } = require('../../lib/actions/guard');
const { BLAKER } = require('../../lib/helpers');

const body = { one: true, two: 1, three: 'value' };

let cycle;

beforeEach(() => {
    cycle = mockCycle({ body });
});

it('has success blaker step', () => {
    const result = matchBody({
        one: v.boolean(),
        two: v.number(),
        three: v.string()
    })(cycle);

    expect(result).toEqual({ value: body, isAbort: false, [BLAKER]: true });
});