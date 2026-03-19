import express from 'express';
import {SETTINGS} from "./settings";
import {runDB} from "./repositories/db/db";
import {setupApp} from "./app";


const bootstrap = async () => {
    const app = express();
    setupApp(app);
    const PORT = SETTINGS.PORT;

    await runDB('mongodb://127.0.0.1:27017');

    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`);
    });
    return app;
};

bootstrap();