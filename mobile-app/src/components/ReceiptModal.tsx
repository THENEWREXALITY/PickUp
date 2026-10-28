import { Modal, View, Text, StyleSheet } from 'react-native';
import AppButton from './AppButton';

type Props = { ride: any | null; passenger: string; onClose: () => void };

const Line = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <View style={s.row}>
    <Text style={s.label}>{label}</Text>
    <Text style={[s.value, bold && { fontWeight: 'bold', fontSize: 18 }]}>{value}</Text>
  </View>
);

export default function ReceiptModal({ ride, passenger, onClose }: Props) {
  if (!ride) return null;
  const date = new Date(ride.created_at);

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={s.paper}>
          <Text style={s.brand}>PickUp Transit</Text>
          <Text style={s.sub}>Payment Receipt</Text>
          <Text style={s.dash}>- - - - - - - - - - - - - - - - - - - -</Text>
          <Line label="Receipt No." value={`PU-${String(ride.id).padStart(6, '0')}`} />
          <Line label="Route" value={ride.route_name} />
          <Line label="Date" value={date.toLocaleDateString()} />
          <Line label="Time" value={date.toLocaleTimeString()} />
          <Line label="Passenger" value={passenger || '-'} />
          <Text style={s.dash}>- - - - - - - - - - - - - - - - - - - -</Text>
          <Line label="Fare paid" value={`K${Number(ride.amount).toFixed(2)}`} bold />
          <Line label="Status" value="PAID" />
          <Text style={s.dash}>- - - - - - - - - - - - - - - - - - - -</Text>
          <Text style={s.thanks}>Thank you for riding with us</Text>
          <AppButton title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  paper: { backgroundColor: '#fff', borderRadius: 12, padding: 24 },
  brand: { fontSize: 22, fontWeight: 'bold', color: '#1F3864', textAlign: 'center' },
  sub: { textAlign: 'center', color: '#6B7A90', marginTop: 2 },
  dash: { textAlign: 'center', color: '#B0B8C4', marginVertical: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  label: { color: '#6B7A90' },
  value: { fontWeight: '600', color: '#1F3864', flexShrink: 1, textAlign: 'right', marginLeft: 12 },
  thanks: { textAlign: 'center', marginBottom: 16, color: '#6B7A90' },
});