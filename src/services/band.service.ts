import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

const DB = process.env.DB_URI || "";
const mongoClient = new MongoClient(DB);

export async function authBand(bandname: string, password: string): Promise<any> {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("metal_crypt_data");
    const bands = db.collection('band')
    const band = await bands.findOne({ bandname: bandname });

    if (!band) {
      throw new Error('User not found');
    }

    const isValid = await bcrypt.compare(password, band.password);

    if (!isValid) {
      throw new Error('Wrong userband or password');
    }

    return {
      band_id: band._id,
      bandname: band.bandname,
      genre: band.genre,
      themes: band.themes,
      logoBand: band.logoBand,
      formedDate: band.formedDate,
      socialLinks: band.socialLinks
    }

  } finally {
    mongoClient.close();
  }
}
