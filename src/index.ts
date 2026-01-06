import {Client} from "pg"
import { ConnectionString } from "./config";

const pgClient = new Client(ConnectionString)

async function main(){
    await pgClient.connect();
    const response = await pgClient.query("UPDATE users SET username='harkirat' WHERE id=2");
    console.log(response.rows);
}

main();
