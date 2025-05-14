import { API_BASE_URL } from '@/constants/Config';

export const fetchLocations = async (dayOfWeek, time) => {
  const response = await fetch(`${API_BASE_URL}/locations?dayOfWeek=${dayOfWeek}&time=${time}`);
  return response.json();
};

export const fetchMenu = async (location_number) => {
  const response = await fetch(`${API_BASE_URL}/menu?location_number=${location_number}`);
  return response.json();
};

export const fetchItem = async (id) => {
  const response = await fetch(`${API_BASE_URL}/item?id=${id}`);
  return response.json();
};

export const sendOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return response.json();
};