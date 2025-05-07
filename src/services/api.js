import axios from 'axios';

const BASE_URL = 'http://212.90.121.86:1317';

const api = {
  // Groups
  async getGroups() {
    try {
      const response = await axios.get(`${BASE_URL}/erprollup/ledger/group`);
      return response.data.Group || [];
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  },

  async getGroup(id) {
    try {
      const response = await axios.get(`${BASE_URL}/erprollup/ledger/group/${id}`);
      return response.data.Group;
    } catch (error) {
      console.error(`Error fetching group ${id}:`, error);
      throw error;
    }
  },

  // Journal Entries
  async getJournalEntries() {
    try {
      const response = await axios.get(`${BASE_URL}/erprollup/ledger/journal_entry`);
      return response.data.JournalEntry || [];
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      throw error;
    }
  },

  async getJournalEntry(id) {
    try {
      const response = await axios.get(`${BASE_URL}/erprollup/ledger/journal_entry/${id}`);
      return response.data.JournalEntry;
    } catch (error) {
      console.error(`Error fetching journal entry ${id}:`, error);
      throw error;
    }
  },

  // Bank balances
  async getBalance(address) {
    try {
      const response = await axios.get(`${BASE_URL}/cosmos/bank/v1beta1/balances/${address}`);
      return response.data.balances;
    } catch (error) {
      console.error(`Error fetching balance for ${address}:`, error);
      throw error;
    }
  }
};

export default api;