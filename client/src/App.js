import axios from 'axios'
import './App.css';
import React, { useState } from 'react';

function App() {

  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('');
  const [jobId, setJobId] = useState('');

  const handleSubmit = async () => {

    const payload = {
      language: 'py',
      code
    };

    try {
      setJobId('');
      setStatus('');
      setOutput('');
      const { data } = await axios.post("http://localhost:5000/run", payload);
      console.log(data);
      setJobId(data.jobId);
      let intevalId;

      intevalId = setInterval(async () => {
        const { data: dataRes } = await axios.get('http://localhost:5000/status', { params: { id: data.jobId } });
        const {success, job, error} = dataRes;
        console.log(dataRes);

        if (success) {
          const {status: jobStatus, output: jobOutput} = job;
          setStatus(jobStatus);
          if (jobStatus === 'pending') return;
          setOutput(jobOutput);
          clearInterval(intevalId);
        } else {
          setStatus('Error: Please retry!');
          console.error(error);
          clearInterval(intevalId);
          setOutput(error);
        }

        console.log(dataRes);

      }, 1000);

    } catch ({ response }) {
      const errMsg = response.data.err.stderr;
      if (response) setOutput(errMsg);
      else setOutput('Error connecting to server!');
    }
  }

  return (
    <div className="App">
      <h1>Judge0 clone</h1>
      <textarea rows='20' cols='75' value={code} onChange={(e) => { setCode(e.target.value) }}></textarea>
      <br />
      <button onClick={handleSubmit}>Submit</button>
      <br />
      <p>{status}</p>
      <p>{jobId && `JobID: ${jobId}`}</p>
      <p> {output} </p>
    </div>
  );
}

export default App;
