class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // 过滤
  filter() {
    const queryObj = { ...this.queryStr };
    const excludeFields = ['page', 'limit', 'sort', 'fields'];
    excludeFields.forEach((field) => delete queryObj[field]);

    this.query = this.query.find(queryObj);
    return this;
  }

  // 排序
  sort() {
    if (this.queryStr.sort) {
      const sortByFields = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortByFields);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  // 分页
  pagination() {
    const page = this.queryStr.page || 1;
    const limit = this.queryStr.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  // 选择字段
  select() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
}

module.exports = APIFeatures;
