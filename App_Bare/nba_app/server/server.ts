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

function setDummyPlots(plots: Array<Array<number>>) {
    for (let i = 0;i < 5; i++) {
        plots.push([]);
        let buffer = plots[i] as Array<number>;
        for (let i = 0; i < 10; i++) {
            buffer.push(rrand());
        }
    }
}
const rrand = ()=>{

    return Math.floor(Math.random() * 10) + 1; // 1 to 100 

} 

async function createlogDir() {             
    let effPath = `${LOGDIR}/dashboards`;                                                                                                                                                                                                                                                                                                                                                                        
    try {
        const stats = await fs.promises.stat(effPath);
    } catch(error:any) {
        if (error.code == 'ENOENT') {
            
            const response =  await fs.promises.mkdir( effPath, {recursive: true});
            console.log(response, 'log dir created');
            
        }
    }
}

// import 

interface PlayerFields {
    name: string;
    img: string;
    plots?: Array<Array<number>>

};
const METAADDRESS = '0.0.0.0'; // listen to all ip4 traffic 
const LOCALHOST = '127.0.0.1'; // safe 
const workDir = process.cwd();

// // instantiate server framework 
const fastify = Fastify({logger: true});

const filePath = path.join(process.cwd(), "../", 'nba_app', 'client', 'src', 'static', 'csv', 'nba.csv' );

const CATIMAGE = path.join(process.cwd(), "../", 'nba_app', 'client', 'src', 'static', 'images', 'faces', 'img.png' );

const LOGDIR = path.join(process.cwd(), "../", 'nba_app', 'client', 'src', 'static', 'logs' );

var csvReadStream = fs.createReadStream(filePath) as fs.ReadStream;

const plots : Array<Array<number>> = [];

setDummyPlots(plots);

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
let playerPerPage = 20 as number;

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

/* Get player list page  */
fastify.get('/page=:pg', (request:FastifyRequest, reply: FastifyReply)=> {
    // console.log(request.body);
    // console.log(request.params)
    // const {value} = request.params;

    // clear current stream buffers
    csvReadStream.destroy();

    csvReadStream.close();

    // recreate 
    csvReadStream  = fs.createReadStream(filePath);

    let obj = request.params  as any;

    if (obj === Object.prototype /*strict compare; no coercion*/) {
        obj = Object.assign({}, obj); // coonvert null prototype to normal object 
    }

    let numPlayers = playerPerPage;

    let players : PlayerFields[] = new Array(numPlayers).fill("");

    let players_index = 0;
    
    let pageNumberZeroIndex = parseInt(obj.pg);

    if (pageNumberZeroIndex != 0) {
        // change to zero index
        pageNumberZeroIndex -= 1;
    }

    console.log(players);

    const effectivePageNumber = Math.floor(numberPages)

    const startPos = pageNumberZeroIndex * Math.floor(playerPerPage) ;

    console.log('DEBUG', obj.pg, pageNumberZeroIndex, effectivePageNumber, startPos, players_index, numberPages);
    
    if (pageNumberZeroIndex != effectivePageNumber   ) {

        console.log(pageNumberZeroIndex, effectivePageNumber)
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

        players[players_index] = {name: row.Player, img: CATIMAGE, plots:plots } ;
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

/*  Append Log  */
fastify.put('/log', (request, reply)=>{

    if(!request.body)
        return;
    
    // check log files 
    Object.values(request.body).forEach((logValues : Array<string>, index: number) =>{
        if (logValues.length == 0)
                return;

        let effIndex = index + 1; // 1-index
        let path = `${LOGDIR}/dashboards`;
        let date = (new Date).toISOString().replace(/[:.]/g, '').replace('T', '_'); // remove  colon and dot, replace T, truncate)   e.g. "2026-06-22T23:03:40.537Z"  --> e.g., "20260622_190000" <year><month><day><hour><min><second>
        let logFilePath = path + '/' +'D' + date  + 'ID' + effIndex;
        const logStream = createWriteStream(logFilePath, {flags: 'a', encoding: 'utf-8'});
        logValues.forEach(lines=> {
            logStream.write(lines + '\n');
        });
    });


    try {
        // request.body.array.forEach(element => {
            
        // });
        // if (request.body){

        //     console.log(JSON.parse());

        //     // for(let i =1; i <= request.body.length; i++) {
                
        //     // }
        // }


        reply
            .status(200);

    }catch(err) {
        reply
            .status(404); // cannot access directories to append logs 
    }
    
})
// run server 
try {
    let method = {port: 50215, host : '::' } // ':: bind to listen on both IP4 and IP6 loopback '
    await createlogDir();
    await fastify.listen(method);
} catch(err) {
    fastify.log.error(err);
    process.exit();
}

