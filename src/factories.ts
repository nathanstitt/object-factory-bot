export const FactoriesMap = new Map<string, object>()

export function getFactory(factoryName: string): object {
    const factory = FactoriesMap.get(factoryName)
    if (factory) {
        return factory
    }
    const newFactory = Object.create(null)
    FactoriesMap.set(factoryName, newFactory)
    return newFactory
}
