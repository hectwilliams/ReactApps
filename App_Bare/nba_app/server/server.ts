// const Fastify = require('fastify');
import process from 'process';
import {exec} from 'child_process';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import { fileURLToPath } from 'url';
import type {FastifyRequest, FastifyReply } from 'fastify';


import fs from 'fs';

import {parse} from 'csv-parse';
import { stderr } from 'node:process';
import { start } from 'node:repl';

// import 

interface PlayerFields {
    name: string;
    img: string;
};

// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);

const workDir = process.cwd();

// // instantiate server framework 
const fastify = Fastify({logger: true});

const filePath = path.join(process.cwd(), "../", 'nba_app', 'client', 'src', 'static', 'csv', 'nba.csv' );

const CATIMAGE = path.join(process.cwd(), "../", 'nba_app', 'client', 'src', 'static', 'images', 'faces', 'img.png' );


var csvReadStream = fs.createReadStream(filePath) as fs.ReadStream;

// Register static file plugin 
fastify.register(fastifyStatic, {
    // root directory to serve from
    root:  path.join( workDir , 'client' , 'public' ), 
    // find entry in directory tree (i.e. root)
    prefix: '/' 
});

// async function handler(request: FastifyRequest , reply:FastifyReply) {}

let numberCsvLines: number;
let numberPages: number;
let playerPerPage = 100 as number;

// system call to get number of lines in csv files 
exec(`wc -l ${filePath}`, (err, stdout, stderr) => {
    if (err) {
        console.log('err, child process');
    } else if (stderr){
        console.log('stderr, child process');
    } else {
        let arr =  stdout.trim().split(' ') as Array<string>;
        let s = arr[0] as string;
        let num = parseInt(s, 10) as number;
        numberCsvLines = num;
        numberPages = numberCsvLines / playerPerPage;
    }
});

// send html/bundle 
fastify.get('/', (request:FastifyRequest, reply:FastifyReply) => {
    // console.log(request.headers);
    return reply
        .type( 'text/html' )
        .sendFile('index.html');
});

// send data to requestor
fastify.get('/page=:pg', (request:FastifyRequest, reply: FastifyReply)=> {
    // console.log(request.body);
    // console.log(request.params)
    // const {value} = request.params;

    // clear current stream buffers
    csvReadStream.destroy();

    csvReadStream.close();

    // recreate 
    csvReadStream  = fs.createReadStream(filePath);
    

    // csvReadStream.resume();
    //  = fs.createReadStream(filePath);
    // if (csvReadStream.pending) {
    // }

    let obj = request.params  as any;

    if (obj === Object.prototype /*strict compare; no coercion*/) {
        obj = Object.assign({}, obj); // coonvert null prototype to normal object 
    }

    let numPlayers = 100;

    let players : PlayerFields[] = new Array(numPlayers).fill("");

    let players_index = 0;
    
    let pageNumberZeroIndex = parseInt(obj.pg);

    if (pageNumberZeroIndex != 0) {
        // change to zero index
        pageNumberZeroIndex -= 1;
    }

    const effectivePageNumber = Math.floor(numberPages)

    const startPos = pageNumberZeroIndex * Math.floor(playerPerPage) ;

    console.log('DEBUG', obj.pg, pageNumberZeroIndex, effectivePageNumber, startPos, players_index, numberPages);
    
    if (pageNumberZeroIndex != effectivePageNumber   ) {
    } else {
        console.log(numberCsvLines);
        numPlayers = numberCsvLines - startPos ;
        console.log(numPlayers);
        players.length = numPlayers;
    }

    csvReadStream
    .pipe(

        parse ({ 
            // delimiter: ',',
            from_line: (startPos + 1),
            to_line: (startPos +1) + numPlayers,
            columns:['Player', 'Tm'], 
            relax_column_count: true,
        }))  /* class instance */
        
    .on('data', ( row )=>{
        if (row.Player == 'Player')
            return;

        players[players_index] = {name: row.Player, img: CATIMAGE} ;
        players_index++;

    })

    .on('end', ()=>{

        // truncate if player list less than number-players-per-list
        players.length = players_index;

        reply
        .type('application/json')
        .send({
            page: ( pageNumberZeroIndex + 1), 
            start: numberPages * (pageNumberZeroIndex), 
            numPages:effectivePageNumber + 1 ,
            players : players, 
            ing: CATIMAGE, 
        });
        
    })

});

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

