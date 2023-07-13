const express = require('express');
const { generateFile } = require('./generateFile');
const { executePy } = require('./executePy');
const cors = require('cors');

const app = express();

app.use(cors( ));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req, res) => {
    return res.json({hello: "world"});
});

app.post('/run', async (req, res) => {
    const { language , code } = req.body;

    if (code === undefined) {
        return res.status(400).json({success: false, error: "Empty code body!"});
    }

    if (language === undefined) {
        return res.status(400).json({success: false, error: "No language provided!"});
    }

    // const filepath = '', output = '';

    try {
        filepath = await generateFile(language, code);
        output = await executePy(filepath);
        return res.json({ filepath, output });
    } catch (err) {
        res.status(500).json({err});
    }

});

app.listen(5000, () => {
    console.log("listening on port 5000!");
});