import { useLoader } from "../context/loaderContext";


export const fetchWithLoader = async (url, options = {}) => {
  const { showLoader, hideLoader } = useLoader();

  try {
    showLoader();
    const response = await fetch(url, options);
    return response;
  } finally {
    hideLoader();
  }
};
