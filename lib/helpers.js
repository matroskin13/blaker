const BLAKER = Symbol();

exports.waterfall = waterfall;
exports.useGenerator = useGenerator;
exports.BLAKER = BLAKER;
exports.createStep = createStep;
exports.createAction = createAction;
exports.getActionValue = getActionValue;

function createStep(value, isAbort) {
    return { [BLAKER]: true, value, isAbort };
}

function createAction(action) {
    action[BLAKER] = true;

    return action;
}

function getActionValue(action, cycle) {
    return action(cycle).value;
}

function waterfall(promises, data) {
    let promise = promises.shift();

    return promise(data).then(data => {
        if (promises.length) {
            return waterfall(promises, data);
        } else {
            return data;
        }
    })
}

function useStepPromise(item, generator, cycle) {
    return item.then(data => {
        if (!data || !data[BLAKER]) {
            return useGenerator(generator, data, cycle);
        }

        if (typeof data === 'function') {
            data = data(cycle);
        }

        if (data.isAbort) {
            return data.value;
        }

        return useGenerator(generator, data.value, cycle);
    });
}

function useGenerator(generator, value, cycle) {
    return Promise.resolve().then(() => {
        let result = generator.next(value);

        if (result.value instanceof Promise) {
            return useStepPromise(result.value, generator, cycle);
        }

        if (typeof result.value === 'function') {
            const nextValue = result.value(cycle);

            if (nextValue instanceof Promise) {
                return useStepPromise(nextValue, generator, cycle);
            }

            if (!nextValue[BLAKER]) {
                return useGenerator(generator, nextValue, cycle);
            }

            if (nextValue.isAbort) {
                return nextValue.value;
            }

            return useGenerator(generator, nextValue.value, cycle);
        }

        if (result.done) {
            return value;
        }

        return useGenerator(generator, result.value, cycle);
    });
}