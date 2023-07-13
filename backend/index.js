const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { generateFile } = require('./generateFile');
const { executePy } = require('./executePy');
const Job = require('./models/Jobs')

mongoose.connect("mongodb://localhost/mern").
    catch(err => handleError(err));

const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/status', async (req, res) => {
    const jobId = req.query.id;
    console.log('status requested', jobId);

    if (jobId === undefined) {
        return res.status(400).json({success: false, error: 'Missing query ID'});
    }

    try {
        const job = await Job.findById(jobId);
        if (job === undefined) {
            return res.status(404).json({success: false, error: 'invalid job Id'});
        }

        return res.status(200).json({success: true, job});
    } catch (err) {
        return res.status(400).json({success: true, error: JSON.stringify(err)});
    }
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

    let job;

    try {
        filepath = await generateFile(language, code);

        job = await new Job({language, filepath}).save();
        const jobId = job['_id'];
        console.log(job);

        res.status(201).json({success: true, jobId});

        job['startedAt'] = new Date();

        output = await executePy(filepath);

        job['completedAt'] = new Date();
        job['status'] = 'success';
        job['output'] = output;

        await job.save();
        console.log(job);
        // return res.json({ filepath, output });
    } catch (err) {
        job['completedAt'] = new Date();
        job['status'] = 'error';
        job['output'] = JSON.stringify(err);
        await job.save();
        console.log(job);
        // res.status(500).json({err});
    }

});

app.listen(5000, () => {
    console.log("listening on port 5000!");
});