const Sequences = require('./sequences');
const Reference = require('./reference');

const buildPropertyFactory = (Factory, factoryName, proxy, target, propertyName) => (providedValue) => {
    let propertyFactory;
    if ('function' === typeof providedValue) {
        propertyFactory = providedValue;
    } else if (Sequences.identifier === providedValue) {
        propertyFactory = () => Sequences.nextVal(factoryName, propertyName);
    } else if (providedValue instanceof Reference) {
        propertyFactory = ({ object }) =>
            providedValue.build(Factory, { parent: object, parentKey: propertyName });
    } else {
        propertyFactory = () => providedValue;
    }
    target[propertyName] = propertyFactory;
    return proxy;
};

module.exports = buildPropertyFactory;
