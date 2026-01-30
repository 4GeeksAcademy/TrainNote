import { useEffect, useRef } from "react";

const CloudinaryUploadWidget = ({ uwConfig, setPublicId }) => {
  const widgetRef = useRef(null);

  useEffect(() => {
    if (!window.cloudinary) {
      console.error("Cloudinary script no cargado");
      return;
    }

    widgetRef.current = window.cloudinary.createUploadWidget(
      uwConfig,
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Upload successful:", result.info);
          setPublicId(result.info.public_id);
        }
      }
    );
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  return (
    <button
      id="upload_widget"
      className="cloudinary-button"
      type="button"
      onClick={handleClick}
    >
      Upload
    </button>
  );
};

export default CloudinaryUploadWidget;
