const { exec } = require('child_process');
// const { error } = require('console');
// const fs = require('fs');
// const path = require('path');
const { stdout, stderr } = require('process');

// const outputPath = path.join(__dirname, "outputs");

// if (!fs.existsSync(outputPath)) {
//     fs.mkdirSync(outputPath, {recursive: true});
// }

const executePy = (filepath) => {
    
    // const jobId = path.basename(filepath).split('.')[0];
    // const outputPath = path.join(outputPath, `${jobId}`);

    return new Promise((resolve, reject) => {
        exec(`python ${filepath} `, 
                (error, stdout, stderr) => {
                    if (error) {
                        reject({error, stderr});
                    }
                    if (stderr) {
                        reject(stderr);
                    }
                    resolve(stdout);
                }) 
    });
};

module.exports = {
    executePy
}