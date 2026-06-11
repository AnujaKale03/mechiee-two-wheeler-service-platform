import { getAuthToken } from './storage';

const BASE_URL = __DEV__
  ? 'http://10.0.2.2:5000/api'
  : 'https://your-mechiee-api.com/api';

async function authRequest(path, options = {}) {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// Register Expo push token with backend (replaces registerFcmToken)
export const registerExpoPushToken = (token) =>
  authRequest('/notifications/register-token', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });

// Fetch paginated notifications
export const fetchNotifications = (page = 1, limit = 20) =>
  authRequest(`/notifications?page=${page}&limit=${limit}`);

// Get unread badge count
export const fetchUnreadCount = () =>
  authRequest('/notifications/unread-count');

// Mark single notification read
export const markAsRead = (id) =>
  authRequest(`/notifications/${id}/read`, { method: 'PATCH' });

// Mark all as read
export const markAllRead = () =>
  authRequest('/notifications/read-all', { method: 'PATCH' });

// Delete a notification
export const deleteNotification = (id) =>
  authRequest(`/notifications/${id}`, { method: 'DELETE' });