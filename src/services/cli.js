// This service will make requests to your backend server
// which will execute rollkit CLI commands

const CLI_SERVER_URL = '/api/cli'; // Adjust this to your CLI server endpoint

const cli = {
  async execute(command, params = {}) {
    try {
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
        throw new Error(`CLI command failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error executing CLI command:', error);
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
    return this.execute('createJournalEntry', {
      description,
      debitGroup,
      creditGroup,
      amount,
      fromAddress,
    });
  },

  // Send and Record
  async sendAndRecord(receiverAddress, amount, denom, debitGroupId, creditGroupId, description, fromAddress) {
    return this.execute('sendAndRecord', {
      receiverAddress,
      amount,
      denom,
      debitGroupId,
      creditGroupId,
      description,
      fromAddress,
    });
  },

  // Keys
  async getKeys() {
    return this.execute('getKeys');
  },
};

export default cli;