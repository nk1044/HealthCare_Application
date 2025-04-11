import app, { server } from './app.js';
import { connectDB } from './src/config/db.js';
import 'dotenv/config';
import client from 'prom-client';

const port = process.env.PORT || 9000;
const register = new client.Registry();

app.get('/health-check', (req, res) => {
    res.send('Server is running healthy 👍');
});

app.get('/', (req, res) => {
    res.send('Unauthorized route');
});


client.collectDefaultMetrics({ register });
app.get('/metrics', async (req, res) => {
    // Set the correct content type header
    res.setHeader('Content-Type', register.contentType);
    
    // Get all metrics from the registry
    const metrics = await register.metrics();
    
    // Send metrics as response
    res.send(metrics);
  });


connectDB()
    .then(async () => {

        server.listen(port,'0.0.0.0', () => {
            console.log(`Server is listening on port ${port}`);
        });
    })
    .catch((error) => {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    });
