// const Fastify = require('fastify');
import process from 'process';
import {exec} from 'child_process';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import { fileURLToPath } from 'url';
import type {FastifyRequest, FastifyReply } from 'fastify';
import {stat} from 'node:fs/promises';
import fs from 'fs';
import {parse} from 'csv-parse';
import { createWriteStream, mkdir } from 'node:fs';

interface Monitor {
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

const fastify = Fastify({logger: true});
const workDir = process.cwd();
let json : Monitor;

// Register static file plugin 
fastify.register(fastifyStatic, {
    // root directory to serve from
    root:  path.join( workDir , 'client' , 'public' ), 
    // find entry in directory tree (i.e. root)
    prefix: '/' 
});

fastify.get('/', (req, res)=>{
    // start child process 
    const child = exec("node -v", (error, stdout, stderr) =>{
        console.log(json)
        if ( !json) {
            return res.code(404);
        } else {
            console.log('STDOUT', stdout);
            console.log(child.pid);
            // get services (exclude monitor)
            let json_tmp = Object.values(json) as Array<string>;
            let out = json_tmp.map((obj)=>{
                return Object.keys(obj);
            })[0]; // notice indexed 
            out = out?.filter((x)=> x != 'monitor');
            // output raw html            
            res
            .type('text/html')
            .send(`<html> <head><head><body> ${JSON.stringify(out)} </body></head></head></html>`);
        }
    });
    
});

fastify.get('/turn_on_nba', (req, res)=>{

    // start child process 
    const child = exec("node -v", (error, stdout, stderr) =>{
        if (error) {
            return res.code(404);
        } else {
            console.log(stdout);
            res.sendFile('./index/player.html');
        }
    });
    console.log(child.pid);
});

try {
    // read json 
    const raw = await fs.promises.readFile('./config.json', 'utf-8');
    json =  JSON.parse(raw) as Monitor;
    const method = {port: json['services']['monitor']['port'] , host : '::' } // ':: bind to listen on both IP4 and IP6 loopback '
    if (method)
        await fastify.listen(method);
    
} catch(err) {
    fastify.log.error(err);
    process.exit();
}

