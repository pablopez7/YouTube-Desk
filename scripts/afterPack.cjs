/**
 * afterPack hook for electron-builder
 * Uses resedit to embed the icon in the .exe without requiring winCodeSign
 */
const fs = require('fs');
const path = require('path');

exports.default = async function (context) {
    // Only run for Windows builds
    if (process.platform !== 'win32' && context.electronPlatformName !== 'win32') {
        console.log('[afterPack] Skipping icon embedding - not a Windows build');
        return;
    }

    const exePath = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.exe`);
    const iconPath = path.resolve(__dirname, '..', 'build', 'icon.ico');

    if (!fs.existsSync(exePath)) {
        console.log('[afterPack] Executable not found:', exePath);
        return;
    }

    if (!fs.existsSync(iconPath)) {
        console.log('[afterPack] Icon not found:', iconPath);
        return;
    }

    console.log('[afterPack] Embedding icon into:', exePath);
    console.log('[afterPack] Using icon:', iconPath);

    try {
        // Dynamic import for ESM module
        const resedit = await import('resedit');

        // Read the executable
        const exeBuffer = fs.readFileSync(exePath);
        const exe = resedit.NtExecutable.from(exeBuffer);
        const res = resedit.NtExecutableResource.from(exe);

        // Read the icon file
        const iconBuffer = fs.readFileSync(iconPath);
        const iconFile = resedit.Data.IconFile.from(iconBuffer);

        // Replace the icon (resId 1 is the main app icon)
        resedit.Resource.IconGroupEntry.replaceIconsForResource(
            res.entries,
            1, // resource ID
            1033, // language (English US)
            iconFile.icons.map((icon) => icon.data)
        );

        // Write back to the executable
        res.outputResource(exe);
        const newExeBuffer = exe.generate();
        fs.writeFileSync(exePath, Buffer.from(newExeBuffer));

        console.log('[afterPack] Icon successfully embedded!');
    } catch (error) {
        console.error('[afterPack] Failed to embed icon:', error.message);
        // Don't fail the build, just warn
    }
};
