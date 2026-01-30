import Stats from "../components/Profile/Stats";
import Maintenance from "../components/Maintenance/MaintenanceCard";
import Garage from "../components/Profile/Garage";

const Profile = () => {
  return (
    <div className="profile-wrapper">
        
      <Stats />

      {/* Garage con panel */}
      <div className="ui-panel">
        <Garage />
      </div>
      <br></br>
      {/* Maintenance con panel */}
      
        <Maintenance
          showTitle={true}
          showActionButton={true}
        />
      
    </div>
  );
};

export default Profile;
