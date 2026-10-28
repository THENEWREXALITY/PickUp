import { View, Text } from 'react-native';
import AppButton from './AppButton';
import { styles } from '../styles';

type Props = { onRouteQr: () => void; onLogout: () => void };

export default function DriverHome({ onRouteQr, onLogout }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Panel</Text>
      <AppButton title="Show Route QR" onPress={onRouteQr} />
      <AppButton title="Log Out" onPress={onLogout} variant="ghost" />
    </View>
  );
}