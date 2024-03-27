/* eslint-disable @typescript-eslint/no-unused-vars -- Remove me */
import 'dotenv/config';
import pg from 'pg';
import express from 'express';
import { ClientError, errorMiddleware } from './lib/index.js';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});

app.get('/api/entries', async (req, res, next) => {
  try {
    const sql = `
      select *
        from "entries"
        order by "entryId"
    `;

    const getAllEntries = await db.query(sql);
    res.json(getAllEntries.rows);
  } catch (err) {
    next(err);
  }
});

app.post('/api/entries', async (req, res, next) => {
  try {
    const { title, notes, photoUrl } = req.body;
    const sql = `
      insert into "entries" ("title", "notes", "photoUrl")
      values ($1, $2, $3)
      returning *
    `;

    const params = [title, notes, photoUrl];
    const newEntryAdded = await db.query(sql, params);
    res.json(newEntryAdded.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.put('/api/entries/:entryId', async (req, res, next) => {
  try {
    const entryId = Number(req.params.entryId);
    const { title, notes, photoUrl } = req.body;
    const sql = `
      update "entries"
        set "title" = $1,
            "notes" = $2,
            "photoUrl" = $3
        where "entryId" = $4
        returning *
    `;
    const params = [title, notes, photoUrl, entryId];
    const editedEntry = await db.query(sql, params);
    res.json(editedEntry.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/entries/:entryId', async (req, res, next) => {
  try {
    const entryId = Number(req.params.entryId);
    const sql = `
      Delete from "entries"
        where "entryId" = $1
    `;
    const params = [entryId];
    const deleteEntry = await db.query(sql, params);
    res.json(deleteEntry.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);
