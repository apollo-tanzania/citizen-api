import express from 'express';
import usersService from '../service/user';
import adminsService from '../service/admin';
import lawEnforcementService from '../service/lawEnforcement';
import argon2 from 'argon2';
import debug from 'debug';
import { PatchUserDto } from '../dto/patchUser';
import apiResponse from '../common/api/buildApiResponse';
import { PatchPermissionLog } from '../dto/permissionLog/patchPermissionLog';
import extractParamsFromQuery from '../common/helpers/utils';
import buildApiResponse from '../common/api/buildApiResponse';

const log: debug.IDebugger = debug('app:users-controller');

class UsersController {

    async listUsers(req: express.Request, res: express.Response, next: express.NextFunction) {
        const queryParams = extractParamsFromQuery(req.query)

        if (!queryParams) return res.status(400).send({ message: "Invalid query body properties" })

        try {
            const users = await usersService.list(queryParams);
            res.status(200).send(users);
        } catch (error) {
            next(error)
        }

    }

    async getUserById(req: express.Request, res: express.Response) {
        const user = await usersService.readById(req.body.id);
        res.status(200).send(user);
    }

    async createUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            req.body.password = await argon2.hash(req.body.password);
            const userId = await usersService.create(req.body);
            res.locals.data = {
                userId
            }
            buildApiResponse(res, 201, true)
            // res.status(201).send({ id: userId });
        } catch (error) {
            next(error);
        }
    }

    async patch(req: express.Request, res: express.Response) {
        if (req.body.password) {
            req.body.password = await argon2.hash(req.body.password);
        }
        log(await usersService.patchById(req.body.id, req.body));
        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        req.body.password = await argon2.hash(req.body.password);
        log(await usersService.putById(req.body.id, req.body));
        res.status(204).send();
    }

    async removeUser(req: express.Request, res: express.Response) {
        log(await usersService.deleteById(req.body.id));
        res.status(204).send();
    }

    // ADMIN

    async listAdmins(req: express.Request, res: express.Response, next: express.NextFunction) {

        const queryParams = extractParamsFromQuery(req.query)

        if (!queryParams) return res.status(400).send({ message: "Invalid query body properties" })

        try {
            const admins = await adminsService.list(queryParams)
            res.status(200).send(admins);
        } catch (error) {
            next(error);
        }
    }

    async getAdminById(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const admin = await adminsService.readById(req.body.id);
            if (!admin) {
                // throw new Error("Admin not found");
                return res.status(500).send(admin)
            }
            res.status(200).send(admin);
        } catch (error) {
            next(error);
        }

    }

    async getAdminByEmail(req: express.Request, res: express.Response) {
        const admin = await adminsService.getAdminByEmail(req.body.id);
        res.status(200).send(admin);
    }

    async createAdmin(req: express.Request, res: express.Response) {
        try {
            req.body.password = await argon2.hash(req.body.password);
            const userId = await adminsService.create(req.body);
            res.status(201).send({ id: userId });
        } catch (error) {
            res.status(400).send({ error });
        }
    }

    async removeAdmin(req: express.Request, res: express.Response) {
        log(await adminsService.deleteById(req.body.id));
        res.status(204).send();
    }

    // END ADMIN

    // LAW ENFORCEMENT

    async listLawEnforcementOfficers(req: express.Request, res: express.Response, next: express.NextFunction) {
        const queryParams = extractParamsFromQuery(req.query)

        if (!queryParams) return res.status(400).send({ message: "Invalid query body properties" })
        try {
            const admins = await lawEnforcementService.list(queryParams);
            res.status(200).send(admins);
        } catch (error) {
            next(error)
        }

    }

    async getLawEnforcementOfficerById(req: express.Request, res: express.Response) {
        const admin = await lawEnforcementService.readById(req.body.id);
        res.status(200).send(admin);
    }

    async getLawEnforcementOfficerByEmail(req: express.Request, res: express.Response) {
        const admin = await lawEnforcementService.getLawEnforcementByEmail(req.body.id);
        res.status(200).send(admin);
    }

    async createLawEnforcementOfficer(req: express.Request, res: express.Response) {
        try {
            req.body.password = await argon2.hash(req.body.password);
            const userId = await lawEnforcementService.create(req.body);
            res.status(201).send({ id: userId });
        } catch (error) {
            res.status(400).send({ error });
        }
    }

    async removeLawEnforcementOfficer(req: express.Request, res: express.Response) {
        log(await lawEnforcementService.deleteById(req.body.id));
        res.status(204).send();
    }

    async patchLawEnforcementOfficer(req: express.Request, res: express.Response) {
        if (req.body.password) {
            req.body.password = await argon2.hash(req.body.password);
        }
        log(await lawEnforcementService.patchById(req.body.id, req.body));
        res.status(204).send();
    }

    async putLawEnforcementOfficer(req: express.Request, res: express.Response) {
        req.body.password = await argon2.hash(req.body.password);
        log(await lawEnforcementService.putById(req.body.id, req.body));
        res.status(204).send();
    }
    // END LAW ENFORCEMENT

    async updatePermissionFlags(req: express.Request, res: express.Response) {
        const patchUserDto: PatchUserDto = {
            permissionFlags: parseInt(req.params.permissionFlags),
        };
        log(await usersService.patchById(req.body.id, patchUserDto));
        res.status(204).send();
    }

    async updateAdminPermissionFlags(req: express.Request, res: express.Response, next: express.NextFunction) {

        try {
            const permissionChangeDto = {
                userId: req.params.adminId,
                permissionFlags: parseInt(req.params.permissionFlags),
                authorizedBy: req.body.authorizedBy
            }
    
            const results = await adminsService.updatePermissionById(req.body.id, permissionChangeDto);
    
            res.locals.data = {
                message: "Admin permissions updated successfully",
                ...results
            }
            buildApiResponse(res, 201, true)
        } catch (error) {
            next(error)
        }
       

        // return res.status(204).send(results);
    }

    async updateLawEnforcementPermissionFlags(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const patchLawEnforcementDto: PatchUserDto = {
                permissionFlags: parseInt(req.params.permissionFlags),
            };
            const results = await lawEnforcementService.patchById(req.body.id, patchLawEnforcementDto);
    
            buildApiResponse(res, 204)
        } catch (error) {
            next(error);
        }
      
    }

    // async updateLawEnforcementVerificationStatusFlag(req: express.Request, res: express.Response) {
    //     const patchLawEnforcementDto: PatchLawEnforcementVerificationHistoryDto = {
    //         status:  req.params.statusFlag as unknown as Boolean,
    //     };
    //     const results = await lawEnforcementService.patchById(req.body.id, patchLawEnforcementDto);

    //     if (results instanceof Error) {
    //         res.locals.data = {
    //             ...results
    //         }
    //         return apiResponse(res, 400)
    //     }
    //     res.status(204).send();
    // }

    async updateLawEnforcementVerificationStatus(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const response = await lawEnforcementService.updateLawEnforcementVerificationStatus(req.body);
            res.locals.data = {
                message: "Verification history created",
                data: response
            }
            buildApiResponse(res, 201, true)
        } catch (error) {
            next(error)
        }
    }

    async revokeLawEnforcementVerificationStatus(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const response = await lawEnforcementService.revokeLawEnforcementVerificationStatus(req.body);

            res.locals.data = {
                message: "Law enforcement verification revoked",
                data: response
            }
            buildApiResponse(res, 201, true)
        } catch (error) {
            next(error)
        }
    }
}

export default new UsersController();
