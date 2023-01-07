const { expressjwt: jwt } = require("express-jwt");

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return jwt({
        secret,
        algorithms: ['HS256'],
    }).unless({
        path: [
            //{ url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/products(.*)/, methods: ['GET'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'POST', 'PUT'] },
            `${api}/users/login`,
            `${api}/users/register`,
            `${api}/geo/insert`,
            `${api}/geo/nearByUsersExample1`,
            `${api}/geo/nearByUsersExample2`,
        ]
    });
}

module.exports = authJwt;
