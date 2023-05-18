import fastify from 'fastify'
import cors from '@fastify/cors'
import { memoriesRoutes } from './routes/memories'
import 'dotenv/config'
import { authroutes } from './routes/auth'
import jwt from '@fastify/jwt'

const app = fastify()

app.register(cors, {
    origin: true,
})

app.register(jwt, {
    secret: 'spacetime',
})

app.register(authroutes)
app.register(memoriesRoutes)

app.listen({
    port: 3333,

}).then(() => {
    console.log('HTTP server runing on http://localhost:3333')
})