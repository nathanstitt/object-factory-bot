const FactoriesMap = new Map();

function getFactory(factoryName) {
    let factory = FactoriesMap.get(factoryName);
    if (!factory) {
        factory = Object.create(null);
        FactoriesMap.set(factoryName, factory);
    }
    return factory;
}

module.exports = { getFactory, FactoriesMap };
