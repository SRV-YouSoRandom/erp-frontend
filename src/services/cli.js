// This service will make requests to your backend server
// which will execute rollkit CLI commands

const CLI_SERVER_URL = '/api/cli'; // Adjust this to your CLI server endpoint

// Helper function to normalize keys data format
const normalizeKeysData = (data) => {
  // If data is already properly formatted with a 'keys' array
  if (data && Array.isArray(data.keys)) {
    return data;
  }
  
  // If data is an array directly
  if (Array.isArray(data)) {
    return { keys: data };
  }
  
  // If data is an object with name-address pairs
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    if (data.keys && !Array.isArray(data.keys)) {
      // If 'keys' exists but is not an array (like an object)
      const keyArray = [];
      Object.entries(data.keys).forEach(([name, address]) => {
        keyArray.push({ name, address, type: 'local' });
      });
      return { keys: keyArray };
    } else {
      // If we have a flat object with name-address pairs
      const keyArray = [];
      Object.entries(data).forEach(([name, address]) => {
        if (typeof address === 'string') {
          keyArray.push({ name, address, type: 'local' });
        }
      });
      return { keys: keyArray };
    }
  }
  
  // If none of the above, return an empty keys array
  return { keys: [] };
};

const cli = {
  async execute(command, params = {}) {
    try {
      console.log(`Executing CLI command: ${command} with params:`, params);
      const response = await fetch(CLI_SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command,
          params,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `CLI command failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log(`CLI command result:`, result);
      return result;
    } catch (error) {
      console.error('Error executing CLI command:', error);
      throw error;
    }
  },

  // Keys
  async getKeys() {
    try {
      const result = await this.execute('getKeys');
      // Normalize the keys data to ensure it has the expected format
      return normalizeKeysData(result);
    } catch (error) {
      console.error('Error getting keys:', error);
      throw error;
    }
  },

  // Groups
  async createGroup(name, description, fromAddress) {
    return this.execute('createGroup', {
      name,
      description,
      fromAddress,
    });
  },

  // Journal Entries
  async createJournalEntry(description, debitGroup, creditGroup, amount, fromAddress) {
    // Make sure we're passing the right parameters
    console.log("Creating journal entry with:", {
      description, debitGroup, creditGroup, amount, fromAddress
    });
    
    return this.execute('createJournalEntry', {
      description,
      debitGroup,
      creditGroup,
      amount: Number(amount), // Ensure amount is a number
      fromAddress,
    });
  },

  // Send and Record
  async sendAndRecord(receiverAddress, amount, denom, debitGroupId, creditGroupId, description, fromAddress) {
    // Make sure we're passing the right parameters
    console.log("Sending and recording with:", {
      receiverAddress, amount, denom, debitGroupId, creditGroupId, description, fromAddress
    });
    
    return this.execute('sendAndRecord', {
      receiverAddress,
      amount: Number(amount), // Ensure amount is a number
      denom,
      debitGroupId,
      creditGroupId,
      description,
      fromAddress,
    });
  },
};

export default cli;