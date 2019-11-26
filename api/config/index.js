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

export default {
    app: {
        hostname: "localhost",
        port: 4242,
        secret: "hello world :)"
    },
    database: {
        url: "mongodb://localhost:27042/",
        name: "snapchat"
    }
};
