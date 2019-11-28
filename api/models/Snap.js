/*       __   __________  ________________________  __   _
       _/_/  / ____/ __ \/  _/_  __/ ____/ ____/ / / /  | |
     _/_/   / __/ / /_/ // /  / / / __/ / /   / /_/ /   / /
    < <    / /___/ ____// /  / / / /___/ /___/ __  /   _>_>
    / /   /_____/_/   /___/ /_/ /_____/\____/_/ /_/  _/_/
    \_\         Web@cadémie Lille 2019-2021         /_/

    Project:        my_snapchat
    Author:         Mérill Téterel <merill.teterel@epitech.eu>
    Date Created:   28 Nov 2019
*/

import mongoose from 'mongoose';

export default mongoose.model('Snap', {
    from: { type: String, required: true },
    to: { type: String, required: true },
    duration: { type: Number, required: true },
    file: { type: Buffer, required: true }
});
