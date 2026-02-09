
const EARTH_RADIUS_METERS = 6_371_000;


const degreesToRadians = (degrees) => {
  return (degrees * Math.PI) / 180;
};

const getDeltaRadians = (fromDegrees, toDegrees) => {
  return degreesToRadians(toDegrees - fromDegrees);
};

const getAltitudeDifference = (previousPoint, currentPoint) => {
  const previousAltitude = previousPoint?.alt;
  const currentAltitude = currentPoint?.alt;

  if (previousAltitude == null || currentAltitude == null) {
    return 0;
  }

  return currentAltitude - previousAltitude;
};


export const haversineMeters = (pointA, pointB) => {
  const lat1 = degreesToRadians(pointA.lat);
  const lat2 = degreesToRadians(pointB.lat);

  const deltaLat = getDeltaRadians(pointA.lat, pointB.lat);
  const deltaLng = getDeltaRadians(pointA.lng, pointB.lng);

  const sinLat = Math.sin(deltaLat / 2);
  const sinLng = Math.sin(deltaLng / 2);

  const haversine =
    sinLat * sinLat +
    Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(haversine));
};

export const gainLossMeters = (points = []) => {
  return points.slice(1).reduce(
    (result, currentPoint, index) => {
      const previousPoint = points[index];
      const difference = getAltitudeDifference(previousPoint, currentPoint);

      if (difference > 0) {
        result.gain += difference;
      }

      if (difference < 0) {
        result.loss += Math.abs(difference);
      }

      return result;
    },
    { gain: 0, loss: 0 }
  );
};
