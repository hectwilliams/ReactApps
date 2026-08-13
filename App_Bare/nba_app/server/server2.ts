// const Fastify = require('fastify');
/*
    This service is called Binny. Binny listens to request 
    and bucketizes the value received. This service can capture
    maximum 10 request every 5 seconds. 

*/

import process from 'process';
import Fastify from 'fastify';
import type {FastifyRequest, FastifyReply } from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import fastifyPostgres from '@fastify/postgres';
// import * as tf2 from '@tensorflow/tfjs';
import { pathToFileURL } from 'url'; // ESM
import * as tf from  '@tensorflow/tfjs-node';

// import * from  '@tensorflow/tfjs-tfdf'
// import 'node-fetch';
// global.fetch = fetch;

// interface SimpleCapture {import path from 'node:path';

//     date: string;
//     size: number; 
// };

// interface ClientRequest {
//     title: string;
//     body: string; 
//     userId: number;
//     amplitude: number
// };

// const bins = [] as Array<SimpleCapture>;

const fastify = Fastify({logger: true});
const workDir = process.cwd();
// const processList = {pid:{}} as Record< string, Record<string, number>>;
// Register static file plugin 
fastify.register(fastifyStatic, {
    // root directory to serve from
    root:  path.join( workDir , 'client' , 'public' ), 
    // find entry in directory tree (i.e. root)
    prefix: '/' ,
});



/*
    Handles request from  'annoying' client
*/
// fastify.post('/binny', (request: FastifyRequest, reply: FastifyReply)=>{
//     if (request.body) {
//         const body =  request.body as ClientRequest;
//         bins.push({date: (new Date).toISOString(), size:body.amplitude});
//     }
//     reply.status(200);
// }); 



// db constants 
const USER_DB = "htron";
const PASSWORD_DB = "abcd";
const HOST_DB = "localhost";
const PORT_DB = 5432
const DB_NAME = "sport_db";
const DB_URL = `postgresql://${USER_DB}:${PASSWORD_DB}@${HOST_DB}:${PORT_DB}/${DB_NAME}`;  // 'postgres://postgres:password@localhost:5432/postgres'
// Register database connection 
fastify.register( fastifyPostgres  , {connectionString: DB_URL} );
// const table = {} as Record<string, object>;
/*
    Handles request for bin data 
*/
fastify.get('/binnytemp',  async (request: FastifyRequest, reply: FastifyReply) => {
    try 
    {
        const client = await fastify.pg.connect(); 

        // console.log(client, "MAKE REQUEST")
        const result = await client.query(`
            SELECT temp
            FROM binny.temp
            LIMIT 100
        ;`);
        // console.log(client, "REQUEST COMPLETE")
        
        let maxValue = -(2**64);
        let minValue = 2**64;

        const numbers_only =  (result.rows as Array<Record<string, number>>).map(x => {
            
            const faren = (-1.2 * (x.temp as number)  )* 9/5 + 32; // c to farenheit 

            if ( faren > maxValue ) {
                maxValue  = faren;

            }

            if (  faren < minValue   ) {
                minValue  = faren;
            }
            
            return faren;
        
        });
        
        reply
        .send({ data: numbers_only, max: Math.round(Math.max.apply(null, numbers_only)), min: Math.round(Math.min.apply(null, numbers_only) ) } )
        .status(200);

    } catch  {
            
        reply
        .send(401);
    }

});

fastify.get('/binnyhisto', async ( request: FastifyRequest, reply: FastifyReply ) => {
  try 
    {
        const client = await fastify.pg.connect(); 

        // console.log(client, "MAKE REQUEST")

        // if ("histo" in table) {

        //     reply
        //     .send({msg: table['histo']})
        //     .status(200);

        // } else {

            const result = await client.query(`

                WITH 
                
                stats AS (

                    SELECT 
                        MIN(CAST(temp as numeric) ) AS min_val,
                        MAX(CAST(temp as numeric) ) AS max_val, 
                        COUNT(temp) AS N_SAMPLES
                    FROM 
                        binny.temp
                ),
                        
                bucketed_data AS (
                            
                    SELECT
                            
                        CAST(temp as numeric), 
                        
                        WIDTH_BUCKET(CAST(temp as numeric) , stats.min_val, stats.max_val, 100) AS bucket_id,

                        (CAST(temp as numeric)  - stats.min_val )  /  ( (stats.max_val - stats.min_val) + 1e-9)      AS normalized_val 

                        FROM binny.temp, stats
                )
            
                SELECT 
                    bucket_id,
                    COUNT(*) AS record_count,
                    MIN(temp) AS lowest_in_bucket,
                    MAX(temp) AS highest_in_bucket
                FROM 
                bucketed_data
                GROUP BY bucket_id
                ORDER BY bucket_id

            ;`);

            // table['histo'] = result.rows;

            // console.log(client, "REQUEST COMPLETE");

            reply
            .send({msg: result.rows})
            .status(200);

    } catch  {
            
        reply
        .send(401);
    }
});

const getfname = async () : Promise<string> => {
    
        const file_path = path.join(path.join(process.cwd(),'server', 'models',  'temp', 'nonstatic', 'model.json'));
        // const file_path = path.join(path.join(process.cwd(),'server', 'models', 'temp', 'static',  'model.json'));

        return pathToFileURL(file_path).href as string; 
};

fastify.post('/predict2', async ( request: FastifyRequest, reply: FastifyReply ) =>  {
    
    interface Predict2BodyInterface {
        data: number[]
    };

    /* Forecasting limited to vector of 100 numbers  */
    
    try {

        const temperatures = (request.body as Predict2BodyInterface).data;
        // let obj = request.params  as Record<string, string>;

        // if (obj === Object.prototype /*strict compare; no coercion*/) {
            
        //     obj = Object.assign({}, obj); 
        // }

        // console.log(tf.memory());

        const model = await tf.loadGraphModel(await getfname()) ;
        // const tensor_temperatures  = tf.tensor([temperatures]);
        // const outputNodeNames = ['input_layer_13']; // required to compute graph's output node upone request 
        
        // static 
        // const outputNodeNames = ['Identity', 'input_layer_3']; // required to compute graph's output node upone request 
        // const results = await model.execute(  tensor_temperatures , outputNodeNames );
        // const results = await model.executeAsync(  tensor_temperatures  );

        // nonstatic
        const tensor_temperatures  = tf.tensor([temperatures.map( x=> [x])]);

        const outputNodeNames_n = [  'Identity', 'output_0']; // required to compute graph's output node upone request 
        const results =  await model.executeAsync(  tensor_temperatures , outputNodeNames_n );

        if (Array.isArray(results)) {
            
            const data = await (results[0] as tf.Tensor).data();
            const zero = await  tf.tensor([0]).data() ;
            const zero_value =  (zero as Float32Array)[0]  as number
            let data_value =  (data as Float32Array)[0]  as number

            if (data_value <= zero_value) {
                data_value  = zero_value
            } 

            reply.send( { prediction: data_value } );

            model.dispose();
        }

    }  catch(err) {

        console.log(tf.memory());
        console.log("");
        console.log("");
        console.log(err);
        console.log("");
        console.log("");
        // tf.dispose();
        return reply.send({errMessage: "Model error, check subsystem logic. "}).status(401);
    }

});

// run server 
try {
    const method = {port: 50216, host : '::' } // ':: bind to listen on both IP4 and IP6 loopback '
    await fastify.listen(method);
} catch(err) {
    fastify.log.error(err);
    process.exit();
}
