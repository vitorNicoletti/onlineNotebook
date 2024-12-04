const jwt = require('jsonwebtoken');

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ content: "Unauthorized" });
    }

    try {
        const secret = process.env.SECRET;
        const decoded = jwt.verify(token, secret); // Decodifica o token

        // Adiciona as informações do token no objeto `req` para uso posterior
        req.user = {
            id: decoded.id,
        };

        next();
    } catch (err) {
        return res.status(401).json({ content: "Unauthorized" });
    }
}

module.exports = checkToken