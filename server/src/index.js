import dotenv from "dotenv"
dotenv.config();

import ConnectDB from "./db/db.js"
import app from './app.js';

const port = process.env.PORT;

ConnectDB()
.then(()=> {
    app.listen(port || 3000, ()=> console.log(`App listening on port ${port}`))
})
.catch((err)=> {
    console.log("Connection to MongoDB failed", err)
})