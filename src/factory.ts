import { IDENTIFIER as sequence, Sequences } from './sequences'
import { Reference, ReferenceOptions } from './reference'
import { getFactory } from './factories'
import { propertyFactory } from './property-factory'
import { Factory as FactoryI } from './types'

const Factory: FactoryI = {

    defaults: Object.create(null),

    sequence,

    resetSequences(): void {
        Sequences.clear()
    },

    reference(name: string, options: ReferenceOptions = {}): Reference {
        return new Reference(name, options)
    },

    define(factoryName: string): any {
        const factory = getFactory(factoryName)
        const proxy: any = new Proxy(factory, {
            get(target: any, propertyName: string) {
                return propertyFactory(Factory, factoryName, proxy, target, propertyName)
            },
        })
        return proxy
    },

    create(factoryName: string, ctx: Record<string, any> = {}): Record<string, any> {
        const object: Record<string, any> = {}
        const defaults = 'function' === typeof Factory.defaults ?
            Factory.defaults(factoryName, ctx) : Factory.defaults
        const context = Object.assign({ object }, defaults, ctx)
        const factory = getFactory(factoryName, false) as Record<string, any>
        Object.keys(factory).forEach((key) => {
            context.key = key
            if (factory[key].isReference || 'undefined' === typeof ctx[key]) {
                object[key] = factory[key](context)
            } else {
                object[key] = ctx[key]
            }
        })
        return object
    },
}

export default Factory
