import {Router} from "express";
import {authRefreshMiddleware} from "../../global-middleware/auth.refresh.middleware";
import {getDevicesController} from "../../devices/controllers/get.devices.controller";
import {deleteDevicesController} from "../../devices/controllers/delete.devices.controller";
import {deleteDeviceByIdController} from "../../devices/controllers/delete.devce.by.id.controller";

export const devicesRouter = Router({})

devicesRouter.get('/devices', authRefreshMiddleware, getDevicesController)
devicesRouter.delete('/devices', authRefreshMiddleware, deleteDevicesController)
devicesRouter.delete('/devices/:deviceId', authRefreshMiddleware, deleteDeviceByIdController)