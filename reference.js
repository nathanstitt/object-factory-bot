class Reference {

    constructor(name, options = {}) {
        this.name = name;
        this.options = options;
        this.isSingle = null == this.options.count;
    }

    create(factory, ctx) {
        const context = Object.assign({ }, ctx);
        if (this.isSingle) {
            return factory.create(this.name, context);
        }
        Object.assign(context, {
            index: 0,
            siblings: [],
        });

        context.siblings.push(factory.create(this.name, context));

        ctx.parent[ctx.parentKey] = context.siblings;

        const count = ('function' === typeof this.options.count) ? this.options.count(context.parent) : this.options.count;

        for (let i = 1; i < count; i += 1) {
            context.index = i;
            context.siblings[i] = factory.create(this.name, context);
        }
        return context.siblings;
    }

}

module.exports = Reference;
