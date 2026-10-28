import { useState, useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import AppButton from './AppButton';
import { getRoutes, getMyPermissions } from '../api/clients';
import { getToken } from '../api/session';
import { styles } from '../styles';

export default function RouteQrList({ approvedOnly = false }: { approvedOnly?: boolean }) {
  const [routes, setRoutes] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const token = await getToken();
        if (!token) return;
        try {
          if (approvedOnly) {
            const perms = await getMyPermissions(token);
            setRoutes(
              perms
                .filter((p: any) => p.status === 'approved')
                .map((p: any) => ({ id: p.route_id, name: p.name, fare_amount: p.fare_amount }))
            );
          } else {
            setRoutes(await getRoutes(token));
          }
        } catch (err) {
          console.error(err);
        }
      })();
    }, [approvedOnly])
  );

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Routes</Text>
      {routes.length === 0 && (
        <Text style={{ textAlign: 'center', color: '#6B7A90' }}>
          {approvedOnly ? 'No approved routes yet. Request one in the Requests tab.' : 'No routes yet.'}
        </Text>
      )}
      {routes.map((r) => (
        <AppButton
          key={r.id}
          title={`${r.name} (K${r.fare_amount})`}
          variant={selected?.id === r.id ? 'primary' : 'secondary'}
          onPress={() => setSelected(r)}
        />
      ))}
      {selected && (
        <View style={[styles.card, { alignItems: 'center' }]}>
          <Text style={styles.cardTitle}>{selected.name}</Text>
          <QRCode value={String(selected.id)} size={220} />
        </View>
      )}
    </ScrollView>
  );
}