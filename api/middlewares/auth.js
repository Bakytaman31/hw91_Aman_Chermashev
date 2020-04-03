const User = require('../models/User');

const auth = async (req, res, next) => {
    const authorisationHeader = req.get('Authorization');

    if (!authorisationHeader) {
        return res.status(401).send({error: 'No authorisation header'});
    }

    const [type, token] = authorisationHeader.split(' ');

    if (type !== 'Token' || !token) {
        return res.status(401).send({error: 'Authorisation type wrong or token not present'});
    }

    const user = await User.findOne({token});

    if (!user) {
        return res.status(401).send({error: 'No user with this token'});
    }

    req.user = user;

    next();
};

module.exports = auth;