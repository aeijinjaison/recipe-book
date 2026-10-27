import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getRecipes = () => client.get('/recipes').then((res) => res.data);

export const getRecipe = (id) => client.get(`/recipes/${id}`).then((res) => res.data);

export const createRecipe = (payload) =>
  client.post('/recipes', payload).then((res) => res.data);

export const updateRecipe = (id, payload) =>
  client.put(`/recipes/${id}`, payload).then((res) => res.data);

export const deleteRecipe = (id) =>
  client.delete(`/recipes/${id}`).then((res) => res.data);

export const errorMessage = (error) =>
  error.response?.data?.message || 'Could not reach the server. Try again.';
