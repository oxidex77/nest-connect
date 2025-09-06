import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Text, TextInput, Button, useTheme, Snackbar } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';

import { setCredentials } from '../../redux/features/userSlice';
import { login } from '../../services/api';
import { saveToken, saveUserData } from '../../services/auth';

// Define navigation props for type safety
type AuthScreenNavigationProp = StackNavigationProp<any, 'SignIn'>;

const AuthScreen = ({ navigation }: { navigation: AuthScreenNavigationProp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const theme = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { token, user, tenant } = await login(email, password);
      
      // Save session data
      await saveToken(token);
      await saveUserData({ user, tenant });

      // Update Redux state to switch navigator
      dispatch(setCredentials({ token, user, tenant }));

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            <Icon name="shield-lock-outline" size={60} color={theme.colors.primary} />
            <Text variant="headlineLarge" style={styles.title}>Welcome Back</Text>
            <Text variant="bodyLarge" style={styles.subtitle}>Sign in to manage your real estate empire.</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="at" color="#9CA3AF" />}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              secureTextEntry={!passwordVisible}
              left={<TextInput.Icon icon="lock-outline" color="#9CA3AF" />}
              right={
                <TextInput.Icon
                  icon={passwordVisible ? "eye-off" : "eye"}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                />
              }
            />
          </View>

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.actionButton}
            labelStyle={styles.actionButtonLabel}
            contentStyle={styles.actionButtonContent}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.footerLink}>Create one now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={Snackbar.DURATION_MEDIUM}
        style={{ backgroundColor: '#B91C1C' }}
      >
        {error}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    marginTop: 8,
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center'
  },
  form: {
    width: '100%',
    marginBottom: 24
  },
  input: {
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
  },
  inputOutline: {
    borderRadius: 12,
  },
  actionButton: {
    borderRadius: 12,
  },
  actionButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
  footer: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerText: {
      color: '#6B7280',
      fontSize: 14
  },
  footerLink: {
      marginLeft: 4,
      color: '#4F46E5',
      fontWeight: 'bold',
      fontSize: 14
  }
});

export default AuthScreen;