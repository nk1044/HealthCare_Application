import app, { server } from './app.js';
import { connectDB } from './src/config/db.js';
import 'dotenv/config';

const port = process.env.PORT || 3000;


app.get('/health-check', (req, res) => {
    res.send('Server is running healthy 👍');
});
connectDB()
    .then(async () => {

        server.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    })
    .catch((error) => {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    });
