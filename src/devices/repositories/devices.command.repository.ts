import {ObjectId} from "mongodb";
import {Device, DeviceModel} from "../../input-output-types/device.type";
import {injectable} from "inversify";

@injectable()
export class DevicesCommandRepository {
    async createDevice(_id: ObjectId, device: Device) {
        const newDevice = await DeviceModel.insertOne({_id, ...device})
        await newDevice.save()
        return newDevice._id.toString()
    }

    async deleteDevice(deviceId: string) {
        const objDeviceId = new ObjectId(deviceId)
        const result = await DeviceModel.deleteOne(objDeviceId)
        return result.deletedCount === 1
    }

    async deleteDevices(userId: string, deviceId: string) {
        const result = await DeviceModel.deleteMany({userId, _id: {$ne: new ObjectId(deviceId)}})
        return result.deletedCount >= 1
    }

    async updateDevice(deviceId: ObjectId, expAt: string, createdAt: string) {
        const device = await DeviceModel.findById(deviceId).exec()
        if (!device) {
            return false
        }
        device.expAt = expAt
        device.createdAt = createdAt
        await device.save()
        return true
    }

    async getDeviceById(deviceId: string) {
        return await DeviceModel.findById(deviceId)
    }
}