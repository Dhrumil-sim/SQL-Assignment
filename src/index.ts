import dotenv from 'dotenv';
import connectDB from './db/index'; // now it's a proper TS module
import app from './app';

dotenv.config();

const PORT = process.env['PORT'] || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running at: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ PostgreSQL connection failed!', err); // ✅ updated
  });
