import {devicesCollection} from "../../repositories/db/db";
import {ObjectId} from "mongodb";

export const devicesQueryRepository = {
    async getDevices(userId: string) {
        const result = await devicesCollection.find({userId}).toArray()
        return result.map((res) => ({
            ip: res.ip,
            title: res.deviceName,
            lastActiveDate: res.createdAt,
            deviceId: res._id.toString()
        }))
    },
    async getDeviceById(deviceId: string) {
        return devicesCollection.findOne({_id: new ObjectId(deviceId)})
    },
}