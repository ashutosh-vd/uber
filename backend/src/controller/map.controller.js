export const suggestionGenerator = async (req, res) => {
  try {
    const { query } = req.body;
    if(!query) {
      return res.status(400).json({"message": "query required."});
    }
    const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=4`);
    const data = await response.json();
    // console.log("data",data);
    res.status(201).json(data);
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
    const response = await fetch(`http://router.project-osrm.org/route/v1/driving/${pickupLat},${pickupLon};${dropLat},${dropLon}?overview=full&geometries=geojson`);
    const data = await response.json();
    res.status(201).json(data);
  }
  catch {
    console.error("dotted route generator error");
    res.status(500).json({"message": "Internal Server Error."});
  }
};