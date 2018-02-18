class Reference {
    constructor(name, count = 1) {
        this.name = name;
        this.count = count;
    }
    build(factory) {
        if (1 === this.count) {
            return factory.build(this.name);
        } else {
            return Array.from(
                new Array(this.count),
                (val,index) => factory.build(this.name),
            );
        }
    }
}

module.exports = Reference;
