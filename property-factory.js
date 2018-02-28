const Sequences = require('./sequences');
const Reference = require('./reference');

const propertyFactory = (Factory, factoryName, proxy, target, propertyName) => (providedValue) => {
    let factory;
    if ('function' === typeof providedValue) {
        factory = providedValue;
    } else if (Sequences.identifier === providedValue) {
        factory = () => Sequences.nextVal(factoryName, propertyName);
    } else if (providedValue instanceof Reference) {
        factory = ({ object, ...context }) =>
            providedValue.create(
                Factory,
                Object.assign(
                    context[propertyName] || {},
                    { parent: object, parentKey: propertyName },
                ),
            );
    } else {
        factory = () => providedValue;
    }
    target[propertyName] = factory;
    return proxy;
};

module.exports = propertyFactory;
