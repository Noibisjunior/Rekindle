"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(schema) {
    return (req, res, next) => {
        const data = ['GET', 'DELETE'].includes(req.method) ? req.query : req.body;
        const result = schema.safeParse(data);
        if (!result.success) {
            return res.status(400).json({ error: 'ValidationError', details: result.error.format() });
        }
        // put parsed data back so controllers can use typed values
        if (['GET', 'DELETE'].includes(req.method))
            req.query = result.data;
        else
            req.body = result.data;
        next();
    };
}
