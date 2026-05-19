import {Router} from "express";
import {authRefreshMiddleware} from "../../global-middleware/auth.refresh.middleware";
import {container} from "../../composition-root";
import {DeviceController} from "../../devices/controllers/device.controller";

const deviceController = container.get(DeviceController)
export const devicesRouter = Router({})

devicesRouter.get('/devices', authRefreshMiddleware, deviceController.getDevices.bind(deviceController))
devicesRouter.delete('/devices', authRefreshMiddleware, deviceController.deleteDevices.bind(deviceController))
devicesRouter.delete('/devices/:deviceId', authRefreshMiddleware, deviceController.deleteDeviceById.bind(deviceController))