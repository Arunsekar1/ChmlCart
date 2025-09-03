class APIFeatures {
    constructor(query, queryStr) {
        this.query = query
        this.queryStr = queryStr
    }

    search() {
        let keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {};

        this.query.find({ ...keyword })
        return this;
    }

    filter() {
        const queryObj = { ...this.queryStr };
        const excludeFields = ['keyword', 'limit', 'page'];
        excludeFields.forEach(field => delete queryObj[field]);

        const filters = {};

        for (const key in queryObj) {
            const match = key.match(/^(\w+)\[(gte|gt|lte|lt)\]$/);
            if (match) {
                const [_, field, operator] = match;
                const value = Number(queryObj[key]);

                // Only add if it's a valid number
                if (!isNaN(value)) {
                    if (!filters[field]) filters[field] = {};
                    filters[field][`$${operator}`] = value;
                }
            } else {
                filters[key] = queryObj[key];
            }
        }

        console.log('Parsed filter query:', filters);
        this.query = this.query.find(filters);
        return this;
    }

    paginate(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage -1)

        this.query.limit(resPerPage).skip(skip);
        return this;
    }

}

module.exports = APIFeatures;