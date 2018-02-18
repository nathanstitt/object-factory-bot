const FACTORIES = new Map();

function getFactory(factoryName) {
    let factory = FACTORIES.get(factoryName);
    if (!factory) {
        factory = Object.create(null);
        FACTORIES.set(factoryName, factory);
    }
    return factory;
}

module.exports = getFactory;
