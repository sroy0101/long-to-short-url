## Long-to-Short-Url

A starter application to convert a long url to a short one. 

If you want to set up a short url service for whatever reason, such as security or cost saving, you can use this project as the base and build on it. 

This project currently provides the conversion from long to a short url. Other functionalities, such as redirection and administration, are required in order to make it into a full short url service. 

### Installation
1. Clone the repo to your local folder. 
2. > npm install - to install the app packages. 
3. This app needs access to a postgres server instance, remote or local. Create a database called "shortUrl" in the server. 
4. Run the db/createdb.sql to create the "urls" table. 
5. Add the database server access information, in the src/config.ts file. 
6. > npm run start - to start the application. 

### Usage Examples
With the application running and listening on port 5050: 
1. To get a shortUrl for long url such as http://aVeryVeryLongUrl.com, use the browser to open the following url:

    http://localhost:5050/getshort?longUrl=http://aVeryVeryLongUrl.com

Expected response: 
    http://localhost:5050/bS4G4d

where "bS4G4d" is a randomly generated value unique to the given long url. 

2. To get the long url associated with a short Url that was previously generated, use the browser to open the following as the following example:

    http://localhost:5050/getLong?shortUrl=bS4G4d

Expected response (example) :

    http://aVeryVeryLongUrl.com


