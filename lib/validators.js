const validators = {
    number: f => value => Number(value) === value && (f ? f(value) : true),
    string: f => value => String(value) === value && (f ? f(value) : true),
    boolean: f => value => Boolean(value) === value && (f ? f(value) : true),
    array: f => value => Array.isArray(value) && (f ? f(value) : true),
    custom: f => value => f(value),
    obj: () => param => param !== null && typeof param === 'object'
};

function useV(validators, params) {
    let result = true;

    for (let i in validators) {
        if (validators.hasOwnProperty(i)) {
            let param = validators[i];

            if (param !== null && typeof param === 'object' && !useV(param, params[i])) {
                result = false;
            } else if (!param(params[i])) {
                result = false;
            }
        }
    }

    return result;
}

module.exports = { validators, useV };