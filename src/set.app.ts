import express, { Express } from "express";

export const setupApp = (app: Express) => {
    app.use(express.json());


    app.get("/", (req, res) => {
        res.status(200).send("FOR TESTS");
    });
    return app;
};