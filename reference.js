class Reference {

    constructor(name, count = 1) {
        this.name = name;
        this.count = count;
    }

    build(factory, ctx) {
        const child = factory.build(this.name, ctx);
        if (1 === this.count) {
            return child;
        } else {
            const ary = [child];
            ctx.parent[ctx.parentKey] = ary;
            for(let i = 1; i < this.count; i += 1) {
                ary[i] = factory.build(this.name, ctx);
            }
            return ary;
        }
    }

}

module.exports = Reference;
