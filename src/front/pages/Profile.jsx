import ProfileHeader from "../components/Profile/ProfileHeader";
import Stats from "../components/Profile/Stats";
import Maintenance from "../components/Maintenance/MaintenanceCard";
import Garage from "../components/Profile/Garage";


const Profile = () => {
    return (
        <main className="profile-page">
            <div className="profile-wrapper">
                <ProfileHeader />
                <Stats />
                <Garage />
                <Maintenance
                    showTitle={true}
                    showActionButton={true}
                />
            </div>
        </main>
    );
};

export default Profile;