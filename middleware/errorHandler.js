const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch(statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({ title: "Validation Error", message: err.message, stackTrace: err.stack });
            break;
        case constants.UNAUTHORIZED:
            res.json({ title: "Unauthorized", message: err.message, stackTrace: err.stack });
            break;
        case constants.FORBIDDEN_ERROR:
            res.json({ title: "Forbidden Error", message: err.message, stackTrace: err.stack });
            break;
        case constants.NOT_FOUND:
            res.json({ title: "Not Found", message: err.message, stackTrace: err.stack });
            break;
        case constants.INTERNAL_SERVER_ERROR:
            res.json({ title: "Internal Server Error", message: err.message, stackTrace: err.stack });
            break;
        default:
            console.log("No error!");
            break;
    }
};

module.exports = errorHandler;