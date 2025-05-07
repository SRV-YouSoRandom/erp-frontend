import axios from 'axios';

const BASE_URL = 'http://212.90.121.86:1317';

// Helper function to normalize groups data
const normalizeGroupsData = (data) => {
  // If data is an array, it's already in the correct format
  if (Array.isArray(data)) {
    return data;
  }
  
  // If data is an object with Group property that's an array
  if (data && Array.isArray(data.Group)) {
    return data.Group;
  }
  
  // If data is an object with other properties
  if (data && typeof data === 'object') {
    // Try to convert to array if it looks like a key-value map of groups
    const groupsArray = [];
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'object' && value.name && value.description) {
        groupsArray.push({
          id: key,
          ...value
        });
      }
    });
    
    if (groupsArray.length > 0) {
      return groupsArray;
    }
  }
  
  // If none of the above, return empty array
  return [];
};

// Helper function to normalize journal entries data
const normalizeJournalEntriesData = (data) => {
  // If data is an array, it's already in the correct format
  if (Array.isArray(data)) {
    return data;
  }
  
  // If data is an object with JournalEntry property that's an array
  if (data && Array.isArray(data.JournalEntry)) {
    return data.JournalEntry;
  }
  
  // If none of the above, return empty array
  return [];
};

const api = {
  // Groups
  async getGroups() {
    try {
      const response = await axios.get(`${BASE_URL}/erprollup/ledger/group`);
      console.log("Raw groups response:", response.data);
      return normalizeGroupsData(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  },

  async getGroup(id) {
    try {
      const response = await axios.get(`${BASE_URL}/erprollup/ledger/group/${id}`);
      if (response.data && response.data.Group) {
        return response.data.Group;
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching group ${id}:`, error);
      throw error;
    }
  },

  // Journal Entries
  async getJournalEntries() {
    try {
      const response = await axios.get(`${BASE_URL}/erprollup/ledger/journal_entry`);
      console.log("Raw journal entries response:", response.data);
      return normalizeJournalEntriesData(response.data);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      throw error;
    }
  },

  async getJournalEntry(id) {
    try {
      const response = await axios.get(`${BASE_URL}/erprollup/ledger/journal_entry/${id}`);
      if (response.data && response.data.JournalEntry) {
        return response.data.JournalEntry;
      }
      return response.data;
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