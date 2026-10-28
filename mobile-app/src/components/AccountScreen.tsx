import { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AppButton from './AppButton';
import { getUser, clearSession } from '../api/session';
import { styles } from '../styles';

export default function AccountScreen() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string | null; email: string | null; role: string | null }>({
    name: null, email: null, role: null,
  });

  useFocusEffect(
    useCallback(() => {
      getUser().then(setUser);
    }, [])
  );

  const logout = async () => {
    await clearSession();
    router.replace('/');
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Account</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Name</Text>
        <Text>{user.name ?? '-'}</Text>
        <Text style={[styles.cardTitle, { marginTop: 12 }]}>Email</Text>
        <Text>{user.email ?? '-'}</Text>
        <Text style={[styles.cardTitle, { marginTop: 12 }]}>Role</Text>
        <Text style={{ textTransform: 'capitalize' }}>{user.role ?? '-'}</Text>
      </View>
      <AppButton title="Log Out" onPress={logout} variant="secondary" />
    </View>
  );
}