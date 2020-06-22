import app from "./app"

import {PORT} from './config/port';

app.listen(PORT, () => {
    console.log(`'Express server listening on port ${PORT}!`);
})
