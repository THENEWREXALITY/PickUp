import { useState, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getSummary, getTransactions, getDrivers } from '../../api/clients';
import { getToken } from '../../api/session';
import { styles } from '../../styles';

export default function Dashboard() {
  const [summary, setSummary] = useState<any | null>(null);
  const [txs, setTxs] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const token = await getToken();
        if (!token) return;
        try {
          setSummary(await getSummary(token));
          setTxs(await getTransactions(token));
          setDrivers(await getDrivers(token));
        } catch (err) {
          console.error(err);
        }
      })();
    }, [])
  );

  const activeDrivers = drivers.filter((d) => Number(d.routes) > 0).length;

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Operator Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Revenue</Text>
        <Text style={styles.bigNumber}>K{Number(summary?.total_revenue ?? 0).toFixed(2)}</Text>
        <Text>{summary?.total_rides ?? 0} rides · {activeDrivers} active drivers</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Driver Earnings</Text>
        {drivers.length === 0 && <Text>No drivers yet.</Text>}
        {drivers.map((d) => (
          <View key={d.id} style={styles.row}>
            <Text>{d.name} ({d.routes} routes)</Text>
            <Text>K{Number(d.earnings).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Revenue by Route</Text>
        {summary?.routes?.map((r: any) => (
          <View key={r.id} style={styles.row}>
            <Text>{r.name} ({r.rides})</Text>
            <Text>K{Number(r.revenue).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Transactions</Text>
        {txs.map((t) => (
          <View key={t.id} style={styles.row}>
            <Text>{t.commuter_name} · {t.route_name}</Text>
            <Text>K{t.amount}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}