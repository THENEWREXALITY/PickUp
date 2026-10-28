import { useState, useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getDriverSummary } from '../../api/clients';
import { getToken } from '../../api/session';
import { styles } from '../../styles';

export default function DriverDashboard() {
  const [summary, setSummary] = useState<any | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const token = await getToken();
        if (!token) return;
        try {
          setSummary(await getDriverSummary(token));
        } catch (err) {
          console.error(err);
        }
      })();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Driver Dashboard</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Collected</Text>
        <Text style={styles.bigNumber}>K{Number(summary?.total_collected ?? 0).toFixed(2)}</Text>
        <Text>{summary?.total_rides ?? 0} rides</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>By Route</Text>
        {(summary?.routes ?? []).length === 0 && <Text>No approved routes yet.</Text>}
        {summary?.routes?.map((r: any) => (
          <View key={r.id} style={styles.row}>
            <Text>{r.name} ({r.rides})</Text>
            <Text>K{Number(r.revenue).toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}