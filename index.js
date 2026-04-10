const port = process.env.PORT || 8000;
const app = require('./app');
const { connectDB } = require('./config/database');

const startServer = async () => {
    await connectDB();

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

startServer();
