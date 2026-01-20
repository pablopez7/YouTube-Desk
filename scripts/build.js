const builder = require('electron-builder');
const Platform = builder.Platform;

async function build() {
    try {
        console.log('Building Electron app...');

        const result = await builder.build({
            targets: Platform.WINDOWS.createTarget(),
            config: {
                appId: "com.youtube.desktop",
                productName: "YouTube Desktop",
                directories: {
                    output: "release"
                },
                win: {
                    target: "nsis",
                    icon: "resources/icon.ico",
                    signAndEditExecutable: false
                },
                nsis: {
                    oneClick: false,
                    allowToChangeInstallationDirectory: true,
                    artifactName: "${productName}-${version}-Setup.${ext}",
                    deleteAppDataOnUninstall: true
                },
                files: [
                    "dist-electron/**/*",
                    "dist/**/*",
                    "resources/**/*"
                ],
                publish: {
                    provider: "github",
                    owner: "pablopez7",
                    repo: "YouTube-Desk"
                }
            }
        });

        console.log('Build completed successfully!', result);
    } catch (err) {
        console.error('Error during build:', err);
        process.exit(1);
    }
}

build();
