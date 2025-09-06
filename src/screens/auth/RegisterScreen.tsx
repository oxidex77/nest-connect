import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Keyboard, StatusBar } from 'react-native';
import { Text, TextInput, Button, useTheme, HelperText, ActivityIndicator, Snackbar, Appbar } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import slugify from 'slugify';

import { register, checkSubdomainAvailability } from '../../services/api';
import { saveToken, saveUserData } from '../../services/auth';
import { setCredentials } from '../../redux/features/userSlice';

const RegisterScreen = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    preferredSubdomain: ''
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const [subdomainStatus, setSubdomainStatus] = useState({
    checking: false,
    available: false,
    message: ''
  });

  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleInputChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: undefined}));
    }
  };

  // Auto-generate subdomain from name
  useEffect(() => {
    if (form.name) {
      const suggested = slugify(form.name, { lower: true, strict: true });
      setForm(prev => ({ ...prev, preferredSubdomain: suggested }));
    }
  }, [form.name]);

  // Debounced check for subdomain availability
  useEffect(() => {
    const handler = setTimeout(() => {
      if (form.preferredSubdomain.length >= 3) {
        checkSubdomain();
      } else {
        setSubdomainStatus({ checking: false, available: false, message: 'Must be at least 3 characters.' });
      }
    }, 500); // 500ms delay

    return () => clearTimeout(handler);
  }, [form.preferredSubdomain]);
  
  const checkSubdomain = async () => {
    setSubdomainStatus({ checking: true, available: false, message: 'Checking...' });
    const result = await checkSubdomainAvailability(form.preferredSubdomain);
    if (result.available) {
      setSubdomainStatus({ checking: false, available: true, message: 'Available!' });
    } else {
      setSubdomainStatus({ checking: false, available: false, message: 'This name is taken.' });
    }
  };

  const validate = () => {
    Keyboard.dismiss();
    const newErrors: Partial<typeof form> = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'A valid email is required.';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) newErrors.phone = 'A valid 10-digit phone number is required.';
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (!subdomainStatus.available) newErrors.preferredSubdomain = 'Please choose an available website name.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    
    setLoading(true);
    setApiError('');
    try {
      const { token, user, tenant } = await register(form);
      
      await saveToken(token);
      await saveUserData({ user, tenant });
      
      dispatch(setCredentials({ token, user, tenant }));
      
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const getSubdomainHelperText = () => {
    if (subdomainStatus.checking) return 'Checking availability...';
    return subdomainStatus.message;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Create Your Account" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text variant="headlineSmall" style={styles.title}>Your Professional Details</Text>
        <TextInput label="Full Name *" value={form.name} onChangeText={v => handleInputChange('name', v)} mode="outlined" style={styles.input} error={!!errors.name} />
        {errors.name && <HelperText type="error">{errors.name}</HelperText>}
        
        <TextInput label="Email Address *" value={form.email} onChangeText={v => handleInputChange('email', v)} mode="outlined" style={styles.input} keyboardType="email-address" autoCapitalize="none" error={!!errors.email}/>
        {errors.email && <HelperText type="error">{errors.email}</HelperText>}

        <TextInput label="10-Digit Phone Number *" value={form.phone} onChangeText={v => handleInputChange('phone', v)} mode="outlined" style={styles.input} keyboardType="phone-pad" error={!!errors.phone}/>
        {errors.phone && <HelperText type="error">{errors.phone}</HelperText>}

        <TextInput label="Password (min 6 characters)" value={form.password} onChangeText={v => handleInputChange('password', v)} mode="outlined" style={styles.input} secureTextEntry error={!!errors.password}/>
        {errors.password && <HelperText type="error">{errors.password}</HelperText>}
        
        <View style={styles.divider} />
        
        <Text variant="headlineSmall" style={styles.title}>Your Website Name</Text>
        <Text style={styles.subtitle}>This will be your unique web address.</Text>
        
        <TextInput
            label="Website Name *"
            value={form.preferredSubdomain}
            onChangeText={v => handleInputChange('preferredSubdomain', v.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            mode="outlined"
            style={styles.input}
            right={subdomainStatus.checking ? <TextInput.Affix text={<ActivityIndicator size="small"/>} /> : null}
            error={!!errors.preferredSubdomain}
        />
        <HelperText type={subdomainStatus.available ? 'info' : 'error'} visible={!!form.preferredSubdomain}>
            {getSubdomainHelperText()}
        </HelperText>

        <View style={styles.urlPreview}>
            <Text style={styles.urlText}>https://</Text>
            <Text style={[styles.urlText, {color: theme.colors.primary, fontWeight: 'bold'}]}>{form.preferredSubdomain || 'your-name'}</Text>
            <Text style={styles.urlText}>.nest-connect.in</Text>
        </View>

        <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading || !subdomainStatus.available}
            style={styles.actionButton}
            labelStyle={{fontSize: 16, fontWeight: 'bold'}}
            contentStyle={{paddingVertical: 8}}
          >
            {loading ? 'Creating Your Empire...' : 'Finish & Launch Website'}
        </Button>
      </ScrollView>

      <Snackbar
        visible={!!apiError}
        onDismiss={() => setApiError('')}
        duration={Snackbar.DURATION_LONG}
        style={{ backgroundColor: '#B91C1C' }}
      >
        {apiError}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    scrollViewContent: { padding: 20 },
    title: { fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
    subtitle: { color: '#6B7280', marginTop: -12, marginBottom: 16 },
    input: { backgroundColor: '#F9FAFB', marginTop: 4 },
    divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 24 },
    urlPreview: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, marginTop: 4, marginBottom: 24 },
    urlText: { fontSize: 14, color: '#4B5563' },
    actionButton: { borderRadius: 12 }
});

export default RegisterScreen;