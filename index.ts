import app from './app';
import { PORT } from './config/config';
import sequelize from './models';

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database initialized');
    app.listen(PORT);
    console.log(`Server listening on http://localhost:${PORT}/`);
  } catch (error) {
    console.error(error);
  }
};

main();
