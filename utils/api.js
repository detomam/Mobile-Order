import { API_BASE_URL } from '@/constants/Config';

export const fetchLocations = async (date, time) => {
  const response = await fetch(`${API_BASE_URL}/locations?date=${date}&time=${time}`);
  return response.json();
};

export const fetchMenu = async (date, time, location_number) => {
  const response = await fetch(`${API_BASE_URL}/menu?date=${date}&time=${time}&location_number=${location_number}`);
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