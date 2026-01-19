// Script para convertir Youtube.webp a icon.png
import sharp from 'sharp';

async function convertIcon() {
    try {
        await sharp('Youtube.webp')
            .resize(256, 256)
            .png()
            .toFile('resources/icon.png');
        console.log('✓ Converted to resources/icon.png');
    } catch (error) {
        console.error('Error:', error);
    }
}

convertIcon();
