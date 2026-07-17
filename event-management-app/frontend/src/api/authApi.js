import { authHttp } from './http.js';

export async function loginRequest(payload) {
  const { data } = await authHttp.post('/login', payload);
  return data;
}

export async function registerRequest(payload) {
  const { data } = await authHttp.post('/register', payload);
  return data;
}

export async function profileRequest() {
  const { data } = await authHttp.get('/profile');
  return data;
}

export async function updateProfileRequest(payload) {
  const { data } = await authHttp.put('/profile', payload);
  return data;
}

export async function updateProfileImageRequest(file) {
  const formData = new FormData();
  formData.append('profilePicture', file);
  const { data } = await authHttp.put('/profile/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function requestUsernameChangeRequest(newUsername) {
  const { data } = await authHttp.put('/profile/username', { newUsername });
  return data;
}

export async function confirmUsernameChangeRequest(token) {
  const { data } = await authHttp.post('/profile/username/confirm', { token });
  return data;
}

export async function requestPhoneChangeRequest(newPhone) {
  const { data } = await authHttp.put('/profile/phone', { newPhone });
  return data;
}

export async function confirmPhoneChangeRequest(token) {
  const { data } = await authHttp.post('/profile/phone/confirm', { token });
  return data;
}

export async function logoutRequest() {
  const { data } = await authHttp.post('/logout');
  return data;
}

export async function verifyEmailRequest(payload) {
  const { data } = await authHttp.post('/verify-email', payload);
  return data;
}

export async function resendVerificationRequest(payload) {
  const { data } = await authHttp.post('/resend-verification', payload);
  return data;
}

export async function forgotPasswordRequest(payload) {
  const { data } = await authHttp.post('/forgot-password', payload);
  return data;
}

export async function resetPasswordRequest(payload) {
  const { data } = await authHttp.post('/reset-password', payload);
  return data;
}
