import {Collection, Db, MongoClient} from 'mongodb';
import {BlogDBType} from "../../input-output-types/blogs.type";
import {PostDBType} from "../../input-output-types/posts.type";
import {UserAccountDBType} from "../../input-output-types/users.type";
import {CommentDBType} from "../../input-output-types/comments.type";
import {BlackListDBType} from "../../input-output-types/black.list.type";
import {Device} from "../../input-output-types/device.type";
import {ApiRequest} from "../../input-output-types/api.request.type";


export let client: MongoClient;
export let blogsCollection: Collection<BlogDBType>;
export let postsCollection: Collection<PostDBType>
export let usersCollection: Collection<UserAccountDBType>
export let commentsCollection: Collection<CommentDBType>
export let blackListCollection: Collection<BlackListDBType>
export let devicesCollection: Collection<Device>

export let apiRequestCollection: Collection<ApiRequest>


export async function runDB(url: string): Promise<void> {
    client = new MongoClient(url);
    const db: Db = client.db('social');

    postsCollection = db.collection<PostDBType>('posts')
    blogsCollection = db.collection<BlogDBType>('blogs');
    usersCollection = db.collection<UserAccountDBType>('users')
    commentsCollection = db.collection<CommentDBType>('comments')
    blackListCollection = db.collection<BlackListDBType>('blackList')
    devicesCollection = db.collection<Device>('devices')

    apiRequestCollection = db.collection<ApiRequest>('apiRequest')

    try {
        await client.connect();
        await db.command({ping: 1});
        console.log('✅ Connected to the database');
    } catch (e) {
        await client.close();
        throw new Error(`❌ Database not connected: ${e}`);
    }
}