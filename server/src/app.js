import http from 'http'
import { env, port, ip, apiRoot } from './config'
import routes from './routes'

const app = routes()


const server = http.createServer(app)

server.listen(port, ip, () => {
    console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
})
export default app
