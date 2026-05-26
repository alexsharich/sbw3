import {HydratedDocument, model, Model, Schema} from "mongoose";

export class ApiRequest {
    IP: string
    URL: string

    constructor(IP: string, URL: string, public date: string) {
        this.IP = IP
        this.URL = URL
    }
}

export type ApiRequestModelType = Model<ApiRequest>
export type AoiRequestDocument = HydratedDocument<ApiRequest>

const ApiRequestSchema = new Schema<ApiRequest>({
    IP: {type: String, required: true},
    URL: {type: String, required: true}
})

export const ApiRequestModel = model<ApiRequest, ApiRequestModelType>('apiRequests', ApiRequestSchema)
