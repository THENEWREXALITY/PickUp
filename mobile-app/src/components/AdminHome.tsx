import { View, Text } from 'react-native';
import AppButton from './AppButton';
import { styles } from '../styles';

type Props = { onDashboard: () => void; onRouteQr: () => void; onLogout: () => void };

export default function AdminHome({ onDashboard, onRouteQr, onLogout }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Operator Panel</Text>
      <AppButton title="Dashboard" onPress={onDashboard} />
      <AppButton title="Route QR Codes" onPress={onRouteQr} variant="secondary" />
      <AppButton title="Log Out" onPress={onLogout} variant="ghost" />
    </View>
  );
}