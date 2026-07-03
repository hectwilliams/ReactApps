

// const Fastify = require('fastify');
import process from 'process';
import {exec} from 'child_process';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import type {FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs';
import {parse} from 'csv-parse';
import { createWriteStream, mkdir } from 'node:fs';
// import cors from '@fastify/cors';

interface MonitorInterface {
    services: Service;
}

interface Service {
    monitor: Ports,
    binny: Ports,
    nba: Ports,
}

interface Ports {
    port: number,   
}

async function loadServices() :Promise<MonitorInterface> {
    
    let  asyncRawJson = await fs.promises.readFile('./server/config.json', 'utf-8');
    let json =  JSON.parse(asyncRawJson) as MonitorInterface;
    return json;
}

const fastify = Fastify({logger: true});
const workDir = process.cwd();
const processList = {pid:{}} as Record< string, Record<string, number>>;
const floatingProcess = []

// load json to memory 
const json = await loadServices();  // async on all ops used below

// Register static file plugin 
fastify.register(fastifyStatic, {
    // root directory to serve from
    root:  path.join( workDir , 'client' , 'public' ), 
    // find entry in directory tree (i.e. root)
    prefix: '/' ,
});

// fastify.register(cors, {
//     origin: "http://127.0.0.1:50214", 
//     methods: ['GET', 'POST']
// });

fastify.get('/page=:pg', (request:FastifyRequest, reply: FastifyReply)=> {
     let obj = request.params  as any;

    if (obj === Object.prototype /*strict compare; no coercion*/) {
        obj = Object.assign({}, obj); // coonvert null prototype to normal object 
    }
    reply.redirect(`http://127.0.0.1:50215/page=${(obj.pg as string)}`, 301) ; // greeedy 
});
    
/* returns available services */
fastify.get('/', (req, res)=>{
    res
    .type('text/html')
    .sendFile('index.html')
});

fastify.get('/a', (req, res)=>{

});
fastify.get('/services', (req, res)=>{

    res.send(json);
});

fastify.get('/nbainfo',  (request, response) => {
    // response.send(json['services']['nba'])
});

fastify.get('/binnyinfo',  (request, response) => {
    // response.send(json['services']['binny'])
});

fastify.get('/nbaoff',  (request, response) => {

});

/* Enable webservers */
fastify.post('/power',  async (request, response) => {
    
    let name = (request.body as Record<string, string>)['name']; 
    let enable = (request.body as Record<string, string>)['enable'];
    let filepath;
    
    try {
        if (enable === "1") {
            // turn on server 

            if ((name as string) in  (processList['pid'] as Record<string, number>) ) {
                // server already running
                return; 
            }
            
            filepath = path.join(process.cwd(), './server/run_servers.sh');
            
            exec(` ${filepath} ${name}`, (error, stdout, stderr) =>{ 
    
                if(error) {
                    throw new Error(`${error}`);
                } else {
                    let effPID = parseInt(stdout.trim());
                    floatingProcess.push(effPID); // TODO handle faults / reset and still persists -- needs to be deleted 
                    (processList['pid'] as Record<string, number>)[(name as string)]= effPID as number;
                    response.status(200); 
                }
            });
            
        } else if (enable === "0") {
            // shutdown server 
                        
            let kill_pid :number; 

            filepath = path.join(process.cwd(), './server/stop_servers.sh');
            
            if ( (name as string) in (processList['pid']  as Record<string, number>) ) {
                // kill server already running
                
                
                kill_pid = (processList['pid'] as Record<string, number>)[name as string] as number; 

                exec(` ${filepath} ${name}  ${kill_pid}`, (error, stdout, stderr) =>{ 
                
                    if(error) {
                        throw new Error(`${error}`);
                    } else {
                        // delete server process successful 
                        // console.log(stdout)
                        let obj = processList['pid'] as Record<string, number>;
                        delete obj.nba;
                        response.status(200); 
                    }
                });
            }
        }

    } catch (err) {
        response.send({message: 'host failure'}).status(404);
    }

});


// fastify.post('/binnyon',  async (request, response) => {
//     try {
//         await fs.promises.access('./server2.ts');
//         const child = exec("node server.ts", (error, stdout, stderr) =>{ 
            
//             if(error) {
//                 throw new Error(`${error}`);
//             } else {
//                 response.send({pid: child.pid}); 
//                 let num = child.pid as number; 
//                 (processList['pid'] as Record<string, number>)['nba']= num;
//             }
//         });

//     } catch (err) {
//         response.send({message: 'host failure'}).status(404);
//     }

// });



try {
    // read json 
    const method = {port: json['services']['monitor']['port'] , host : '::' } // ':: bind to listen on both IP4 and IP6 loopback '
    await fastify.listen(method);
} catch(err) {
    fastify.log.error(err);
    process.exit();
}

