import { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AppButton from '../../components/AppButton';
import TopUpModal from '../../components/TopUpModal';
import { getBalance, topUpBalance } from '../../api/clients';
import { getToken } from '../../api/session';
import { styles } from '../../styles';

export default function CommuterDashboard() {
  const [balance, setBalance] = useState<number | null>(null);
  const [showTopUp, setShowTopUp] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const token = await getToken();
        if (!token) return;
        try {
          setBalance(Number((await getBalance(token)).balance));
        } catch (err) {
          console.error(err);
        }
      })();
    }, [])
  );

  const handleConfirm = async (amount: number) => {
    const token = await getToken();
    if (!token) throw new Error('Not logged in');
    const data = await topUpBalance(token, amount);
    setBalance(Number(data.balance));
    return Number(data.balance);
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Balance</Text>
        <Text style={styles.bigNumber}>K{Number(balance ?? 0).toFixed(2)}</Text>
        {balance !== null && balance < 15 && (
          <Text style={{ color: '#B26A00', marginTop: 8 }}>Low balance. Top up before your next ride.</Text>
        )}
      </View>
      <AppButton title="Top Up with Mobile Money" onPress={() => setShowTopUp(true)} />
      <TopUpModal visible={showTopUp} onClose={() => setShowTopUp(false)} onConfirm={handleConfirm} />
    </View>
  );
}