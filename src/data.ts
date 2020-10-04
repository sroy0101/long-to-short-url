import pg from 'pg';
import { pgConnect } from './config'

interface Row {
    shorturl : string;
    longurl: string;
}

var connectionString = process.env.DATABASE_URL || `postgres://${pgConnect.userName}:${pgConnect.password}${pgConnect.url}/${pgConnect.dbName}`;

export const getLongUrlByShort= async (shortUrl: string) => {    
    if(!shortUrl) throw new Error('getLongUrlByShort: Invalid parameter');

    let rows: Row[] = [];
    let client = new pg.Client(connectionString);
    let res : any;

    await client.connect();
    try {
        res = await client.query('select longurl from urls where shorturl=$1', [shortUrl]);
    } catch (error)  {
        console.log(error);

    }
    if(res) {
        res.rows.forEach(row => {
            rows.push(row);
        });
    }
    await client.end();
    return (rows.length > 0 ? rows[0].longurl : null);
}

export const getShortUrlByLong = async (longUrl: string) => {    
    if(!longUrl) throw new Error('getShortUrlByLong: Invalid parameter');

    let rows: Row[] = [];
    let client = new pg.Client(connectionString);
    let res : any;

    await client.connect();
    try {
        res = await client.query('select shorturl from urls where longUrl=$1', [longUrl]);
    } catch (error)  {
        console.log(error);

    }
    if(res) {
        res.rows.forEach(row => {
            rows.push(row);
        });
    }
    await client.end();
    return (rows.length > 0 ? rows[0].shorturl : null);
}

export const saveUrls = async (longUrl: string, shortUrl: string) => {
    if(!shortUrl || !longUrl) throw new Error('saveLongUrl(): Invalid Parameter(s)');
    let id : number = 0;
    let res : any;
    let client = new pg.Client(connectionString);
    await client.connect();
    try {
        res = await client.query('Insert Into "urls" (longurl, shorturl) Values ($1, $2) returning id', [longUrl, shortUrl]);
    } catch (error) {
        console.log (error);
    }    
    await client.end(); 
    return res? res.oid : null;
}
