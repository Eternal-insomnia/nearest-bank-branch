navigator.geolocation.getCurrentPosition((position) => {
    console.log("Your current position", position.coords.latitude, position.coords.longitude);
  });