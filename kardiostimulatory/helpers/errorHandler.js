const {LogicError} = require("../helpers/logicError");

function errorHandler(err, req, res, next) {

    // error je chybou v bus. logice
    if ( err instanceof LogicError ) {
        return res.status(400).json({ message: err.message });
    }
    
    // interní server error
    return res.status(500).json({ message: err.message });
}

module.exports = errorHandler;