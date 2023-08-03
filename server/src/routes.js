import express from 'express'
import path from 'path'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { errorHandler as queryErrorHandler } from 'querymen'
import { errorHandler as bodyErrorHandler } from 'bodymen'

export default () => {
    const app = express()

    app.use(bodyParser.json({ limit: '10mb', extended: true }))
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
    app.use(compression());
    app.use('/clientConfig', express.static(path.resolve('./build/clientConfig')))
    app.use('/static', express.static(path.resolve('./build/static')))

    app.use(cors({ origin: '*' }))
    

    // if (env === 'production' || env === 'development' || env === 'localhost') {
        app.use(morgan('dev'))
    // }

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(queryErrorHandler())
    app.use(bodyErrorHandler())

    app.route('/*')
    .get(function(req, res) {
        res.sendFile(path.resolve(__dirname + '/../build/index.html'))
    })

    return app
}
