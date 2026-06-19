// const Fastify = require('fastify');
import process from 'process';

import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import { fileURLToPath } from 'url';
import type {FastifyRequest, FastifyReply } from 'fastify';

// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);

const workDir = process.cwd();

// // instantiate server framework 
const fastify = Fastify({logger: true});

// Register static file plugin 
// fastify.register(fastifyStatic, {root:  ) ;
const p = path.join( workDir , 'client' , 'public' );
console.log(p)
console.log()
console.log()
console.log()
fastify.register(fastifyStatic, {
    // root directory to serve from
    root:  p, 
    // find entry in directory tree (i.e. root)
    prefix: '/' 
});

// // callack 
async function handler(request: FastifyRequest , reply:FastifyReply)  {

    console.log(request.headers);

    return reply
        
        // .header('Content-Type', 'text/html; charset=utf-8')
        
        .type( 'text/html' )

        .sendFile('index.html')
        
        // .send('<h1>Hello World</h1>')
   
        // .send({name: p})
}

// route 
fastify.get('/', handler);

// run server 
try {
    // IIFE is an async operation  
    ( async () => {
        await fastify.listen({port: 3000})
    })();
} catch(err) {
    
    fastify.log.error(err);

    process.exit();
}