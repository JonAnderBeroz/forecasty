export function getUserLocation(callback: PositionCallback) {
  navigator.geolocation.getCurrentPosition(callback);
}
