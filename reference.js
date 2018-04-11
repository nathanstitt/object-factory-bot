class Reference {

    constructor(name, options = {}) {
        this.name = name;
        this.options = options;
        this.isSingle = null == this.options.count;
    }

    factory(factory, propertyName) {
        const func = context => this.create(factory, Object.assign(
            context[propertyName] || {},
            { parent: context, parentProperty: propertyName },
        ));
        func.isReference = true;
        return func;
    }

    buildContext(ctx, index = 0) {
        const context = Object.assign({ }, ctx);
        if (0 === index) {
            Object.assign(context, {
                index: 0,
                siblings: [],
            });
        } else {
            context.index = index;
        }
        let { defaults } = this.options;
        if (defaults) {
            if ('function' === typeof defaults) { defaults = defaults(context); }
            Object.assign(context, defaults, context);
        }
        return context;
    }

    create(factory, ctx) {
        let context = this.buildContext(ctx);
        if (this.isSingle) {
            return factory.create(this.name, context);
        }

        context.siblings.push(factory.create(this.name, context));
        context.parent[ctx.parentKey] = context.siblings;

        let { count } = this.options;
        if ('function' === typeof count) { count = count(context.parent); }

        for (let i = 1; i < count; i += 1) {
            context = this.buildContext(context, i);
            context.siblings[i] = factory.create(this.name, context);
        }
        return context.siblings;
    }

}

module.exports = Reference;
