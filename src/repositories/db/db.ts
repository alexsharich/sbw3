import {Collection, Db, MongoClient} from 'mongodb';
import {BlogDBType} from "../../input-output-types/blogs.type";
import {PostDBType} from "../../input-output-types/posts.type";
import {UserDBType} from "../../input-output-types/users.type";
import {CommentDBType} from "../../input-output-types/comments.type";


export let client: MongoClient;
export let blogsCollection: Collection<BlogDBType>;
export let postsCollection: Collection<PostDBType>
export let usersCollection: Collection<UserDBType>
export let commentsCollection: Collection<CommentDBType>


export async function runDB(url: string): Promise<void> {
    client = new MongoClient(url);
    const db: Db = client.db('social');

    postsCollection = db.collection<PostDBType>('posts')
    blogsCollection = db.collection<BlogDBType>('blogs');
    usersCollection = db.collection<UserDBType>('users')
    commentsCollection = db.collection<CommentDBType>('comments')

    try {
        await client.connect();
        await db.command({ping: 1});
        console.log('✅ Connected to the database');
    } catch (e) {
        await client.close();
        throw new Error(`❌ Database not connected: ${e}`);
    }
}