import axios from "axios";
import { Transaction } from "../types/finance";

const BASE_URL = "http://localhost:5000/api"; // Update for deployed backend if needed

export const transactionService = {
  async addTransaction(transaction: Omit<Transaction, "id">) {
    try {
      const response = await axios.post(
        `${BASE_URL}/transactions`,
        transaction
      );
      return response.data;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  },

  async getTransactions(): Promise<Transaction[]> {
    try {
      const response = await axios.get(`${BASE_URL}/transactions`);
      return response.data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  },

  async deleteTransaction(id: string) {
    try {
      await axios.delete(`${BASE_URL}/transactions/${id}`);
    } catch (error) {
      console.error(`Error deleting transaction with id ${id}:`, error);
      throw error;
    }
  },

  async updateTransaction(id: string, updates: Partial<Transaction>) {
    try {
      const response = await axios.put(
        `${BASE_URL}/transactions/${id}`,
        updates
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating transaction with id ${id}:`, error);
      throw error;
    }
  },
  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const response = await axios.get<Transaction[]>(`${BASE_URL}/transactions`);
      console.log('✅ Transactions fetched:', response.data);
      return response.data; // ✅ return the array directly
    } catch (error) {
      console.error('❌ Error fetching transactions:', error);
      throw new Error('Failed to fetch transactions');
    }
  },
  
};
