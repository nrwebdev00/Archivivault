import { prisma } from "../../../config/db/prisma.ts"
import { v4 as uuidv4 } from 'uuid';
import { customError } from "../../../utils/customError.ts";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  tenant_id: string;
  roles: string[];
};



const createUser = async(email: string, name: string, hashedPassword: string)=>{
    let user = await prisma.user.create({
        data:{
            email,
            name,
            password_hash : hashedPassword,
            tenant_id : uuidv4(),
        },
    });

    if(user.id == user.tenant_id){
        user = await prisma.user.update({
            where: {id: user.id},
            data: { tenant_id: uuidv4() }
        })
    };

    if(!user){
        throw new customError('User was not created', 500)
    }
    // TODO CREATE USER PROFILE --> STILL NEED TO CREATE THE PROFILE


    const userData : PublicUser = {
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'tenant_id': user.tenant_id,
        'roles': user.roles,
    }

    return userData;
}

export { createUser }