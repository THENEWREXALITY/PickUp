import { Tabs } from 'expo-router';
import { tabIcon } from '../../components/tabIcon';

export default function AdminLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#1F3864' }}>
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard', tabBarIcon: tabIcon('bar-chart') }} />
      <Tabs.Screen name="routes" options={{ title: 'Routes', tabBarIcon: tabIcon('map') }} />
      <Tabs.Screen name="permissions" options={{ title: 'Permissions', tabBarIcon: tabIcon('shield-checkmark') }} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: tabIcon('person') }} />
    </Tabs>
  );
}