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

import jwt from 'jsonwebtoken';
import config from "../config";
import UserModel from "../models/User";

export default {
    validateToken: async (req, res, next) => {
        if (!req.headers.token) {
            res.json({ data: "Invalid token"});
            return;
        }

        const data = await jwt.verify(req.headers.token, config.app.secret);
        const user = await UserModel.findById(data.id);

        if (user === null) {
            res.json({ data: "Invalid token"});
            return;
        }

        req.user = user;
        next();
    }
};
