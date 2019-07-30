import { join } from 'path';
const PORT = process.env.PORT || 8080;
const DATA_FOLDER = join(__dirname, 'data');
const DIST_FOLDER = join(__dirname, 'browser');
export { PORT, DIST_FOLDER, DATA_FOLDER };