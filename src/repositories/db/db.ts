import { Collection, Db, MongoClient } from 'mongodb';
import {BlogDBType} from "../../input-output-types/blogs.type";



export let client: MongoClient;
export let blogsCollection: Collection<BlogDBType>;

// Подключения к бд
export async function runDB(url: string): Promise<void> {
    client = new MongoClient(url);
    const db: Db = client.db('social');

    //Инициализация коллекций
    blogsCollection = db.collection<BlogDBType>('blogs');

    try {
        await client.connect();
        await db.command({ ping: 1 });
        console.log('✅ Connected to the database');
    } catch (e) {
        await client.close();
        throw new Error(`❌ Database not connected: ${e}`);
    }
}