import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT: string = '3000';

app.listen(PORT, (): void => {
  console.log(`Server listening on ${PORT}`);
});
