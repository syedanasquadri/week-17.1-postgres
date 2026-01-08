import {Client} from "pg"
import { ConnectionString } from "./config";
import express from 'express'

const app = express();
app.use(express.json())

const pgClient = new Client(ConnectionString)

pgClient.connect();

app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    try {
        const insertQuery = `INSERT INTO USERS(username, password, email) VALUES ($1, $2, $3);`

        const response = await pgClient.query(insertQuery, [username, password, email]);

         res.json({
             message: "You have signed up"
        })
    } catch(e) {
        console.log(e);
        res.json({
            message: "Error while signing up"
        })
    }
})

app.listen(3000);