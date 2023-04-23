import express from 'express';
import usersService from '../service/user';
import adminsService from '../service/admin';
import lawEnforcementService from '../service/lawEnforcement';
import argon2 from 'argon2';
import debug from 'debug';
import { PatchUserDto } from '../dto/patchUser';
import { PatchLawEnforcementDto } from '../dto/lawEnforcement/patchLawEnforcement';
import apiResponse from '../common/api/apiResponse';

const log: debug.IDebugger = debug('app:users-controller');

class UsersController {
    /**
     * GET /api/v1/users
     * @summary This is the summary of the endpoint
     * @tags users
     * @return {object} 200 - success response - application/json
     * @return {object} 400 - Bad request response
    */
    async listUsers(req: express.Request, res: express.Response) {
        const users = await usersService.list(100, 0);
        res.status(200).send(users);
    }

    /**
  * GET /api/v1/users
  * @summary This is the summary of the endpoint
  * @tags users
  * @return {object} 200 - success response - application/json
  * @return {object} 400 - Bad request response
 */
    async getUserById(req: express.Request, res: express.Response) {
        const user = await usersService.readById(req.body.id);
        res.status(200).send(user);
    }

    /**
   * GET /api/v1/users
   * @summary This is the summary of the endpoint
   * @tags users
   * @return {object} 200 - success response - application/json
   * @return {object} 400 - Bad request response
  */
    async createUser(req: express.Request, res: express.Response) {
        req.body.password = await argon2.hash(req.body.password);
        const userId = await usersService.create(req.body);
        res.status(201).send({ id: userId });
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

        try {
            const admins = await adminsService.list(100, 0);
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

    async listLawEnforcementOfficers(req: express.Request, res: express.Response) {
        const admins = await lawEnforcementService.list(100, 0);
        res.status(200).send(admins);
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

    async updateAdminPermissionFlags(req: express.Request, res: express.Response) {
        const patchAdminDto: PatchUserDto = {
            permissionFlags: parseInt(req.params.permissionFlags),
        };
        const results = await adminsService.patchById(req.body.id, patchAdminDto);

        if (results instanceof Error) {
            res.locals.data = {
                ...results
            }
            return apiResponse(res, 400)
        }
        res.status(204).send();
        res.status(204).send();
    }

    async updateLawEnforcementPermissionFlags(req: express.Request, res: express.Response) {
        const patchLawEnforcementDto: PatchUserDto = {
            permissionFlags: parseInt(req.params.permissionFlags),
        };
        const results = await lawEnforcementService.patchById(req.body.id, patchLawEnforcementDto);

        if (results instanceof Error) {
            res.locals.data = {
                ...results
            }
            return apiResponse(res, 400)
        }
        res.status(204).send();
    }
}

export default new UsersController();
