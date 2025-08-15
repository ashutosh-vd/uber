import 'dotenv/config';
import http from "http";
import app from "./app.js";
import connectDB from "./db/db.js";

const PORT= process.env.PORT;

app.get('/', (req, res) => {
  res.send("Hello World")
});

const server = http.createServer(app);
server.listen(PORT, async (err) => {
  if(err) {
    console.log(err);
    return;
  }
  console.log("server connected at port: "+PORT);
  await connectDB();
});