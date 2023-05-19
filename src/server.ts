import fastify from 'fastify'
import cors from '@fastify/cors'
import { memoriesRoutes } from './routes/memories'
import 'dotenv/config'
import { authroutes } from './routes/auth'
import { uploadRoutes } from './routes/upload'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import { resolve } from 'node:path'

const app = fastify()

app.register(cors, {
    origin: true,
})

app.register(jwt, {
    secret: 'spacetime',
})

app.register(require('@fastify/static'), {
    root: resolve(__dirname, '../uploads'),
    prefix: '/uploads'
})

app.register(multipart)

app.register(authroutes)
app.register(memoriesRoutes)
app.register(uploadRoutes)

app.listen({
    port: 3333,
    host: '0.0.0.0',
}).then(() => {
    console.log('HTTP server runing on http://localhost:3333')
})