const { fetchAllCategories } = require(`${__dirname}/../models/models.js`);

exports.getAllCategories(req, res, next) => {
    
    fetchAllCategories()
};
