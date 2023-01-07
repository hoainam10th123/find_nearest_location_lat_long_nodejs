const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const authJwt = require('../middlewares/jwt')
const errorHandler = require('../middlewares/error-handler')


class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.api = process.env.API_URL;
        this.conectarBD();
        // theo dung thu tu nay, app moi hanldler error tot
        this.commonMiddleware()      
        this.routes();
        this.errorHandlerMiddlewares();
    }

    async conectarBD() {
        await dbConnection();
    }

    routes() {
        this.app.use(`${this.api}/categories`, require('../routes/category.route'));
        this.app.use(`${this.api}/products`, require('../routes/product.route'));
        this.app.use(`${this.api}/users`, require('../routes/user.route'));
        this.app.use(`${this.api}/geo`, require('../routes/geo.user.route'));
    }

    commonMiddleware(){
        this.app.use(cors());
        this.app.options('*', cors())
        this.app.use(bodyParser.json())
        this.app.use(express.json())
        this.app.use(morgan('tiny'));
        this.app.use(authJwt());// dat truoc cac routes
        //this.app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
    }

    errorHandlerMiddlewares() {               
        this.app.use(errorHandler);// dat cuoi cung
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is run in the port ${this.port}`);
        })
    }
}

module.exports = Server;