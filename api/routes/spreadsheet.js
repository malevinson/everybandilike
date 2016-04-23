var Router = require('express').Router;
var spreadsheetHandler = require('../handlers/spreadsheet');

module.exports = function(app) {
    var router = new Router();

    router.route('/make')
        .get(spreadsheetHandler.makeSpreadSheet);  
    app.use('/spreadsheet', router);
};