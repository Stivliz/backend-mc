import 'dotenv/config'
import mongoose from "mongoose"
import {scheduleScraping } from './services/scheduler.service'

const DB = process.env.DB_URI || ""

// const DB_DEP = process.env.DB_DEPLOY

const db = () => {
    const connect = () => {
        mongoose.connect(DB, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
          })
            .then(() => {
              console.log('Connection success');
              scheduleScraping();
            })
            .catch(error => {
              console.error('Connection fail', error);
            });
    }
    connect();
}

export default db;