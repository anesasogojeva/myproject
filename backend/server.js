require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/mysql');
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5000;



const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

require("./src/sockets/chatSocket")(io);

// Sync DB and start server
sequelize.sync({ alter: false }).then(() => {
    console.log("Database synced");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); //→ Starts the backend on http://localhost:5000
}).catch(err => console.log(err));
 
//sequelize.sync({ alter: true }) will create/update the MySQL table automatically.
//  You don’t need to write SQL manually.