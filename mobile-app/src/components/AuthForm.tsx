import { ScrollView, Text, TextInput } from 'react-native';
import AppButton from './AppButton';
import Logo from './Logo';
import { styles } from '../styles';

type Props = {
  isRegistering: boolean;
  name: string;
  email: string;
  password: string;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  onSubmit: () => void;
  onToggle: () => void;
};

export default function AuthForm({ isRegistering, name, email, password, setName, setEmail, setPassword, onSubmit, onToggle }: Props) {
  return (
    <ScrollView
      contentContainerStyle={[styles.screen, { justifyContent: 'center' }]}
      keyboardShouldPersistTaps="handled"
    >
      <Logo />
      <Text style={styles.title}>{isRegistering ? 'Create Account' : 'Welcome Back'}</Text>

      {isRegistering && (
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      )}
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <AppButton title={isRegistering ? 'Register' : 'Login'} onPress={onSubmit} />
      <AppButton
        title={isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        onPress={onToggle}
        variant="secondary"
      />
    </ScrollView>
  );
}