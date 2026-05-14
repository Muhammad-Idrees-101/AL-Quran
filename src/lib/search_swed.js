const fs = require('fs');

const filePath = 'C:\\Users\\pc\\.gemini\\antigravity\\brain\\db99b6c3-fadf-4cd6-a5e5-72d251c31151\\.system_generated\\steps\\62\\content.md';

try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let jsonStr = '';
    for (const line of lines) {
        if (line.trim().startsWith('{"reciters"')) {
            jsonStr = line.trim();
            break;
        }
    }

    if (jsonStr) {
        const data = JSON.parse(jsonStr);
        const reciters = data.reciters;
        
        const results = reciters.filter(r => r.name.toLowerCase().includes('swed') || r.name.toLowerCase().includes('swid'));
        
        for (const res of results) {
            console.log(`Name: ${res.name}`);
            for (const m of res.moshaf) {
                console.log(`Moshaf: ${m.name}`);
                console.log(`Server: ${m.server}`);
            }
            console.log("--------------------");
        }
    } else {
        console.log("JSON string not found");
    }
} catch (err) {
    console.error(err);
}
