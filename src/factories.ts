export const FactoriesMap = new Map<string, object>()

export function getFactory(factoryName: string, autoCreate = true): object {
    const factory = FactoriesMap.get(factoryName)
    if (factory) {
        return factory
    }
    if (!autoCreate) {
        throw new Error(`factory "${factoryName}" has not been created`)
    }
    const newFactory = Object.create(null)
    FactoriesMap.set(factoryName, newFactory)
    return newFactory
}
