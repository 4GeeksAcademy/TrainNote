import { useLoader } from "../context/loaderContext";

const MIN_LOADING_TIME = 700; // ms (ajústalo a tu gusto)

export const useFetchWithLoader = () => {
  const { showLoader, hideLoader } = useLoader();

  const fetchWithLoader = async (url, options = {}) => {
    const startTime = Date.now();

    try {
      showLoader();
      const response = await fetch(url, options);
      return response;
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = MIN_LOADING_TIME - elapsedTime;

      if (remainingTime > 0) {
        setTimeout(() => {
          hideLoader();
        }, remainingTime);
      } else {
        hideLoader();
      }
    }
  };

  return fetchWithLoader;
};
