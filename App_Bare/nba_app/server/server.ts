import process from 'process';
import {exec} from 'child_process';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import type {FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs';
import {parse} from 'csv-parse';
import { createWriteStream, mkdir } from 'node:fs';
import cors from '@fastify/cors';
// import {DB_CONFIG} from '../database/index';
import fastifyPostgres from '@fastify/postgres';

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
interface PlayerFields {
    name: string;
    img: string;
    plots?: Array<Array<number>>

};

async function loadServices() :Promise<MonitorInterface> {
    
    let  asyncRawJson = await fs.promises.readFile('./server/config.json', 'utf-8');
    let json =  JSON.parse(asyncRawJson) as MonitorInterface;
    return json;
}

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

// load json to memory 
const json = await loadServices();  // async on all ops used below

// db constants 
const USER_DB = "htron";
const PASSWORD_DB = "abcd";
const HOST_DB = "localhost";
const PORT_DB = 5432
const DB_NAME = "sport_db";
const DB_URL = `postgresql://${USER_DB}:${PASSWORD_DB}@${HOST_DB}:${PORT_DB}/${DB_NAME}`;  // 'postgres://postgres:password@localhost:5432/postgres'

setDummyPlots(plots);

// Register static file plugin 
fastify.register(fastifyStatic, {
    // root directory to serve from
    root:  path.join( workDir , 'client' , 'public' ), 
    // find entry in directory tree (i.e. root)
    prefix: '/' 
});


// Register database connection 
fastify.register( fastifyPostgres  , {connectionString: DB_URL} );

// register cors 
// fastify.register(cors, {
//     origin: "http://127.0.0.1:50214", 
//     methods: ['GET', 'POST']
// });


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


/* Get player list page  */
fastify.get('/page=:pg', async (request:FastifyRequest, reply: FastifyReply)=> {

    try {

        // connect to localhost's port 5432 (container port(i.e. 5432 mapped to localhost 5432)
        const client = await fastify.pg.connect(); 
        const {rows} = await client.query('SELECT player, tm from nba.players;');
        console.log(rows);
        client.release(); 
    } catch(err) {
        console.log(err);
    }
    
    return reply.status(200);

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
        console.log(players)

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

// /*  Append Log  */
// fastify.put('/log', (request, reply)=>{

//     if(!request.body)
//         return;
    
//     // check log files 
//     Object.values(request.body).forEach((logValues : Array<string>, index: number) =>{
//         if (logValues.length == 0)
//                 return;

//         let effIndex = index + 1; // 1-index
//         let path = `${LOGDIR}/dashboards`;
//         let date = (new Date).toISOString().replace(/[:.]/g, '').replace('T', '_'); // remove  colon and dot, replace T, truncate)   e.g. "2026-06-22T23:03:40.537Z"  --> e.g., "20260622_190000" <year><month><day><hour><min><second>
//         let logFilePath = path + '/' +'D' + date  + 'ID' + effIndex;
//         const logStream = createWriteStream(logFilePath, {flags: 'a', encoding: 'utf-8'});
//         logValues.forEach(lines=> {
//             logStream.write(lines + '\n');
//         });
//     });

// })

try {
    // read json 
    const method = {port: json['services']['nba']['port'] , host : '127.0.0.1' } // ':: bind to listen on both IP4 and IP6 loopback '
    await fastify.listen(method);
} catch(err) {
    fastify.log.error(err);
    process.exit();
}

