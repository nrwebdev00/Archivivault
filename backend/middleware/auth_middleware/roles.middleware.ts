import type { Request, Response, NextFunction } from "express";

function authorizationRoleCheck(role: string){
    return (req: Request, res: Response, next: NextFunction) =>{
        const userRoles = req.user?.user_role;

        if(!userRoles || !Array.isArray(userRoles)){
            res.status(403).json({ msg: 'error', error: 'No Roles Assigned to User'});
            return;
        }

        const hasRole = userRoles.includes(role);

        if(!hasRole){
            res.status(403).json({ msg:'error', error: 'Access denied: Role not assigned to user'});
            return;
        }

        next();
    };
}

export { authorizationRoleCheck }