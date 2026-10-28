import { Pressable, Text, StyleSheet } from 'react-native';

type Props = { title: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'ghost' };

export default function AppButton({ title, onPress, variant = 'primary' }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.base, s[variant], pressed && { opacity: 0.8 }]}>
      <Text style={[s.text, variant !== 'primary' && s.textDark]}>{title}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  base: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  primary: { backgroundColor: '#1F3864' },
  secondary: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#1F3864' },
  ghost: { backgroundColor: 'transparent' },
  text: { color: '#fff', fontSize: 16, fontWeight: '600' },
  textDark: { color: '#1F3864' },
});