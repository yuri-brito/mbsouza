import mongoose from "mongoose";

async function connect() {
  try {
    const dbConnect = await mongoose.connect(process.env.MONGODB_URI, {
      authSource: "admin",
      user: process.env.MONGO_ROOT_USER,
      pass: process.env.MONGO_ROOT_PASS,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`conectado ao nosso DB:${dbConnect.connection.name}`);
  } catch (error) {
    console.log(error);
  }
}
export default connect;
