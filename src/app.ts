import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import * as data from './data';

const app = express();

// Register all the middleware with express
// parses JSON from the body to JSON object. 
app.use(bodyParser.json());
// Allow cross-origin requests. 
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

// configurations 
const port = process.env.PORT || 5050;

app.get('/', (req, res) => {
    res.send(`Welcome to URL conversion.</br></br> Usage: ${req.protocol}://${req.hostname}?longUrl=http(s)://www.xyz.com`);
});

/**
 * Returns a randomly generated short url for a given long url. 
 * Or, the previously assigned short url for the given long url. 
 * /getShort?shortUrl=<long url value>.
 * The protocol and host for long url will be the same as the current. 
 * Example returned long url = https://xyz.com/dmzKek
 */
app.get('/getShort', (req, res) => {
    const host = req.headers.host;    
    const badLongUrlResponse = `Error: Bad long url. Usage example: ${req.protocol}://${host}?longUrl=http(s)://www.xyz.com>`;
    const createShortUrlErrorResponse = `Error: Could not create a short url. Please try again.`;
    try {
        if(req.url) {
            const urlParamValue = req.url.split('?')[1];
            if(urlParamValue.indexOf('=') > -1) {
                createShortUrl(urlParamValue.split('=')[1])
                    .then((result) => {
                        res.send(`${req.protocol}://${host}/${result.shortUrl}`);
                    }).catch ((error) => {
                        throw new Error(createShortUrlErrorResponse);
                    });
            }
        } else {
            throw new Error(badLongUrlResponse);
        }
    } catch (error) {
        res.send({ "Error": error });
    }
});

/**
 * Returns the long url associated with a valid previously assigned shortUrl. 
 * /getLong?shortUrl=<short url value> 
 * Example returned long url - https://www.xyz123.com
 */
app.get('/getLong', (req, res) => {
    const host = req.headers.host;    
    const badShortUrlResponse = `Error: Bad short url. Usage example: ${req.protocol}://${host}?shortUrl=dmgKek>`;
    const createShortUrlErrorResponse = `Error: long url could not be found`;
    try {
        if(req.url) {
            const urlParamValue = req.url.split('?')[1];
            if(urlParamValue.indexOf('=') > -1) {
                data.getLongUrlByShort(urlParamValue.split('=')[1])
                    .then((result) => {
                        let response = result? result : createShortUrlErrorResponse;
                        res.send(response);
                    }).catch(error => {
                        throw new Error(createShortUrlErrorResponse);
                    });
            }
        }
        else {
            throw new Error(badShortUrlResponse);
        }
    } catch (error) {
        res.send({ "Error": error });
    }    
});

app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});

/**
 * Converts a long url to short. 
 * The generated url only contains permissible character for url - alphanumeric (upper and lowercase) and a few special characters (total 66). 
 * Short url = base-66 conversion of a 10 digit random number to a string using the permissible characters.   
 * If the long url was previously converted, it will return the same shortUrl. 
 * @param longUrl The long url to be converted to short url. 
 */
async function createShortUrl(longUrl: string) {
    let result = { "shortUrl": "" };
    if(!longUrl) {
        return (result);
    }
    let isSaveShortUrl: boolean = false;

    result.shortUrl =  await data.getShortUrlByLong(longUrl);

    if(!result.shortUrl) {
        let urlId  = Math.floor(Math.random() * 10000000000);
        isSaveShortUrl = true;

        const alphaLower = "abcdefghijklmnopqrstuvwxyz";
        const allowedUrlCharacters =  alphaLower + alphaLower.toUpperCase() + "0123456789" + "-._~";
        let urlChars = allowedUrlCharacters.split('');

        let shortUrl: string[] = [];

        while( urlId > 0) {
            let index = Math.floor(urlId % urlChars.length);
            shortUrl.push(urlChars[index].toString());
            urlId = Math.floor(urlId / urlChars.length);
        }

        result.shortUrl = shortUrl.reverse().join('');
    }

    // Save the url and its id
    if(isSaveShortUrl) {
        await data.saveUrls(longUrl, result.shortUrl).then(() => {
        }).catch ((error) => {
            return "Error: The url could not be converted."
        });
    }
    return result;
}
