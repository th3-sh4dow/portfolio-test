const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'hero-intro');

fs.readdir(dir, (err, files) => {
    if (err) {
        console.error("Could not list directory", err);
        process.exit(1);
    }

    // Filter only jpeg files
    const jpegFiles = files.filter(f => f.endsWith('.jpeg'));

    // Sort them based on the number at the start
    jpegFiles.sort((a, b) => {
        const numA = parseInt(a.split('_')[0]);
        const numB = parseInt(b.split('_')[0]);
        return numA - numB;
    });

    console.log(`Found ${jpegFiles.length} files. Renaming...`);

    jpegFiles.forEach((file, index) => {
        const oldPath = path.join(dir, file);
        // New index 1-based, padded to 3 digits (e.g. 001)
        // Wait, let's use 4 digits just in case we go over 1000 properly in future, or stick to user's 3?
        // User had 900 frames. 3 digits is fine (999). But let's verify if we have >999. No, 720.
        // Let's use 4 digits to be safe and standard.
        const newName = `frame-${String(index + 1).padStart(4, '0')}.jpeg`;
        const newPath = path.join(dir, newName);

        // Don't overwrite if it's already named correctly (though likely not conflicting given the _ suffix)
        if (file !== newName) {
            fs.renameSync(oldPath, newPath);
        }
    });

    console.log("Renaming complete.");
});
