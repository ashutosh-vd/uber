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
}