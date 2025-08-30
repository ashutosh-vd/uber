export async function searchPlace(query) {
  if (!query || !query.trim()) {
    console.warn("Empty search query");
    return [];
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );
    const data = await res.json();

    // Return an array of places with name + coordinates
    return data.map(place => ({
      name: place.display_name,
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon)
    }));
  } catch (err) {
    console.error("Error fetching location:", err);
    return [];
  }
}

// searchPlace("Koramangala, Bengaluru").then(results => {
//   console.log(results);
// });
  // [
  //   { name: "New York, United States", lat: 40.7127281, lon: -74.0060152 }
  // ]