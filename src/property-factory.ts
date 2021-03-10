import { Sequences } from './sequences'
import { Reference } from './reference'
import { Factory } from './types'

export const propertyFactory = (
    Factory: Factory,
    factoryName: string,
    proxy: any, // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
    target: Record<string, any>, // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
    propertyName: string,
) => (providedValue: any): any => { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
    let factory
    if ('function' === typeof providedValue) {
        factory = providedValue
    } else if (Sequences.identifier === providedValue) {
        factory = () => Sequences.nextVal(factoryName, propertyName)
    } else if (providedValue instanceof Reference) {
        factory = providedValue.factory(Factory, propertyName)
    } else {
        factory = () => providedValue
    }
    target[propertyName] = factory
    return proxy
}

