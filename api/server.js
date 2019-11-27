/*       __   __________  ________________________  __   _
       _/_/  / ____/ __ \/  _/_  __/ ____/ ____/ / / /  | |
     _/_/   / __/ / /_/ // /  / / / __/ / /   / /_/ /   / /
    < <    / /___/ ____// /  / / / /___/ /___/ __  /   _>_>
    / /   /_____/_/   /___/ /_/ /_____/\____/_/ /_/  _/_/
    \_\         Web@cadémie Lille 2019-2021         /_/

    Project:        my_snapchat
    Authors:        Mérill Téterel <merill.teterel@epitech.eu>
                    Emilie Lépine <emilie.lepine@epitech.eu>
    Date Created:   26 Nov 2019
*/

import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import middleware from "./middleware";
import config from "./config/index";
import UserModel from "./models/User";
import cors from 'cors';

(async () => {
    await mongoose.connect(`${config.database.url}${config.database.name}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    app.post("/register", async (req, res) => {
        if (!req.body.email || !req.body.password) {
            res.json({ data: "Missing parameters" });
            return;
        }

        try {
            const user = await UserModel.create({
                email: req.body.email,
                password: req.body.password
            });
            res.json({ data: { email: user.email } });
        } catch (err) {
            res.json({ data: err.toString() });
        }
    });

    app.post("/login", async (req, res) => {
        console.log(req.body);

        if (!req.body.email || !req.body.password) {
            res.json({ data: "Missing parameters" });
            return;
        }

        const user = await UserModel.findOne({
            email: req.body.email,
            password: req.body.password
        });

        if (!user) {
            res.json({ data: "Invalid credentials." });
            return;
        }

        res.json({
            data: {
                email: user.email,
                token: jwt.sign({ id: user.id, email: user.email }, config.app.secret)
            }
        });
    });

    app.get("/all", middleware.validateToken, (req, res) => {});
    app.post("/snap", (req, res) => {});
    app.get("/snap/:id", middleware.validateToken, (req, res) => {});
    app.get("/snaps", middleware.validateToken, (req, res) => {});
    app.post("/seen", middleware.validateToken, (req, res) => {});

    app.listen(4242, () => {
        console.log("Server has been started successfully.");
    });
})();
