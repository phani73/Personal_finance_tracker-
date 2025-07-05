// src/services/budgetService.ts

import axios from 'axios';
import { Budget } from '../types/finance';

const API_URL = 'http://localhost:5000/api/budgets';

export const budgetService = {
  // Add a new budget
  async addBudget(budget: Omit<Budget, 'id'>): Promise<Budget> {
    try {
      const response = await axios.post<Budget>(API_URL, budget);
      return response.data;
    } catch (error) {
      console.error('Error adding budget:', error);
      throw new Error('Failed to add budget');
    }
  },

  // Update an existing budget
  async updateBudget(id: string, updates: Partial<Budget>): Promise<Budget> {
    try {
      const response = await axios.put<Budget>(`${API_URL}/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating budget:', error);
      throw new Error('Failed to update budget');
    }
  },

  // Delete a budget
  async deleteBudget(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw new Error('Failed to delete budget');
    }
  },

  // (Optional) Get all budgets
  async getBudgets(): Promise<Budget[]> {
    try {
      const response = await axios.get<Budget[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw new Error('Failed to fetch budgets');
    }
  },
  async getAllBudgets(): Promise<Budget[]> {
    try {
      const response = await axios.get<Budget[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw new Error('Failed to fetch budgets');
    }
  },
  async getBudgetsByMonth(month: string): Promise<Budget[]> {
    try {
      const response = await axios.get<Budget[]>(`${API_URL}?month=${month}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching budgets by month:', error);
      throw new Error('Failed to fetch budgets by month');
    }
  }
  
};
