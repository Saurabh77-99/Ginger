import {getKindeServerSession} from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { createUser, getUserByID } from '../neo4j.action';

export default async function CallbackPage() {
    const {isAuthenticated,getUser} = getKindeServerSession()

    if(!(await isAuthenticated()))
        return redirect(
        "/api/auth/login?post_login_redirect_url=http://localhost:3000/callback"
    );
    
    const user = await getUser();

    if(!user)
        return redirect(
        "/api/auth/login?post_login_redirect_url=http://localhost:3000/callback"
    );

    //checking if user is there in neo4j
    const dbUser = await getUserByID(user.id);
    
    //if (not) create a user
    if(!dbUser){
        await createUser({
            applicationId:user.id , 
            email:user.email!,
            firstname: user.given_name!,
            lastname:user.family_name ?? undefined
        })
    }
    return redirect ("/");    
}