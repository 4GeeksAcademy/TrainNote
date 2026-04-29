import React, { useState, useRef } from 'react';

const Cloudinary = ({ onImageUploaded }) => {
    const preset_name = "Lmroch";
    const cloud_name = "dlcubj61o";

    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const uploadImage = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setShowMenu(false);
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', preset_name);

        setLoading(true);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                method: 'POST',
                body: data
            });

            const file = await response.json();
            const urlOptimizada = file.secure_url.replace('/upload/', '/upload/w_150,h_150,c_fill,g_face/');
            setImage(urlOptimizada);
            
            if(onImageUploaded) {
                onImageUploaded(urlOptimizada);
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error uploading image:', error);
            setLoading(false);
        }
    };

    return (
        <div className="profile-wrapper">
            <div 
                className="profile-circle"
                onClick={() => !loading && setShowMenu(!showMenu)}
            >
                {!image && !loading && <h4 style={{ fontSize: "14px", margin: "0" }}>+ Foto</h4>}
                {loading && <h4 style={{ fontSize: "14px", margin: "0" }}>Subiendo...</h4>}
                {image && !loading && (
                    <img
                        src={image}
                        alt="Perfil"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                )}
            </div>

            {showMenu && (
                <div className="photo-menu">
                    <button type="button" onClick={() => fileInputRef.current.click()}>
                        <i className="fas fa-image me-2"></i> Subir archivo
                    </button>
                    <button type="button" onClick={() => cameraInputRef.current.click()}>
                        <i className="fas fa-camera me-2"></i> Tomar foto
                    </button>
                </div>
            )}

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={uploadImage}
            />
            <input
                type="file"
                accept="image/*"
                capture="user"
                ref={cameraInputRef}
                style={{ display: "none" }}
                onChange={uploadImage}
            />
        </div>
    );
}

export default Cloudinary;