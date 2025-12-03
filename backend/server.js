require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/mysql');

const PORT = process.env.PORT || 5000;

// Sync DB and start server
sequelize.sync({ alter: true }).then(() => {
    console.log("Database synced");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); //→ Starts the backend on http://localhost:5000
}).catch(err => console.log(err));
 
//sequelize.sync({ alter: true }) will create/update the MySQL table automatically.
//  You don’t need to write SQL manually.