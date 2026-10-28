import { useState } from 'react';
import {
  Modal, View, Text, TextInput, ActivityIndicator, Pressable, StyleSheet, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import AppButton from './AppButton';
import DoneBar, { DONE_ID } from './DoneBar';

const PROVIDERS = ['MTN', 'Airtel', 'Zamtel'];

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => Promise<number>;
};

export default function TopUpModal({ visible, onClose, onConfirm }: Props) {
  const [provider, setProvider] = useState('MTN');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'form' | 'processing' | 'success' | 'error'>('form');
  const [reference, setReference] = useState('');
  const [paid, setPaid] = useState(0);
  const [newBalance, setNewBalance] = useState(0);
  const [error, setError] = useState('');

  const close = () => {
    setStep('form');
    setAmount('');
    setError('');
    onClose();
  };

  const submit = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) return setError('Enter a valid amount');
    if (value > 500) return setError('Maximum top-up is K500');
    if (phone.replace(/\D/g, '').length < 9) return setError('Enter a valid phone number');

    setError('');
    setStep('processing');
    await new Promise((resolve) => setTimeout(resolve, 2500));

    try {
      const balance = await onConfirm(value);
      setPaid(value);
      setNewBalance(balance);
      setReference(`${provider.slice(0, 3).toUpperCase()}${Date.now().toString().slice(-8)}`);
      setStep('success');
    } catch (err) {
      setError(String(err));
      setStep('error');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Pressable style={s.backdrop} onPress={Keyboard.dismiss}>
        <View style={s.sheet}>
          {step === 'form' && (
            <>
            <DoneBar />
              <Text style={s.title}>Top Up with Mobile Money</Text>

              <Text style={s.label}>Provider</Text>
              <View style={s.chips}>
                {PROVIDERS.map((p) => (
                  <Pressable key={p} onPress={() => setProvider(p)} style={[s.chip, provider === p && s.chipActive]}>
                    <Text style={[s.chipText, provider === p && s.chipTextActive]}>{p}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={s.label}>Phone number</Text>
              <TextInput style={s.input} placeholder="097 123 4567" value={phone} onChangeText={setPhone} keyboardType="phone-pad" inputAccessoryViewID={DONE_ID} />

              <Text style={s.label}>Amount (K)</Text>
              <TextInput style={s.input} placeholder="50" value={amount} onChangeText={setAmount} keyboardType="numeric" inputAccessoryViewID={DONE_ID} />

              {!!error && <Text style={s.error}>{error}</Text>}

              <AppButton title="Confirm Payment" onPress={submit} />
              <AppButton title="Cancel" onPress={close} variant="ghost" />
              <Text style={s.footnote}>Demo: the mobile money gateway is simulated.</Text>
            </>
          )}

          {step === 'processing' && (
            <View style={s.center}>
              <ActivityIndicator size="large" color="#1F3864" />
              <Text style={s.title}>Processing...</Text>
              <Text style={s.muted}>Approve the K{amount} prompt on your {provider} phone</Text>
            </View>
          )}

          {step === 'success' && (
            <View style={s.center}>
              <Text style={{ fontSize: 48 }}>✅</Text>
              <Text style={s.title}>Top-up successful</Text>
              <Text style={s.muted}>K{paid.toFixed(2)} added via {provider}</Text>
              <Text style={s.muted}>Ref: {reference}</Text>
              <Text style={s.balance}>New balance: K{newBalance.toFixed(2)}</Text>
              <AppButton title="Done" onPress={close} />
            </View>
          )}

          {step === 'error' && (
            <View style={s.center}>
              <Text style={{ fontSize: 48 }}>⚠️</Text>
              <Text style={s.title}>Payment failed</Text>
              <Text style={s.muted}>{error}</Text>
              <AppButton title="Try again" onPress={() => setStep('form')} />
              <AppButton title="Cancel" onPress={close} variant="ghost" />
            </View>
          )}
        </View>
      </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 36 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1F3864', marginBottom: 16, textAlign: 'center' },
  label: { color: '#6B7A90', marginBottom: 6, marginTop: 4 },
  input: { borderWidth: 1, borderColor: '#D0D7E2', borderRadius: 10, padding: 14, marginBottom: 12 },
  chips: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, borderWidth: 1, borderColor: '#1F3864' },
  chipActive: { backgroundColor: '#1F3864' },
  chipText: { color: '#1F3864', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  error: { color: '#C62828', marginBottom: 12 },
  footnote: { textAlign: 'center', color: '#9AA5B5', fontSize: 12, marginTop: 4 },
  center: { alignItems: 'center', paddingVertical: 12 },
  muted: { color: '#6B7A90', textAlign: 'center', marginBottom: 4 },
  balance: { fontSize: 20, fontWeight: 'bold', color: '#2E7D32', marginVertical: 16 },
});