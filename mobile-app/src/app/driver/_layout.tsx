import { Tabs } from 'expo-router';
import { tabIcon } from '../../components/tabIcon';

export default function DriverLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#1F3864' }}>
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard', tabBarIcon: tabIcon('wallet') }} />
      <Tabs.Screen name="routes" options={{ title: 'Routes', tabBarIcon: tabIcon('map') }} />
      <Tabs.Screen name="requests" options={{ title: 'Requests', tabBarIcon: tabIcon('hand-left') }} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: tabIcon('person') }} />
    </Tabs>
  );
}