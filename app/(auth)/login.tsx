import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginMode, LOGIN_MESSAGES } from '../../types/screens';
import { AuthTemplate } from '../components/templates/_AuthTemplate';
import { LoginForm } from '../components/organisms/_LoginForm';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<LoginMode>('signIn');
  const { signIn, signUp, loading, error } = useAuth();

  const handleSubmit = async () => {
    if (mode === 'signIn') {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signIn' ? 'signUp' : 'signIn');
  };

  return (
    <AuthTemplate
      title={
        mode === 'signIn'
          ? LOGIN_MESSAGES.SIGN_IN_TITLE
          : LOGIN_MESSAGES.SIGN_UP_TITLE
      }
      subtitle={
        mode === 'signIn'
          ? LOGIN_MESSAGES.SIGN_IN_SUBTITLE
          : LOGIN_MESSAGES.SIGN_UP_SUBTITLE
      }
    >
      <LoginForm
        email={email}
        password={password}
        mode={mode}
        loading={loading}
        error={error}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        onToggleMode={toggleMode}
      />
    </AuthTemplate>
  );
}
