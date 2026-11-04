/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { openNotificationLogModal } from "@api/Notifications/notificationLog";
import { useSettings } from "@api/Settings";
import { Divider } from "@components/Divider";
import { FormSwitch } from "@components/FormSwitch";
import { Heading } from "@components/Heading";
import { FolderIcon, GithubIcon, LogIcon, PaintbrushIcon, RestartIcon } from "@components/Icons";
import { QuickAction, QuickActionCard } from "@components/settings/QuickAction";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import NoTrack from "@plugins/_core/noTrack";
import { gitRemote } from "@shared/vencordUserAgent";
import { IS_WINDOWS } from "@utils/constants";
import { Margins } from "@utils/margins";
import { relaunch } from "@utils/native";
import { promptToRestart } from "@utils/promptToRestart";

import { NociCordHome } from "../../../../nocicord/Home";
import { MacOSVibrancySettings } from "./MacVibrancySettings";
import { NotificationSection } from "./NotificationSettings";
import { WindowsMaterialSettings } from "./WindowsMaterialSettings";

type KeysOfType<Object, Type> = {
    [K in keyof Object]: Object[K] extends Type ? K : never;
}[keyof Object];

function Switches() {
    const settings = useSettings(["useQuickCss", "enableReactDevtools", "nativeTitleBar", "transparent", "winCtrlQ", "disableMinSize"]);
    const { disableAnalytics } = NoTrack.settings.use(["disableAnalytics"]);

    const switches = [
        {
            key: "useQuickCss",
            title: "CSS personalizado",
            description: "Aplica o CSS que você configurou no editor."
        },
        {
            value: disableAnalytics,
            updateSetting(newValue) {
                NoTrack.settings.store.disableAnalytics = newValue;
            },
            reactKey: "NoTrack::disableAnalytics",
            key: null!,
            title: "Bloquear análises do Discord",
            description: NoTrack.settings.def.disableAnalytics.description,
            restartRequired: NoTrack.settings.def.disableAnalytics.restartNeeded
        },
        IS_DISCORD_DESKTOP && {
            key: "nativeTitleBar",
            title: "Barra de título do Windows",
            restartRequired: true
        },
        !IS_WEB && {
            key: "transparent",
            title: "Janela transparente",
            description: "Precisa de um tema compatível e impede redimensionar a janela.",
            restartRequired: true
        },
        IS_DISCORD_DESKTOP && {
            key: "disableMinSize",
            title: "Permitir janela menor",
            restartRequired: true
        },
        !IS_WEB && IS_WINDOWS && {
            key: "winCtrlQ",
            title: "Fechar com Ctrl+Q",
            restartRequired: true
        },
        !IS_WEB && {
            key: "enableReactDevtools",
            title: "Ferramentas de desenvolvimento React",
            description: "Para quem cria e depura plugins.",
            restartRequired: true
        }
    ] satisfies Array<false | {
        key: KeysOfType<typeof settings, boolean>;
        reactKey?: string;
        title: string;
        description?: string;
        restartRequired?: boolean;
        updateSetting?(newValue: boolean): void;
        value?: boolean;
    }>;

    return switches.map(setting => {
        if (!setting) return null;

        const { reactKey, key, value, title, description, restartRequired, updateSetting = v => (settings[key] = v) } = setting;
        return (
            <FormSwitch
                key={reactKey ?? key}
                title={title}
                description={description}
                value={value ?? settings[key]}
                hideBorder
                onChange={v => {
                    updateSetting(v);
                    if (restartRequired) promptToRestart("relaunch");
                }}
            />
        );
    });
}

function NociCordSettings() {
    return (
        <SettingsTab>
            <NociCordHome />
            <section className="vc-nocicord-tools">
                <Heading className={Margins.bottom8}>Ferramentas</Heading>
                <QuickActionCard>
                    <QuickAction Icon={LogIcon} text="Histórico de avisos" action={openNotificationLogModal} />
                    <QuickAction Icon={PaintbrushIcon} text="Editar CSS" action={() => VencordNative.quickCss.openEditor()} />
                    {!IS_WEB && (
                        <>
                            <QuickAction Icon={RestartIcon} text="Reiniciar Discord" action={relaunch} />
                            <QuickAction Icon={FolderIcon} text="Pasta de ajustes" action={() => VencordNative.settings.openFolder()} />
                        </>
                    )}
                    <QuickAction Icon={GithubIcon} text="Código de origem" action={() => VencordNative.native.openExternal("https://github.com/" + gitRemote)} />
                </QuickActionCard>
            </section>

            <Divider />

            <section className={Margins.top16}>
                <Heading className={Margins.bottom8}>Preferências técnicas</Heading>
                <div className="vc-settings-switches"><Switches /></div>
            </section>

            <MacOSVibrancySettings />
            <WindowsMaterialSettings />
            <NotificationSection />
        </SettingsTab>
    );
}

export default wrapTab(NociCordSettings, "SeCord");
