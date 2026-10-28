import { useState, useCallback } from 'react';
import { ScrollView, Text, View, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AppButton from '../../components/AppButton';
import { getPendingPermissions, decidePermission } from '../../api/clients';
import { getToken } from '../../api/session';
import { styles } from '../../styles';

export default function AdminPermissions() {
  const [pending, setPending] = useState<any[]>([]);

  const load = async () => {
    const token = await getToken();
    if (!token) return;
    try {
      setPending(await getPendingPermissions(token));
    } catch (err) {
      console.error(err);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const decide = async (id: number, status: 'approved' | 'rejected') => {
    const token = await getToken();
    if (!token) return;
    try {
      await decidePermission(token, id, status);
      load();
    } catch (err) {
      Alert.alert('Failed', String(err));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Permission Granting</Text>
      {pending.length === 0 && <Text style={{ textAlign: 'center', color: '#6B7A90' }}>No pending requests</Text>}
      {pending.map((p) => (
        <View key={p.id} style={styles.card}>
          <Text style={{ fontWeight: 'bold' }}>{p.driver_name}</Text>
          <Text style={{ marginBottom: 8 }}>wants to operate {p.route_name}</Text>
          <AppButton title="Approve" onPress={() => decide(p.id, 'approved')} />
          <AppButton title="Reject" variant="secondary" onPress={() => decide(p.id, 'rejected')} />
        </View>
      ))}
    </ScrollView>
  );
}