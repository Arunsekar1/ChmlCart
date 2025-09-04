const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname,'config/config.env')});

const connectDatabase = require('./config/database');
const app = require('./app');

connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is listening to the port: ${process.env.PORT} in ${process.env.NODE_ENV}`);
});

process.on('unhandledRejection',(err) => {
    console.log(`Error: ${err.message}`);
    console.log('shutting down the server due to unhandled rejection');
    server.close(()=>{
        process.exit(1);
    })
})

process.on('uncaughtException',(err) => {
    console.log(`Error: ${err.message}`);
    console.log('shutting down the server due to uncaught Exception');
    server.close(()=>{
        process.exit(1);
    })
})
