class Reference {

    constructor(name, count = 1) {
        this.name = name;
        this.count = count;
    }

    create(factory, ctx) {
        const child = factory.create(this.name, ctx);
        if (1 === this.count) {
            return child;
        } else {
            const ary = [child];
            ctx.parent[ctx.parentKey] = ary;
            for(let i = 1; i < this.count; i += 1) {
                ary[i] = factory.create(this.name, ctx);
            }
            return ary;
        }
    }

}

module.exports = Reference;
