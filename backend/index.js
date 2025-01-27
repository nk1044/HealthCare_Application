import app from './app.js';
import {connectDB} from './src/config/db.js';
import 'dotenv/config';
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'



const port = process.env.PORT || 3000;

connectDB().then(()=>{
    
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
}).catch((error)=>{
    console.error(`Error: ${error.message}`);
    process.exit(1);
})