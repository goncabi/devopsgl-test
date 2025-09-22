const url = process.argv[2];
if (!url) {
    console.error('Usage: node check_remote.js <url>');
    process.exit(2);
}

(async () => {
    try {
        const res = await fetch(url); // Node 18+ hat fetch
        const text = await res.text();

        if (res.status !== 200) {
            console.error('HTTP Status != 200:', res.status);
            process.exit(1);
        }
        if (text.trim() !== 'Hello World v3 ') {
            console.error('Unexpected body:', text);
            process.exit(1);
        }
        console.log('Integration test passed');
        process.exit(0);
    } catch (err) {
        console.error('Integration test failed:', err);
        process.exit(1);
    }
})();
