import app from './app';
import sequelize from './models';

const PORT = process.env.PORT || 5000;

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
