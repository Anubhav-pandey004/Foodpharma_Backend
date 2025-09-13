const http = require('http');
const app = require('./app.js');
require('dotenv').config();
const server = http.createServer(app);
const ConnectDB = require('./db/config')
const router = require('./router/index.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(cors({
    origin: 'https://food-pharma.netlify.app',
    credentials: true
}))

app.use('/',router)

ConnectDB().then(()=>{
    server.listen(8080,()=>{
        console.log('server is running on 8080.');
    })
})
