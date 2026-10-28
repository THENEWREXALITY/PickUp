import { useState, useRef, useCallback } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AppButton from '../../components/AppButton';
import { payFare } from '../../api/clients';
import { getToken } from '../../api/session';
import { styles } from '../../styles';

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [active, setActive] = useState(false);
  const locked = useRef(false);

  useFocusEffect(
    useCallback(() => {
      setActive(true);
      return () => setActive(false);
    }, [])
  );

  const release = () => {
    setTimeout(() => { locked.current = false; }, 1500);
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Camera access is needed to scan fares.</Text>
        <AppButton title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const handleScan = async ({ data }: { data: string }) => {
    if (locked.current) return;
    locked.current = true;

    const token = await getToken();
    if (!token) {
      Alert.alert('Not logged in', '', [{ text: 'OK', onPress: release }]);
      return;
    }

    try {
      const result = await payFare(token, data);
      Alert.alert(
        'Fare paid!',
        `${result.routeName}\nK${result.fareCharged} charged\nNew balance: K${result.balance}`,
        [{ text: 'OK', onPress: release }]
      );
    } catch (err) {
      Alert.alert('Payment failed', String(err), [{ text: 'OK', onPress: release }]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {active && (
        <CameraView
          style={StyleSheet.absoluteFill}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleScan}
        />
      )}
    </View>
  );
}