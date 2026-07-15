import process from 'process';
import {exec} from 'child_process';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import type {FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs';
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
    const  asyncRawJson = await fs.promises.readFile('./server/config.json', 'utf-8');
    const json =  JSON.parse(asyncRawJson) as MonitorInterface;
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
     let obj = request.params  as Record<string, string>;

    if (obj === Object.prototype /*strict compare; no coercion*/) {
        obj = Object.assign({}, obj); // coonvert null prototype to normal object 
    }
    reply.redirect(`http://127.0.0.1:50215/page=${(obj.pg as string)}`, 301) ; // greeedy 
});
    
/* returns available services */
fastify.get('/', (req, res)=>{
    req;
    res
    .type('text/html')
    .sendFile('index.html')
});


fastify.get('/services', (req, res)=>{
    req;
    res.send(json);
});


// fastify.get('/binnyinfo',  (request, response) => {
//     // response.send(json['services']['binny'])
// });

// fastify.get('/nbaoff',  (request, response) => {

// });

/* Enable webservers */
fastify.post('/power',  async (request, response) => {
    
    const name = (request.body as Record<string, string>)['name']; 
    const enable = (request.body as Record<string, string>)['enable'];
    let filepath;

    try {
        if (enable === "1") {
            // turn on server 

            if ((name as string) in  (processList['pid'] as Record<string, number>) ) {
                // server already running
                return; 
            }
            
            filepath = path.join(process.cwd(), `./server/run_servers.sh ${name}`);
            
            exec(`${filepath} ${name}`, (error, stdout) =>{ 
    
                if(error) {
                    throw new Error(`${error}`);
                } else {
                    const effPID = parseInt(stdout.trim());
        
                    floatingProcess.push(effPID); // TODO handle faults / reset and still persists -- needs to be deleted 
                    (processList['pid'] as Record<string, number>)[(name as string)]= effPID as number;
                    console.log(processList);
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

                exec(`${filepath} ${name}  ${kill_pid}`, (error) =>{ 
                    
                    if(error) {
                        throw new Error(`${error}`);
                    } else {
                        // delete server process successful 
                        // console.log(stdout)
                        const obj = processList['pid'] as Record<string, number>;
                        delete obj.nba;
                        response.status(200); 
                    }
                });
            }
        }

    } catch (err) {
        
        console.log(err);
        response.send({message: `monitor service failed to power  ${enable? 'enable':'disable'} service`}).status(404);

    }

});

fastify.get('/start_history:key', async (request:FastifyRequest, reply: FastifyReply)=> {
    let obj = request.params  as Record<string, string>;

    if (obj === Object.prototype /*strict compare; no coercion*/) {
        obj = Object.assign({}, obj); // coonvert null prototype to normal object 
    }   

    const s = obj.key as string;
    
    reply.redirect(`http://127.0.0.1:50215/start_history${s}`, 301) ; // greeedy 

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

