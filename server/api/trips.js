import express from "express";
import bodyParser from "body-parser";
import trips from "../db"; 

const app = express();

app.use(bodyParser.json());

const handler = (req, res) => {
  const { query } = req;
  const { keywords } = query;

  if (keywords) {
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
};


export default app;
