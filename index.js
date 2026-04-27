const dotenv = require('dotenv');
dotenv.config({ path: './.config.env' });

const app = require('./app');

const port = process.env.PORT || 3000;

require('./config/db');

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
