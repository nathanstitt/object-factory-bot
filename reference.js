class Reference {

    constructor(name, options = {}) {
        this.name = name;
        this.options = options;
    }

    create(factory, ctx) {
        const context = Object.assign({ index: 0 }, ctx);
        const child = factory.create(this.name, context);
        if (undefined === this.options.count) {
            return child;
        }
        const ary = [child];
        ctx.parent[ctx.parentKey] = ary;
        const count = ('function' === typeof this.options.count) ? this.options.count(context) : this.options.count;

        for (let i = 1; i < count; i += 1) {
            context.index = i;
            ary[i] = factory.create(this.name, context);
        }
        return ary;
    }

}

module.exports = Reference;
