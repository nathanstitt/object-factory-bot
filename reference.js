class Reference {

    constructor(name, options = {}) {
        this.name = name;
        this.options = options;
    }

    create(factory, ctx) {
        const child = factory.create(this.name, ctx);
        if (undefined === this.options.count) {
            return child;
        }
        const ary = [child];
        ctx.parent[ctx.parentKey] = ary;
        for (let i = 1; i < this.options.count; i += 1) {
            ary[i] = factory.create(this.name, ctx);
        }
        return ary;
    }

}

module.exports = Reference;
