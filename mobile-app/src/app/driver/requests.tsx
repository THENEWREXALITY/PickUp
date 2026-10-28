import { useState, useCallback } from 'react';
import { ScrollView, Text, View, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AppButton from '../../components/AppButton';
import { getRoutes, getMyPermissions, requestRoute } from '../../api/clients';
import { getToken } from '../../api/session';
import { styles } from '../../styles';

export default function DriverRequests() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [perms, setPerms] = useState<any[]>([]);

  const load = async () => {
    const token = await getToken();
    if (!token) return;
    try {
      setRoutes(await getRoutes(token));
      setPerms(await getMyPermissions(token));
    } catch (err) {
      console.error(err);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const request = async (routeId: number) => {
    const token = await getToken();
    if (!token) return;
    try {
      await requestRoute(token, routeId);
      load();
    } catch (err) {
      Alert.alert('Request failed', String(err));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Permission Requests</Text>
      {routes.map((r) => {
        const perm = perms.find((p) => p.route_id === r.id);
        return (
          <View key={r.id} style={styles.card}>
            <Text style={{ fontWeight: 'bold' }}>{r.name}</Text>
            <Text style={{ marginBottom: 8 }}>K{r.fare_amount}</Text>
            {!perm && <AppButton title="Request" onPress={() => request(r.id)} />}
            {perm?.status === 'rejected' && <AppButton title="Rejected - Request again" variant="secondary" onPress={() => request(r.id)} />}
            {perm?.status === 'pending' && <Text style={{ color: '#B26A00' }}>Pending approval</Text>}
            {perm?.status === 'approved' && <Text style={{ color: '#2E7D32' }}>Approved</Text>}
          </View>
        );
      })}
    </ScrollView>
  );
}