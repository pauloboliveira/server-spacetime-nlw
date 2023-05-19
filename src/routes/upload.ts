import { FastifyInstance } from "fastify";
import {z} from 'zod'
import axios from 'axios'
import { prisma } from "../lib/prisma";
import { randomUUID } from "crypto";

import { extname, resolve } from "path";
import { createWriteStream } from "fs";
import { pipeline } from "node:stream";
import {promisify} from 'node:util'

const pump = promisify(pipeline)

export async function uploadRoutes(app:FastifyInstance) {
 app.post('/upload', async (request, reply) => {
  const upload = await request.file({
   limits: {
    fileSize: 5_242_880,
   }
  })

  if(!upload) {
   return reply.status(400).send()
  }
  
  const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
  
  const isValidFile = mimeTypeRegex.test(upload.mimetype)
  
  if(!isValidFile) {
   return reply.status(400).send()
  }

  const fileId = randomUUID()
  const extension = extname(upload.filename)

  const fileName = fileId.concat(extension)

  const writeStream = createWriteStream(
    resolve(__dirname, '../../uploads/', fileName)
  )

  await pump(upload.file, writeStream)

  const fullUrl = request.protocol.concat('://').concat(request.hostname)
  const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

  return {fileUrl}
 })
}