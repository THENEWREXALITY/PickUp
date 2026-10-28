import { useState, useEffect } from 'react';
import { Alert, View } from 'react-native';
import { useRouter } from 'expo-router';
import AuthForm from '../components/AuthForm';
import { registerUser, loginUser } from '../api/clients';
import { getToken, getUser, saveSession } from '../api/session';

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isRegistering, setIsRegistering] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    (async () => {
      const token = await getToken();
      const { role } = await getUser();
      if (token && role) {
        router.replace(`/${role}/dashboard` as any);
      } else {
        setChecking(false);
      }
    })();
  }, []);

  const handleRegister = async () => {
    try {
      await registerUser(name, email, password);
      Alert.alert('Registered! Now log in.');
      setIsRegistering(false);
    } catch (err) {
      Alert.alert('Registration failed', String(err));
    }
  };

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      await saveSession(data.token, data.user);
      router.replace(`/${data.user.role}/dashboard` as any);
    } catch (err) {
      Alert.alert('Login failed', String(err));
    }
  };

  if (checking) return <View />;

  return (
    <AuthForm
      isRegistering={isRegistering}
      name={name} email={email} password={password}
      setName={setName} setEmail={setEmail} setPassword={setPassword}
      onSubmit={isRegistering ? handleRegister : handleLogin}
      onToggle={() => setIsRegistering(!isRegistering)}
    />
  );
}

