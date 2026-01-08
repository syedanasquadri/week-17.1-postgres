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

    const city = req.body.street;
    const country = req.body.country;
    const street = req.body.street;
    const pincode = req.body.email;

    try {
        const insertQuery = `INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id;`

        const response = await pgClient.query(insertQuery, [username, password, email]);
        const userId = response.rows[0].id;

        const addressInsertQuery = `INSERT INTO addresses (city, country, street, pincode, user_id) VALUES ($1, $2, $3, $4, $5);`

        const responseAddressQuery = await pgClient.query(addressInsertQuery, [city, country, street, pincode, userId]);

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