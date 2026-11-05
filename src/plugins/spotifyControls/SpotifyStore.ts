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

import { isPluginEnabled } from "@api/PluginManager";
import OpenInAppPlugin from "@plugins/openInApp";
import { findByProps, findByPropsLazy, proxyLazyWebpack } from "@webpack";
import { Flux, FluxDispatcher } from "@webpack/common";

import { settings } from ".";

export interface Track {
    id: string;
    name: string;
    duration: number;
    isLocal: boolean;
    album: {
        id: string;
        name: string;
        image: {
            height: number;
            width: number;
            url: string;
        };
    };
    artists: {
        id: string;
        href: string;
        name: string;
        type: string;
        uri: string;
    }[];
}

export interface SearchTrack {
    id: string;
    name: string;
    uri: string;
    artists: { name: string; }[];
    album: { images?: { url: string; }[]; };
}

export interface SearchResult {
    items: SearchTrack[];
    total: number;
}

interface PlayerState {
    accountId: string;
    track: Track | null;
    volumePercent: number,
    isPlaying: boolean,
    repeat: boolean,
    position: number,
    context?: any;
    device?: Device;

    // added by patch
    actual_repeat: Repeat;
    shuffle: boolean;
}

interface Device {
    id: string;
    is_active: boolean;
    is_restricted?: boolean;
}

type Repeat = "off" | "track" | "context";

// Don't wanna run before Flux and Dispatcher are ready!
export const SpotifyStore = proxyLazyWebpack(() => {
    // For some reason ts hates extends Flux.Store
    const { Store } = Flux;

    const SpotifySocket = findByProps("getActiveSocketAndDevice");
    const SpotifyAPI = findByPropsLazy("vcSpotifyMarker");

    const API_BASE = "https://api.spotify.com/v1/me/player";

    class SpotifyStore extends Store {
        public mPosition = 0;
        public _start = 0;

        public track: Track | null = null;
        public device: Device | null = null;
        public isPlaying = false;
        public repeat: Repeat = "off";
        public shuffle = false;
        public volume = 0;

        public isSettingPosition = false;

        public openExternal(path: string) {
            const url = settings.store.useSpotifyUris || isPluginEnabled(OpenInAppPlugin.name)
                ? "spotify:" + path.replaceAll("/", (_, idx) => idx === 0 ? "" : ":")
                : "https://open.spotify.com" + path;

            VencordNative.native.openExternal(url);
        }

        // Need to keep track of this manually
        public get position(): number {
            let pos = this.mPosition;
            if (this.isPlaying) {
                pos += Date.now() - this._start;
            }
            return pos;
        }

        public set position(p: number) {
            this.mPosition = p;
            this._start = Date.now();
        }

        prev() {
            this._req("post", "/previous");
        }

        next() {
            this._req("post", "/next");
        }

        setVolume(percent: number) {
            this._req("put", "/volume", {
                query: {
                    volume_percent: Math.round(percent)
                }

            }).then(() => {
                this.volume = percent;
                this.emitChange();
            });
        }

        setPlaying(playing: boolean) {
            this._req("put", playing ? "/play" : "/pause");
        }

        setRepeat(state: Repeat) {
            this._req("put", "/repeat", {
                query: { state }
            });
        }

        setShuffle(state: boolean) {
            this._req("put", "/shuffle", {
                query: { state }
            }).then(() => {
                this.shuffle = state;
                this.emitChange();
            });
        }

        seek(ms: number) {
            if (this.isSettingPosition) return Promise.resolve();

            this.isSettingPosition = true;

            return this._req("put", "/seek", {
                query: {
                    position_ms: Math.round(ms)
                }
            }).catch((e: any) => {
                console.error("[VencordSpotifyControls] Failed to seek", e);
                this.isSettingPosition = false;
            });
        }

        async searchTracks(query: string, offset = 0): Promise<SearchResult> {
            const { socket } = SpotifySocket.getActiveSocketAndDevice();
            if (!socket?.accessToken) throw new Error("Conecte o Spotify ao Discord para buscar músicas.");

            const response = await SpotifyAPI.get(socket.accountId, socket.accessToken, {
                url: "https://api.spotify.com/v1/search",
                query: { q: query.trim(), type: "track", limit: 10, offset }
            });
            const tracks = response?.body?.tracks ?? response?.tracks;
            if (!Array.isArray(tracks?.items)) throw new Error("O Spotify não retornou resultados de busca.");
            return { items: tracks.items, total: tracks.total ?? 0 };
        }

        async playTrack(uri: string) {
            const { socket } = SpotifySocket.getActiveSocketAndDevice();
            if (!socket?.accessToken) throw new Error("Conecte o Spotify ao Discord para controlar a reprodução.");

            const response = await SpotifyAPI.get(socket.accountId, socket.accessToken, {
                url: `${API_BASE}/devices`
            });
            const devices: Device[] = response?.body?.devices ?? response?.devices ?? [];
            const device = devices.find(item => item.is_active);
            if (!device?.id) throw new Error("Nenhum dispositivo Spotify ativo. Abra uma música no Spotify e aperte Play uma vez; depois volte e tente de novo.");
            if (device.is_restricted) throw new Error("O dispositivo Spotify ativo não aceita controle remoto. Escolha outro dispositivo no Spotify.");

            const playback = await SpotifyAPI.put(socket.accountId, socket.accessToken, {
                url: `${API_BASE}/play`,
                query: { device_id: device.id },
                body: { uris: [uri] }
            });
            const status = playback?.status ?? playback?.statusCode;
            if (typeof status === "number" && (status < 200 || status >= 300)) {
                throw new Error(status === 403
                    ? "O Spotify recusou a reprodução. Verifique se a conta conectada ao Discord tem Premium e permissão de reprodução."
                    : `O Spotify recusou a reprodução (erro ${status}). Escolha um dispositivo ativo e tente de novo.`);
            }
            return playback;
        }

        _req(method: "post" | "get" | "put", route: string, data: any = {}) {
            if (this.device?.is_active)
                (data.query ??= {}).device_id = this.device.id;

            const { socket } = SpotifySocket.getActiveSocketAndDevice();
            return SpotifyAPI[method](socket.accountId, socket.accessToken, {
                url: API_BASE + route,
                ...data
            });
        }
    }

    const store = new SpotifyStore(FluxDispatcher, {
        SPOTIFY_PLAYER_STATE(e: PlayerState) {
            store.track = e.track;
            store.device = e.device ?? null;
            store.isPlaying = e.isPlaying ?? false;
            store.volume = e.volumePercent ?? 0;
            store.repeat = e.actual_repeat || "off";
            store.shuffle = e.shuffle ?? false;
            store.position = e.position ?? 0;
            store.isSettingPosition = false;
            store.emitChange();
        },
        SPOTIFY_SET_DEVICES({ devices }: { devices: Device[]; }) {
            store.device = devices.find(d => d.is_active) ?? devices[0] ?? null;
            store.emitChange();
        }
    });

    return store;
});
