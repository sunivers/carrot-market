import { useEffect, useState } from "react";

interface UseCoordsState {
  latitude: number | null;
  longitude: number | null;
}

const useCoords = () => {
  const [coords, setCoords] = useState<UseCoordsState>({
    latitude: null,
    longitude: null,
  });

  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    console.timeEnd("getCurrentPosition");
    setCoords({ latitude, longitude });
  };
  useEffect(() => {
    console.time("getCurrentPosition");
    window.navigator.geolocation.getCurrentPosition(onSuccess);
  }, []);

  return coords;
};

export default useCoords;
