import { join } from 'path';
const PORT = process.env.PORT || 8080;
const DIST_FOLDER = join(__dirname, 'browser');
const ARCHIVE_PATH = join(__dirname, '..', 'data.zip');
export { PORT, DIST_FOLDER, ARCHIVE_PATH };