import {devicesCollection} from "../../repositories/db/db";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";


@injectable()
export class DevicesQueryRepository  {
    constructor(){}
    async getDevices(userId: string) {
        const result = await devicesCollection.find({userId}).toArray()
        return result.map((res) => ({
            ip: res.ip,
            title: res.deviceName,
            lastActiveDate: res.createdAt,
            deviceId: res._id.toString()
        }))
    }
    async getDeviceById(deviceId: string) {
        return devicesCollection.findOne({_id: new ObjectId(deviceId)})
    }
}