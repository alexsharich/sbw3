import {InputPostType} from "./posts.type";
import {InputBlogType} from "./blogs.type";


export type FieldNamesType = keyof InputPostType | keyof InputBlogType

export type OutputErrorsType = {
    errorsMessages: { message: string, field: FieldNamesType }[]
}