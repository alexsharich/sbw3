import {devicesQueryRepository} from "../repositories/devices.query.repository";
import {devicesCollection} from "../../repositories/db/db";
import {ObjectId} from "mongodb";
import {devicesCommandRepository} from "../repositories/devices.command.repository";
import {Device} from "../../input-output-types/device.type";

enum STATUS_CODE_DEVICES {
    NO_CONTENT = 204,
    NOT_FOUND = 404,
    FORBIDDEN = 403
}

export const devicesService = {
    async saveDevice(_id: ObjectId, ip: string, deviceName: string, createdAt: string, userId: string, expAt: string) {
        const device = new Device(ip, deviceName, createdAt, userId, expAt)
        await devicesCommandRepository.createDevice(_id, device)
        return
    },
    async deleteDeviceById(deviceId: string, userId: string): Promise<STATUS_CODE_DEVICES> {
        const device = await devicesQueryRepository.getDeviceById(deviceId)
        if (!device) {
            return STATUS_CODE_DEVICES.NOT_FOUND
        }
        if (device.userId !== userId) {
            return STATUS_CODE_DEVICES.FORBIDDEN
        }
        const deviceIsDeleted = await devicesCommandRepository.deleteDevice(deviceId)
        if (!deviceIsDeleted) {
            return STATUS_CODE_DEVICES.NOT_FOUND
        }
        return STATUS_CODE_DEVICES.NO_CONTENT
    },
    async deleteDevices(deviceId: string, userId: string): Promise<boolean> {
        return await devicesCommandRepository.deleteDevices(userId, deviceId)

    },
    async updateDevice(deviceId: ObjectId, expAt: string, createdAt: string) {
        await devicesCommandRepository.updateDevice(deviceId, expAt, createdAt)
    },
    async getDevices(userId: string) {
        return await devicesQueryRepository.getDevices(userId)
    }
}