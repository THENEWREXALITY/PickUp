import { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useFocusEffect } from 'expo-router';
import ReceiptModal from '../../components/ReceiptModal';
import { getHistory } from '../../api/clients';
import { getToken, getUser } from '../../api/session';
import { styles } from '../../styles';

export default function History() {
  const [rides, setRides] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [passenger, setPassenger] = useState('');

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const token = await getToken();
        if (!token) return;
        try {
          setRides(await getHistory(token));
        } catch (err) {
          console.error(err);
        }
        const user = await getUser();
        setPassenger(user.name ?? '');
      })();
    }, [])
  );

  return (
    <View style={[styles.screen, { flex: 1 }]}>
      <Text style={styles.title}>Ride History</Text>
      <FlatList
        data={rides}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No rides yet</Text>}
        renderItem={({ item }) => (
          <Pressable onPress={() => setSelected(item)} style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}>
            <View style={styles.row}>
              <Text style={{ fontWeight: 'bold' }}>{item.route_name}</Text>
              <Text style={{ fontWeight: 'bold' }}>K{Number(item.amount).toFixed(2)}</Text>
            </View>
            <Text style={{ color: '#6B7A90' }}>{new Date(item.created_at).toLocaleString()}</Text>
            <Text style={{ color: '#1F3864', marginTop: 4 }}>Tap for receipt</Text>
          </Pressable>
        )}
      />
      <ReceiptModal ride={selected} passenger={passenger} onClose={() => setSelected(null)} />
    </View>
  );
}