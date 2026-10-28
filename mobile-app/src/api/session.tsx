import AsyncStorage from '@react-native-async-storage/async-storage';

export const getToken = () => AsyncStorage.getItem('token');

export async function saveSession(token: string, user: { name: string; email: string; role: string }) {
  await AsyncStorage.multiSet([
    ['token', token],
    ['role', user.role],
    ['name', user.name],
    ['email', user.email],
  ]);
}

export const clearSession = () => AsyncStorage.multiRemove(['token', 'role', 'name', 'email']);

export async function getUser() {
  const entries = await AsyncStorage.multiGet(['name', 'email', 'role']);
  const [name, email, role] = entries.map(([, value]) => value);
  return { name, email, role };
}