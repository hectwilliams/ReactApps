import process from 'process';
import {exec} from 'child_process';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import type {FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs';
import cors from '@fastify/cors';
 import type { ExecException } from 'node:child_process';

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

function pidExists(serviceName : string, processTable: Record<string, Record<string, number> >) :boolean {
     const table = processTable["pid"] as Record<string, number>;
     const pid: number = table[serviceName] as number;

     console.log(pid);

     if (pid)
        return true;

     return false; 
}

async function startProcess(service_name: string, processTable: Record<string, Record<string, number> >, response: FastifyReply) {
    
    const filepath = path.join(process.cwd(), `./server/run_servers.sh`);
    
    exec(`${filepath} ${service_name}`, (error: ExecException | null, stdout: string) => { 

        if(error) {

            throw new Error(`${error}`);

        } else {

            console.log('state', killProcess);

            console.log('current table', processTable);
            
            console.log('new process', stdout);

            const effPID = parseInt(stdout.trim());
            floatingProcess.push(effPID); // TODO handle faults / reset and still persists -- needs to be deleted 
            (processList['pid'] as Record<string, number>)[(service_name as string)]= effPID as number;
            response.status(200);

        }

    });

// [TypeError: Failed to parse URL from /Users/hectorwilliams/Documents/Dev/repos/ReactApps/App_Bare/nba_app/models/temperature/js_model/model.json] 

// /Users/hectorwilliams/Documents/Dev/repos/ReactApps/App_Bare/nba_app/server/models/temperature/js_model
}

async function killProcess(service_name: string, processTable: Record<string, Record<string, number> >, response: FastifyReply| undefined = undefined) { 
    
    if (!pidExists(service_name, processTable)) {
        return;
    }

    const filepath = path.join(process.cwd(), `./server/stop_servers.sh`);

    const kill_pid = (processList['pid'] as Record<string, number>)[service_name as string] as number; 

    exec(`${filepath} ${service_name}  ${kill_pid}`, (error) =>{ 
        
        if(error) {

            throw new Error(`${error}`);

        } else {
            
            // delete server process successful 

            const obj = processList['pid'] as Record<string, number>;

            service_name = service_name.trim();

            if (service_name.trim() == 'nba') {
                
                delete obj.nba;

            } else if (service_name == 'binny') {
                
                delete obj.binny;
                
            }
            
            if (response)
                response.send({msg: `process deleted ${ Object.entries(kill_pid).toString() } `});
        }
    });


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

fastify.register(cors, {
    origin: "http://127.0.0.1:50214", 
    methods: ['GET', 'POST']
});

fastify.get('/page=:pg', (request:FastifyRequest, reply: FastifyReply)=> {
     let obj = request.params  as Record<string, string>;

    if (obj === Object.prototype /*strict compare; no coercion*/) {
        obj = Object.assign({}, obj); // coonvert null prototype to normal object 
    }
    reply.redirect(`http://127.0.0.1:50215/page=${(obj.pg as string)}`, 301) ; // greeedy 
});
    
/* returns available services */
fastify.get('/', (request, reply)=>{
    reply
    .type('text/html')
    .sendFile('index.html')
});


fastify.get('/services', (request : FastifyRequest, reply: FastifyReply)=>{
    reply.send(json);
});


// fastify.get('/binnyinfo',  (request, response) => {
//     // response.send(json['services']['binny'])
// });

// fastify.get('/nbaoff',  (request, response) => {

// });

/* Enable webservers */
fastify.post('/power',  async (request, response) => {
    
    const name = (request.body as Record<string, string>)['name'] as string; 
    const enable = (request.body as Record<string, string>)['enable'] as string;
    
    try {

        if (enable === "1") {

            if (pidExists(name , processList))  {
                
                console.log(processList)
                console.log(request.body)

                await killProcess(name, processList);

            }
            
            // turn on server 
            console.log('POWER ON MONITOR SERVICE');

            await startProcess(name, processList, response);
            
        } else if (enable === "0") {
            // shutdown server 

            console.log('POWER DOWN MONITOR SERVICE');

            await killProcess(name as string, processList , response);
         
        }

    } catch (err) {
        
        response.send({message: `monitor service failed to power  ${enable? 'enable':'disable'} service\t Err: ${err}}`}).status(404);

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

fastify.get('/binnytemp', async (request:FastifyRequest, reply: FastifyReply)=> {
    reply.redirect(`http://127.0.0.1:50216/binnytemp`, 301) ; // greeedy 

});

fastify.get('/binnyhisto', async (request:FastifyRequest, reply: FastifyReply)=> {

    reply.redirect(`http://127.0.0.1:50216/binnyhisto`, 301) ; // greeedy 

});

fastify.post('/predict',  async (request: FastifyRequest, reply: FastifyReply) => {
    
    // let obj = request.params  as Record<string, string>;

    // if (obj === Object.prototype /*strict compare; no coercion*/) {
    //     obj = Object.assign({}, obj); // coonvert null prototype to normal object 
    // }
    // const data = obj.data as string;

    // return reply.redirect(307, '/new-api-endpo   int');
    
    // console.log(request.body)

    // reply.redirect(`http://127.0.0.1:50216/predict`, 301) ; // greeedy 

    // console.log('hello world');

    
    // console.log(request.body)
    // console.log( request.params )
    // reply.redirect(`http://127.0.0.1:50216/predict=${(obj.data as string)}`, 301) ; 

    // response
    // .send({});

    // Update the body data

     interface PayLoadInterface  {
        data: Array<number>,
    };
    
    // // Forward internally using fastify.inject
    // const response = await fastify.inject({
    //     method: 'POST',
    //     url: `http://127.0.0.1:50216/predict2`,
    //     payload: request.body as PayLoadInterface,
    //     headers: {
    //         host: 'http://127.0.0.1:50216'
    //     }
    // });
    
    // console.log(response.json());
    
    // return reply.send({msg: response.json()})

    // return response
    // if (response)
        // console.log(response.payload)
    // reply
    // // copy 
    // .code(response.statusCode)
    // .headers(response.headers)
    // // new reponse 
    // .send(response.payload);

    // fastify.post(`http://127.0.0.1:50216/predict`,  async (request: FastifyRequest, reply: FastifyReply) => {


    // });

    return reply.redirect(`http://127.0.0.1:50216/predict2`, 307);

    // return reply.status(200);

});


// fastify.get('/page=:pg', (request:FastifyRequest, reply: FastifyReply)=> {
//      let obj = request.params  as Record<string, string>;

//     if (obj === Object.prototype /*strict compare; no coercion*/) {
//         obj = Object.assign({}, obj); // coonvert null prototype to normal object 
//     }
//     reply.redirect(`http://127.0.0.1:50215/page=${(obj.pg as string)}`, 301) ; // greeedy 
// });

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

