// Usage: router.post('/', validate(schema), controller)
export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        // Format Zod errors into a clean array
        const errors = result.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
        }));

        return res.status(400).json({
            message: errors[0].message,   // First error as the main message
            errors,
        });
    }

    // Attach parsed (coerced + validated) data to req
    req.body = result.data;
    next();
};