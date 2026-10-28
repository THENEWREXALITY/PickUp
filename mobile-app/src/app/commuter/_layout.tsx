import { Tabs } from 'expo-router';
import { tabIcon } from '../../components/tabIcon';

export default function CommuterLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#1F3864' }}>
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard', tabBarIcon: tabIcon('home') }} />
      <Tabs.Screen name="history" options={{ title: 'History', tabBarIcon: tabIcon('time') }} />
      <Tabs.Screen name="scan" options={{ title: 'Scan', tabBarIcon: tabIcon('qr-code') }} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: tabIcon('person') }} />
    </Tabs>
  );
}