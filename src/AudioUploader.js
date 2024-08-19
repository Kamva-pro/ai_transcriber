// src/components/AudioUploader.js
import React, { useState } from 'react';
import axios from 'axios';

const AudioUploader = () => {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file.');
      return;
    }
    
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send audio file to transcription service
      const transcriptionResponse = await axios.post('/api/transcribe', formData);
      setTranscription(transcriptionResponse.data.transcription);

      // Send transcription to summarization service
      const summaryResponse = await axios.post('/api/summarize', { text: transcriptionResponse.data.transcription });
      setSummary(summaryResponse.data.summary);
    } catch (error) {
      console.error('Error processing audio:', error);
      setError('An error occurred while processing the audio.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button type="submit">Upload and Process</button>
      </form>
      {error && <p>{error}</p>}
      <h2>Transcription</h2>
      <p>{transcription}</p>
      <h2>Summary</h2>
      <p>{summary}</p>
    </div>
  );
};

export default AudioUploader;
