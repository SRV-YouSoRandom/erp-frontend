const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Execute CLI command and return result
const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    console.log(`Executing command: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return reject({ error: error.message, stderr });
      }
      if (stderr) {
        console.warn(`Command generated stderr: ${stderr}`);
      }
      try {
        // Try to parse as JSON if possible
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (e) {
        // If not JSON, return as string
        resolve({ output: stdout });
      }
    });
  });
};

// API endpoint for CLI commands
app.post('/api/cli', async (req, res) => {
  const { command, params } = req.body;
  
  try {
    let execCommand;
    
    switch (command) {
      case 'getKeys':
        execCommand = 'rollkit keys list --keyring-backend test --output json';
        break;
        
      case 'createGroup':
        execCommand = `rollkit tx ledger create-group "${params.name}" "${params.description}" --from ${params.fromAddress} --chain-id erprollup -y --fees 500stake --output json`;
        break;
        
      case 'createJournalEntry':
        // Updated to include sender and receiver parameters
        execCommand = `rollkit tx ledger create-journal-entry "${params.description}" "${params.debitGroup}" "${params.creditGroup}" ${params.amount} "${params.sender}" "${params.receiver}" --from ${params.fromAddress} --chain-id erprollup -y --fees 500stake --output json`;
        break;
        
      case 'sendAndRecord':
        // Updated to match the expected parameter order
        execCommand = `rollkit tx ledger send-and-record ${params.receiverAddress} ${params.amount} ${params.denom} "${params.debitGroupId}" "${params.creditGroupId}" "${params.description}" --from ${params.fromAddress} --chain-id erprollup --gas auto --fees 500stake -y --output json`;
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid command' });
    }
    
    const result = await executeCommand(execCommand);
    res.json(result);
  } catch (error) {
    console.error('Command execution error:', error);
    res.status(500).json({ error: error.message || 'An error occurred executing the command' });
  }
});

// Serve static files from the React app
app.use(express.static('build'));

// Start the server
app.listen(port, () => {
  console.log(`CLI Server running on port ${port}`);
});