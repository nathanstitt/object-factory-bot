import { Factory } from './types'

export interface ReferenceOptions {
    defaults?: object,
    count?: number | ((ctx: object) => number),
}

export interface ReferenceContext {
    parent?: object,
    siblings?: object[],
    parentKey?: string,
    index?: number,
}

export class Reference {

    name: string
    options: ReferenceOptions
    isSingle: boolean
    constructor(name: string, options = {}) {
        this.name = name;
        this.options = options;
        this.isSingle = null == this.options.count;
    }

    factory(factory: Factory, propertyName: string): any {
        const func = (context: object) => this.create(factory, Object.assign(
            context[propertyName] || {},
            { parent: context, parentProperty: propertyName },
        ));
        func.isReference = true;
        return func;
    }

    buildContext(ctx: ReferenceContext, index = 0): ReferenceContext {
        const context: ReferenceContext = Object.assign({}, ctx);
        if (0 === index) {
            Object.assign(context, {
                index: 0,
                siblings: [],
            });
            if (!context.parent) {
                context.parent = Object.create(null)
            }
            const { parent } = context as any;
            parent[ctx.parentKey as string] = context.siblings;
        } else {
            context.index = index;
        }
        let { defaults } = this.options;
        if (defaults) {
            if ('function' === typeof defaults) { defaults = defaults(context.parent, index); }
            Object.assign(context, defaults, context);
        }
        return context;
    }

    create(factory: Factory, ctx: ReferenceContext): any {
        let context = this.buildContext(ctx);
        if (this.isSingle) {
            return factory.create(this.name, context);
        }
        (context.siblings as any).push(factory.create(this.name, context));

        let { count } = this.options;
        if ('function' === typeof count) { count = count(context.parent as any); }

        for (let i = 1; i < (count as number); i += 1) {
            context = this.buildContext(context, i);
            (context.siblings as any)[i] = factory.create(this.name, context);
        }
        return context.siblings;
    }

}
