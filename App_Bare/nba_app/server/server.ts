import process from 'process';
import {exec} from 'child_process';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import type {FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs';
import fastifyPostgres from '@fastify/postgres';
// import cors from '@fastify/cors';
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

function setDummyPlots(plots: Array<Array<number>>) {
    for (let i = 0;i < 5; i++) {
        plots.push([]);
        const buffer = plots[i] as Array<number>;
        for (let i = 0; i < 10; i++) {
            buffer.push(rrand());
        }
    }
}

const rrand = ()=>{
    return Math.floor(Math.random() * 10) + 1; // 1 to 100 
} 


// const METAADDRESS = '0.0.0.0'; // listen to all ip4 traffic 
// const LOCALHOST = '127.0.0.1'; // safe 
const workDir = process.cwd();

// // instantiate server framework 
const fastify = Fastify({logger: true});

const filePath = path.join(process.cwd(), "../", 'nba_app', 'client', 'src', 'static', 'csv', 'nba.csv' );

const CATIMAGE = path.join(process.cwd(), "../", 'nba_app', 'client', 'src', 'static', 'images', 'faces', 'img.png' );

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
    root: [    
        path.join( workDir , 'client' , 'public' ),
        path.join( workDir , 'client' , 'src' )
    ],
    // find entry in directory tree (i.e. root)
    prefix: '/'
});



// Register database connection 
fastify.register( fastifyPostgres  , {connectionString: DB_URL} );


let numberCsvLines: number;
let numberPages: number;
const playerPerPage = 20 as number;

// system call to get number of lines in csv files 
exec(`wc -l ${filePath}`, (err: ExecException |  null, stdout: string, stderr: string) => {
    if (err) {
        console.log('err, child process');
    } else if (stderr){
        console.log('stderr, child process');
    } else {
        const arr =  stdout.trim().split(' ') as Array<string>;
        const s = arr[0] as string;
        const num = parseInt(s, 10) as number;
        numberCsvLines = num;
        numberPages = numberCsvLines / playerPerPage;
    }
});

interface pageInfoInterface {
    npages: number, 
    nlastpage: number, 
    nperpage: number ,
    nsamples: number 
} 

/* Get player list page  */
fastify.get('/page=:pg', async (request:FastifyRequest, reply: FastifyReply)=> {
    
    // console.log(request.url.toString())
    let obj = request.params  as Record<string, string>;
 
    if (obj === Object.prototype /*strict compare; no coercion*/) {
        obj = Object.assign({}, obj); // coonvert null prototype to normal object 
    }

    try {
        // connect to localhost's port 5432 (container port(i.e. 5432 mapped to localhost 5432)
        const client = await fastify.pg.connect(); 
        let page: number = parseInt(obj.pg as string) ;
        let result; 

        if ( page == 0) {
            page = 1;
        }
        
        result = await client.query('SELECT * from nba.info;');
        
        const pageInfo = result.rows[0] as pageInfoInterface;
        
        const startpos  = pageInfo.nperpage * (page - 1) + 1;

        const endpos = (page == pageInfo.npages) ? pageInfo.nsamples * (pageInfo.nperpage * (page-1)) :  pageInfo.nperpage * (page);
        
        // console.log(startpos, endpos, );
        
        result = await client.query(`
            SELECT 
                nba.players2025.player, 
                nba.players2025.tm,
                nba.teams.tmpic,
                nba.plot_pts.pts,
                nba.plot_gamesplayed.played,
                nba.playerimg.img

            FROM nba.players2025 
            LEFT JOIN nba.teams
            ON nba.players2025.tm = nba.teams.tm
            LEFT JOIN nba.plot_pts
            ON nba.players2025.id = nba.plot_pts.player_id
            LEFT JOIN nba.plot_gamesplayed
            ON nba.players2025.id = nba.plot_gamesplayed.player_id
            LEFT JOIN nba.playerimg
            ON nba.players2025.id = nba.playerimg.player_id
            WHERE nba.players2025.id between ${startpos} and ${endpos} 
        ;`);
        
        reply
        .type('application/json')
        .send({
            page: ( page ), 
            start: startpos,  
            numPages: pageInfo.npages,
            players : result.rows, 
            ing: CATIMAGE,
        });

        // console.log(result.rows);

        client.release(); 

    } catch(err) {
        console.log(err);
        reply
        .status(404);
    }
});

fastify.get('/start_history:key', async (request:FastifyRequest, reply: FastifyReply)=> {
    let obj = request.params  as Record<string, string>;

    if (obj === Object.prototype /*strict compare; no coercion*/) {
        obj = Object.assign({}, obj); // coonvert null prototype to normal object 
    }
    
    try {

        const regex = /.+=([a-z0-9]+)&size=([0-9]+)/;

        let s = obj.key as string;
            
        const match = s.match(regex);

        const client = await fastify.pg.connect(); 

        if (match) {

            // aggregate; pull player stats from select numbers of tables. Each table has the same features 
            
            // get player tables tables
            const table_names = await client.query(`
                SELECT 
                    table_name
                FROM 
                    information_schema.tables 
                WHERE 
                    table_name ~ 'players[0-9]+'
                ORDER BY  table_name ASC
            ;`);
            
            // sql selection

            const query_reduction_select = table_names.rows.reduce( ( acc: string, record: Record<string, string>, i: number) => {
                if (i == 0) {
                    acc += `SELECT * FROM nba.${record.table_name}\n`;
                } else {
                    let s = " UNION ALL " +  `SELECT * FROM nba.${record.table_name}\n`;
                    acc += s;
                }
                return acc;
            }, "");
            
            const result = await client.query(`
                
                WITH aggregate AS (
                    ${query_reduction_select}
                )
                
                SELECT *
                FROM aggregate
                WHERE  aggregate.id = 1
                
            ;`);
    
            reply
            .send({ data: result.rows})
            .send(200);

            client.release();
        
        } else {
            throw new Error('server request failed')

        }
        
    }catch(err) {
        
        console.log('error request ', err)
        reply
        .status(404);

    }
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

