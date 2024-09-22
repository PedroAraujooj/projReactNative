import * as SQLite from 'expo-sqlite';
import * as Network from 'expo-network';
import {getData, loadData, updateData} from "@/app/infra/realtime";

const queryUser = `
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS usuario (
                id TEXT PRIMARY KEY NOT NULL, 
                email TEXT NOT NULL, 
                nome TEXT, 
                photoURL TEXT, 
                telefone TEXT, 
                sync INTEGER
            );
        `
const queryItem = `
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS item (
                id TEXT PRIMARY KEY NOT NULL, 
                title TEXT NOT NULL, 
                isCusto TEXT,
                valor REAL,
                description TEXT,
                createdAt TEXT, 
                sync INTEGER
            );
        `;

const queryItemImage = `
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS item_image (
                id TEXT PRIMARY KEY NOT NULL, 
                image TEXT NOT NULL, 
                itemId TEXT NOT NULL,
                createdAt TEXT, 
                sync INTEGER,
                FOREIGN KEY(itemId) REFERENCES item(id)
            );
        `;

const verifyConnection = async (): Promise<boolean> => {
    const airplaneMode: boolean = await Network.isAirplaneModeEnabledAsync();
    const network: any = await Network.getNetworkStateAsync();
    const result = network.isConnected && !airplaneMode;

    if (result) {
        syncNow();
    }
    return result;
}
const getDb = async () => {
    // @ts-ignore //jij
    return await SQLite.openDatabaseAsync("localDb");
}

const generateUID = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        id += chars[randomIndex];
    }
    return id;
}

const createTables = async() => {
    try{
        const db = await getDb();
        await db.execAsync(queryUser);
        console.log(queryUser);
        await db.execAsync(queryItem);
        console.log(queryItem);
        await db.execAsync(queryItemImage);
        console.log(queryItemImage);
        console.log("Tabelas criadas");
    }catch(err){
        console.error("Database error: ", err)
    }
}
const dropTable = async (table: string) => {
    try{
        const db = await getDb();
        await db.execAsync(`DROP TABLE ${table};`);
        console.log("Tabela deletada com sucesso");
    }catch(err){
        console.error("Database drop error: ", err)
    }
}

const update = async (table: string, data: any, id: string) => {
    try{
        console.log("pedro@gmail.com")
        const sync = await syncFirebase(table, data, id);
        data.sync = sync ? 1 : 0;        const db = await getDb();

        const keys = Object.keys(data);
        const values= Object.values(data).filter((v) => v !== "");

        const columns = keys.filter((v) => v !== "").map((v, index) => `${v} = ?`).join(", ");

        const query = `UPDATE ${table} SET ${columns.substring(0, columns.length)} WHERE id = '${id}'`;
        await db.runAsync(query, values);
        console.log("Dado atualizado com sucesso")
    }catch (err){
        console.error("Error insert:", err)
        throw err;
    }
}

const drop = async (table: string, where: string) => {
    try{
        const db = await getDb();

        const query = `DELETE FROM ${table} where ${where};`
        await db.runAsync(query);

        const whereSplit = where.split("=");
        const field = whereSplit[0]
        const value = whereSplit[1].replace(/['"]+/g, '')
        await syncDropItem(field, value);
    }catch (err){
        console.error("Error insert:", err)
        throw err;
    }
}

const syncFirebase = async (table, data, uid): Promise<boolean> => {
    console.log("jooj1=2")

    const statusConnection = await verifyConnection();
    if(statusConnection) {
        console.log("jooj1")
        updateData(table, data, uid);
    }

    return statusConnection;
}


const syncDropItem = async (field: string, value: string) => {
    const statusConnection = await verifyConnection();
    if(statusConnection) {
        console.log(field);
        console.log(value);
    }
}
const insert = async (table: string, data: any): Promise<string> => {
    console.log("0000000000000000")
    try{
        const db = await getDb();

        if (data.id === undefined || data.id === null){
            data.id = generateUID(28);
        }

        const sync = await syncFirebase(table, data, data.uid);
        data.sync = sync ? 1 : 0;

        const keys = Object.keys(data);
        const values= Object.values(data).filter((v) => !!v);

        const columns = keys.filter((k) => !!data[k] ).join(", ");
        const interrogations = values.filter((v) => !!v ).map(() => '?').join(", ");

        const query = `INSERT INTO ${table} (${columns}) VALUES (${interrogations})`;
        console.log(query);
        console.log(values);
        await db.runAsync(query, values);
        console.log("Dado inserido com sucesso")
        return data.id;
    }catch (err){
        console.error("Error insert:", err)
        throw err;
    }
}

const select = async (table: string, columns: string[] , where: string, many: boolean) => {
    try {
        console.log("0000000000000000")
        const columnString: string = columns.join(", ");
        const whereString = where !== "" && where !== null && where !== undefined ? `where ${where}` : ""
        ;
        const db = await getDb();
        const query: string = `SELECT ${columnString} FROM ${table} ${whereString};`;
        console.log(query)


        if(many) {
            return await db.getAllAsync(query);
        }
        console.log(query);

        let retorno=  await db.getFirstAsync(query);
        console.log(retorno);
        return retorno;
    }catch (err){
        console.error("Error select:", err)
    }
}

const populateDatabase = async (uid: string) => {
    console.log(`=======1`)
    const tables = [
        "usuario", "item", "item_image"
    ]
    const user = await getData("table", uid);
    console.log(`=======1.1`)

    const items = await loadData("item");
    const itemImages = await loadData("item_image");

    console.log(`=======2`)

    if (user) {
        console.log("======2.2")
        await update("usuario", user, uid);
    }
    console.log("======2.3")

    const itemKeys = items != null ? Object.keys(items): [];
    const itemImagesKeys = itemImages != null ? Object.keys(itemImages): [];
    console.log(`=======3`)

    for(let key of itemKeys){
        const item = items[key]
        // TODO: Modificar para não enviar para a nuvem
        await insert("item", item);
    }
    console.log(`=======4`)

    for(let key of itemImagesKeys){
        const itemImage = itemImages[key]
        // TODO: Modificar para não enviar para a nuvem
        await insert("item_image", itemImage);
    }
}

const syncNow = async () => {

}

const syncBothDatabase = async () => {
    setInterval(async () => {
        await verifyConnection();
    }, 60000 * 5);
}


export {
    insert,
    createTables,
    dropTable,
    select,
    update,
    drop,
    syncBothDatabase,
    populateDatabase
}