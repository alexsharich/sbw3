import {injectable} from "inversify";
import {DeviceModel} from "../../input-output-types/device.type";


@injectable()
export class DevicesQueryRepository {
    constructor() {
    }

    async getDevices(userId: string) {
        const result = await DeviceModel.find({userId}).lean().exec()
        return result.map((res) => ({
            ip: res.ip,
            title: res.deviceName,
            lastActiveDate: res.createdAt,
            deviceId: res._id.toString()
        }))
    }

    async getDeviceById(deviceId: string) {
        return DeviceModel.findById(deviceId)
    }
}