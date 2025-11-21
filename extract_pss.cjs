const AdmZip = require('adm-zip');
const fs = require('fs');

console.log('Extracting private school data...');

try {
    const zip = new AdmZip('/tmp/pss2122_pu_csv.zip');
    zip.extractAllTo('/tmp/', true);
    console.log('Extraction complete!');

    // List extracted files
    const files = fs.readdirSync('/tmp/').filter(f => f.includes('pss') || f.includes('PSS'));
    console.log('Extracted files:');
    files.forEach(f => console.log('  ', f));
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
