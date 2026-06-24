// const Fastify = require('fastify');
/*
    This service is called Binny. Binny listens to request 
    and bucketizes the value received. This service can capture
    maximum 10 request every 5 seconds. 

*/

import process from 'process';
import Fastify from 'fastify';

interface SimpleCapture {
    date: string;
    size: number; 
};

interface ClientRequest {
    title: string;
    body: string; 
    userId: number;
    amplitude: number
};

const fastify = Fastify({logger: true /* verbose*/ });
const bins = [] as Array<SimpleCapture>;

/*
    Handles request from  'annoying' client
*/
fastify.post('/binny', (request, reply)=>{
    if (request.body) {
        let body =  request.body as ClientRequest;
        bins.push({date: (new Date).toISOString(), size:body.amplitude});
    }
    reply.status(200);
}); 

/*
    Handles request for bin data 
*/
fastify.get('/binny', (request, reply) =>{
    reply
    .send(bins)
});

// run server 
try {
    let method = {port: 50216, host : '::' } // ':: bind to listen on both IP4 and IP6 loopback '
    await fastify.listen(method);
} catch(err) {
    fastify.log.error(err);
    process.exit();
}

