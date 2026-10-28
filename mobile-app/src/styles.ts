import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F5F7FA' },
  screen: { flexGrow: 1, padding: 20, paddingTop: 60, backgroundColor: '#F5F7FA' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F3864', marginBottom: 24, textAlign: 'center' },
  balance: { fontSize: 24, marginBottom: 24, textAlign: 'center', fontWeight: 'bold', color: '#2E7D32' },
  input: { borderWidth: 1, borderColor: '#D0D7E2', backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 14 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  cardTitle: { fontSize: 14, color: '#6B7A90', marginBottom: 8, textTransform: 'uppercase' },
  bigNumber: { fontSize: 32, fontWeight: 'bold', color: '#1F3864' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
});