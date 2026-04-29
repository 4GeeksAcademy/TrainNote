import React from "react";
import Autocomplete from "react-google-autocomplete";

const GoogleInput = ({ 
    placeholder, 
    icon, 
    onPlaceSelected, 
    onChange, 
    value, 
    required = false 
}) => {
    return (
        <div className="d-flex align-items-center mb-3">
            <i className={`${icon} me-3 text-muted`} style={{ width: "20px" }}></i>
            
            <Autocomplete
                apiKey="AIzaSyAIjEtDE9DT_aJdXjy9uC2NMdzUKhtOjOU"
                onPlaceSelected={onPlaceSelected}
                onChange={onChange}
                className="form-control input-line"
                placeholder={placeholder}
                options={{ types: ["address"] }}
                defaultValue={value}
                required={required}
            />
        </div>
    );
};

export default GoogleInput;