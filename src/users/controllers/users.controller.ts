import {inject, injectable} from "inversify";
import {UsersQueryRepository} from "../repositories/users.query.repository";
import {UsersService} from "../services/users.service";
import {Request, Response} from "express";
import {paginationQueriesForUsers, PaginationQueriesUsersType} from "../../helpers/pagination.values";

@injectable()
export class UsersController {
    constructor(@inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
                @inject(UsersService) private usersService: UsersService) {

    }

    async createUser(req: Request, res: Response) {
        const isNewUserCreated = await this.usersService.createUser(req.body)

        if (Array.isArray(isNewUserCreated)) {
            res.status(400).json({
                errorsMessages: isNewUserCreated
            })
            return
        }

        const newUser = await this.usersQueryRepository.findUser(isNewUserCreated as string)
        if (newUser) {
            res.status(201).json(newUser)
            return
        }

        res.sendStatus(404)
    }

    async deleteUser(req: Request<{ id: string }>, res: Response) {
        const isDeleted = await this.usersService.deleteUser(req.params.id)
        if (!isDeleted) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
    }

    async getUsers(req: Request<{}, {}, {}, PaginationQueriesUsersType>, res: Response) {
        const sortFilter = paginationQueriesForUsers(req.query)

        const users = await this.usersQueryRepository.getUsers(sortFilter)
        if (users) {
            res.status(200).send(users)
        }
    }
}