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
        await pgClient.query('BEGIN;')
        const insertQuery = `INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id;`
        const addressInsertQuery = `INSERT INTO addresses (city, country, street, pincode, user_id) VALUES ($1, $2, $3, $4, $5);`

        const response = await pgClient.query(insertQuery, [username, password, email]);
        const userId = response.rows[0].id;
        const responseAddressQuery = await pgClient.query(addressInsertQuery, [city, country, street, pincode, userId]);

        await pgClient.query('COMMIT;')

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

app.get("/metadata", async (req, res) => {
    const id = req.query.id;
    const query1 = `SELECT username,email,id FROM users WHERE id=$1;`;
    const response1 = await pgClient.query(query1,[id]);

    const query2 = `SELECT * FROM addresses WHERE user_id=$1;`;
    const response2 = await pgClient.query(query2,[id]);

    res.json({
        user: response1.rows[0],
        address : response2.rows
    })
})

app.get("/better-metadata", async (req,res) => {
    const id = req.query.id;
    const query = `SELECT users.id, users.username, users.email, users.password, addresses.city, addresses.country, addresses.street, addresses.pincode
    FROM users LEFT JOIN addresses ON users.id = addresses.user_id
    WHERE users.id = $1`;
    const response = await pgClient.query(query,[id])
    res.json({
        response : response.rows
    })
})

app.listen(3000);