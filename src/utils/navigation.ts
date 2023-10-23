export function getUserLocation(callback: PositionCallback, onError?: PositionErrorCallback) {
  navigator.geolocation.getCurrentPosition(callback, onError);
}
