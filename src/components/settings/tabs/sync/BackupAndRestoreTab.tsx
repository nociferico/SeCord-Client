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

import { downloadSettingsBackup, uploadSettingsBackup } from "@api/SettingsSync/offline";
import { Button } from "@components/Button";
import { Card } from "@components/Card";
import { Flex } from "@components/Flex";
import { Heading } from "@components/Heading";
import { Paragraph } from "@components/Paragraph";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { Text } from "@components/Text";
import { Margins } from "@utils/margins";

function BackupAndRestoreTab() {
    return (
        <SettingsTab>
            <Flex flexDirection="column" gap="0.5em">
                <Card variant="warning">
                    <Heading tag="h4">Atenção</Heading>
                    <Paragraph>Importar um arquivo substituirá seus ajustes atuais.</Paragraph>
                </Card>

                <Paragraph size="md" className={Margins.bottom8}>
                    Você pode importar e exportar seus ajustes do SeCord em um arquivo JSON.
                    Isso permite levar os ajustes a outro dispositivo ou recuperá-los após reinstalar o SeCord.
                </Paragraph>

                <Heading tag="h4">O arquivo exportado contém:</Heading>
                <Text size="md" className={Margins.bottom8}>
                    <ul>
                        <li>&mdash; Custom QuickCSS</li>
                        <li>&mdash; Theme Links</li>
                        <li>&mdash; Plugin Settings</li>
                    </ul>
                </Text>

                <Flex>
                    <Button onClick={() => uploadSettingsBackup()}>
                        Import Settings
                    </Button>
                    <Button onClick={downloadSettingsBackup}>
                        Export Settings
                    </Button>
                </Flex>
            </Flex>
        </SettingsTab >
    );
}

export default wrapTab(BackupAndRestoreTab, "Backup & Restore");
