import {Container} from "inversify";
import { AuthController } from "./auth/controllers/auth.controller";
import {UsersQueryRepository} from "./users/repositories/users.query.repository";
import { UsersCommandRepository } from "./users/repositories/users.command.repository";
import {AuthService} from "./auth/service/authService";
import { EmailAdapter } from "./adapters/email.adapter";
import { JwtService } from "./application/jwtService";
import { DevicesService } from "./devices/services/devices.service";
import { DevicesCommandRepository } from "./devices/repositories/devices.command.repository";
import {DevicesQueryRepository} from "./devices/repositories/devices.query.repository";
import { UsersService } from "./users/services/users.service";
import { UsersController } from "./users/controllers/users.controller";
import {DeviceController} from "./devices/controllers/device.controller";

export const container = new Container()
container.bind(JwtService).to(JwtService)
container.bind(EmailAdapter).to(EmailAdapter)

container.bind(AuthService).to(AuthService)
container.bind(AuthController).to(AuthController)

container.bind(DevicesService).to(DevicesService)
container.bind(DeviceController).to(DeviceController)
container.bind(DevicesCommandRepository).to(DevicesCommandRepository)
container.bind(DevicesQueryRepository).to(DevicesQueryRepository)

container.bind(CommentsController).to(CommentsController)
container.bind(CommentsService).to(CommentsService)
container.bind(CommentsRepository).to(CommentsRepository)
container.bind(CommentsQueryRepository).to(CommentsQueryRepository)

container.bind(PostsQueryRepository).to(PostsQueryRepository)
container.bind(PostsController).to(PostsController)
container.bind(PostsRepository).to(PostsRepository)
container.bind(PostsService).to(PostsService)

container.bind(BlogsService).to(BlogsService)
container.bind(BlogsController).to(BlogsController)
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(BlogsQueryRepository).to(BlogsQueryRepository)


container.bind(UsersService).to(UsersService)
container.bind(UsersController).to(UsersController)
container.bind(UsersCommandRepository).to(UsersCommandRepository)
container.bind(UsersQueryRepository).to(UsersQueryRepository)