import { BASE_URL } from '@/src/config';
import ViewProfileClient from './ViewProfileClient';

async function getProfileData(username) {
    try{
        const res = await fetch(`${BASE_URL}/user/get_profile_based_on_username?username=${username}`, {
            cache: 'no-store'
        });
        const data = await res.json();
        return data.profile;
    }catch(err){
        console.log(err);
        return null;
    }
}

export default async function ViewProfilePage({ params }) {
    const { username } = await params;
    const userProfile = await getProfileData(username);

    if(!userProfile){
        return <div>Profile not found</div>
    }

    return <ViewProfileClient userProfile={userProfile} />
}
