import {Request, Response} from "express";
import {paginationQueriesForUsers, PaginationQueriesUsersType} from "../../helpers/pagination.values";
import {usersQueryRepository} from "../repositories/users.query.repository";

export const getUsersController = async (req: Request<{}, {}, {}, PaginationQueriesUsersType>, res: Response) => {
    const sortFilter = paginationQueriesForUsers(req.query)

    const users = await usersQueryRepository.getUsers(sortFilter)
    if (users) {
        res.status(200).send(users)
    }
}