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
import SnapModel from "./models/Snap";
import crypto from 'crypto';

(async () => {
    await mongoose.connect(`${config.database.url}${config.database.name}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const app = express();
    app.use(express.json({ limit: '8mb', extended: true}));
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    app.post("/register", async (req, res) => {
        if (!req.body.email || !req.body.password) {
            await res.json({data: "Missing parameters"});
            return;
        }

        try {
            let hashedPassword = crypto.createHash('sha256')
                .update(req.body.password).digest('hex');
            const user = await UserModel.create({
                email: req.body.email,
                password: hashedPassword
            });
            await res.json({data: {email: user.email}});
        } catch (err) {
            await res.json({data: err.toString()});
        }
    });

    app.post("/login", async (req, res) => {
        if ((!req.body.email || !req.body.password) && (!req.body.token)) {
            res.json({data: "Missing parameters"});
            return;
        }
        if (req.body.token) {
            try {
                const userData = await jwt.verify(req.body.token, config.app.secret);
                await res.json({data: {email: userData.email, token: req.body.token}});
            } catch (err) {
                await res.json({data: "Invalid token."});
            }
        } else {
            let hashedPassword = crypto.createHash('sha256')
                .update(req.body.password).digest('hex');
            const user = await UserModel.findOne({
                email: req.body.email,
                password: hashedPassword
            });

            if (!user) {
                await res.json({data: "Invalid credentials."});
                return;
            }

            await res.json({
                data: {
                    email: user.email,
                    token: jwt.sign({id: user.id, email: user.email}, config.app.secret)
                }
            });
        }
    });

    app.get("/all", middleware.validateToken, async (req, res) => {
        try {
            const allUsers = await UserModel.find({ email: { $ne: req.user.email }});
            await res.json({
                data: allUsers.map((elem) => {
                    return {email: elem.email}
                })
            });
        } catch(err) {
            await res.json({
                data: err.toString()
            });
        }
    });

    app.post("/snap", middleware.validateToken, (req, res) => {
        try {
            const snap = SnapModel.create({
                from: req.user.email,
                to: req.body.to,
                duration: req.body.duration,
                file: Buffer.from(req.body.image, 'base64'),
                title: req.body.title
            });

            return res.json({data: 'Snap Created'});
        } catch (err) {
            return res.json({data: err.toString()});
        }
    });

    app.get("/snap/:id", middleware.validateToken, async (req, res) => {
        const snap = await SnapModel.findById(req.params.id);

        if (snap !== null) {
            const buffer = Buffer.from(snap.file).toString('base64');
            await res.json({duration: snap.duration, buffer: buffer});
        }
        else {
            await res.json({data: "Snap not found."});
        }
    });

    app.get("/snaps", middleware.validateToken, async (req, res) => {
        const allSnaps = await SnapModel.find({ to: req.user.email });
        const data = allSnaps.map((elem) => {
            return {
                snap_id: elem._id,
                from: elem.from,
                title: elem.title
            }
        });
        await res.json({ data: data });
    });

    app.post("/seen", middleware.validateToken, async (req, res) => {
        const currentSnapId = new mongoose.Types.ObjectId(req.body.snap_id);
        const snapToDelete = await SnapModel.findById(currentSnapId);

        try {
            if (snapToDelete === null) {
                await res.json({data: "Snap not found"});
            } else {
                await snapToDelete.remove();
                await res.json({data: "Snap deleted"});
            }
        } catch (err) {
            await res.json({data: "An error occurred"});
        }
    });

    app.listen(4242, () => {
        console.log("Server has been started successfully.");
    });
})();
