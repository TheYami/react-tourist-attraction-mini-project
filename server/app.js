import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import trips from "./db.js";

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.get("/trips", (req, res) => {
  const keywords = req.query.keywords;

  if (keywords !== undefined) {
      const regexKeywords = keywords.split(" ").join("|");
      const regex = new RegExp(regexKeywords, "ig");
      const results = trips.filter((trip) => {
          return (
              trip.title.match(regex) ||
              trip.description.match(regex) ||
              trip.tags.some(tag => tag.match(regex))
          );
      });
      return res.json({ data: results });
  }

  // ถ้าไม่มี keywords ให้ส่งข้อมูลทั้งหมด
  return res.json({ data: trips });
});


app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
