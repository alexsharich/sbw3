import {DevicesQueryRepository} from "../repositories/devices.query.repository";
import {ObjectId} from "mongodb";
import {DevicesCommandRepository} from "../repositories/devices.command.repository";
import {Device} from "../../input-output-types/device.type";
import {inject, injectable} from "inversify";

enum STATUS_CODE_DEVICES {
    NO_CONTENT = 204,
    NOT_FOUND = 404,
    FORBIDDEN = 403
}

@injectable()
export class DevicesService {
    constructor(@inject(DevicesCommandRepository) private devicesCommandRepository: DevicesCommandRepository,
                @inject(DevicesQueryRepository) private devicesQueryRepository: DevicesQueryRepository) {
    }

    async saveDevice(_id: ObjectId, ip: string, deviceName: string, createdAt: string, userId: string, expAt: string) {
        const device = new Device(ip, deviceName, createdAt, userId, expAt)
        await this.devicesCommandRepository.createDevice(_id, device)
        return
    }

    async deleteDeviceById(deviceId: string, userId: string): Promise<STATUS_CODE_DEVICES> {
        const device = await this.devicesQueryRepository.getDeviceById(deviceId)
        if (!device) {
            return STATUS_CODE_DEVICES.NOT_FOUND
        }
        if (device.userId !== userId) {
            return STATUS_CODE_DEVICES.FORBIDDEN
        }
        const deviceIsDeleted = await this.devicesCommandRepository.deleteDevice(deviceId)
        if (!deviceIsDeleted) {
            return STATUS_CODE_DEVICES.NOT_FOUND
        }
        return STATUS_CODE_DEVICES.NO_CONTENT
    }

    async deleteDevices(deviceId: string, userId: string): Promise<boolean> {
        return await this.devicesCommandRepository.deleteDevices(userId, deviceId)

    }

    async updateDevice(deviceId: ObjectId, expAt: string, createdAt: string) {
        await this.devicesCommandRepository.updateDevice(deviceId, expAt, createdAt)
    }

    async getDevices(userId: string) {
        return await this.devicesQueryRepository.getDevices(userId)
    }
}