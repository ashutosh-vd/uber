export const suggestionGenerator = async (req, res) => {
  try {
    const { query } = req.body;
    if(!query) {
      return res.status(400).json({"message": "query required."});
    }
    const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=4`);
    const data = await response?.json();
    const cleanedData = data?.features?.map((feature) => {
      return {
        "name": feature?.properties?.name + ", " + feature?.properties?.country + ", " + feature?.properties?.state,
        "lat": feature?.geometry?.coordinates[1],
        "lon": feature?.geometry?.coordinates[0],
      }
    })
    // console.log("data",data);
    res.status(201).json(cleanedData);
  }
  catch {
    console.error("suggestion generator error");
    res.status(500).json({"message": "Internal Server Error."});
  }
};

export const dottedRouteGenerator = async (req, res) => {
  const {pickupLat, pickupLon, dropLat, dropLon} = req.body;
  if(!pickupLat || !pickupLon || !dropLat || !dropLon) {
    return res.status(400).json({"message": "pickupLat, pickupLon, dropLat, dropLon required."});
  }
  try {
    const response = await fetch(`http://router.project-osrm.org/route/v1/driving/${pickupLon},${pickupLat};${dropLon},${dropLat}?overview=full&geometries=geojson`);
    const data = await response.json();
    const routes = data?.routes?.map((route) => {
      return {
        "duration": route?.duration,
        "distance": route?.distance,
        "geometry": route?.geometry
      }
    });
    res.status(201).json(routes);
  }
  catch {
    console.error("dotted route generator error");
    res.status(500).json({"message": "Internal Server Error."});
  }
};