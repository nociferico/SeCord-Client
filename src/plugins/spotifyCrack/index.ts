/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { definePluginSettings, migratePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

migratePluginSettings("SpotifySemPausa", "SpotifyCrack");

const settings = definePluginSettings({
    noSpotifyAutoPause: {
        description: "Disable Spotify auto-pause",
        type: OptionType.BOOLEAN,
        default: true,
        restartNeeded: true
    },
    keepSpotifyActivityOnIdle: {
        description: "Keep Spotify activity playing when idling",
        type: OptionType.BOOLEAN,
        default: false,
        restartNeeded: true
    }
});

export default definePlugin({
    name: "SpotifySemPausa",
    description: "Prevent the client from pausing Spotify during voice chat",
    tags: ["Media", "Utility", "Activity"],
    authors: [Devs.Cyn, Devs.Nuckyz],
    settings,

    patches: [
        {
            find: "}getPlayableComputerDevices(){",
            replacement: [
                {
                    predicate: () => settings.store.noSpotifyAutoPause,
                    match: /(?<=function \i\(\){)(?=.{0,200}SPOTIFY_AUTO_PAUSED\))/,
                    replace: "return;"
                },
                {
                    predicate: () => settings.store.keepSpotifyActivityOnIdle,
                    match: /(shouldShowActivity\(\){.{0,50})&&!\i\.\i\.isIdle\(\)/,
                    replace: "$1"
                }
            ]
        }
    ]
});
