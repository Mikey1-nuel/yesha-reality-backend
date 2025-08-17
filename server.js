import express from "express";
import cors from "cors";
import path from "path";
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url';
import logger from './middleware/logger.js';
import errorHandler from './middleware/error.js';
import notFound from './middleware/notFound.js';
import properties from './routes/properties.js';
import agents from './routes/agents.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/properties', properties);
app.use('/agents', agents);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//Logger Middleware
app.use(logger);

//Error Handler
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
