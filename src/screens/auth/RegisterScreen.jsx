import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, Keyboard } from 'react-native';
import { 
  TextInput, 
  Button, 
  Title, 
  Paragraph, 
  Card,
  Chip,
  ActivityIndicator,
  HelperText,
  Surface
} from 'react-native-paper';
import { register, checkSubdomainAvailability } from '../../services/api';
import { saveToken, saveUserData } from '../../services/auth';

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    preferredSubdomain: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [subdomainStatus, setSubdomainStatus] = useState({
    checking: false,
    available: null,
    suggested: null
  });
  
  const [errors, setErrors] = useState({});

  // Auto-generate subdomain from name
  useEffect(() => {
    if (form.name && !form.preferredSubdomain) {
      const suggested = form.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      setForm(prev => ({ ...prev, preferredSubdomain: suggested }));
    }
  }, [form.name]);

  // Check subdomain availability
  useEffect(() => {
    const checkAvailability = async () => {
      if (form.preferredSubdomain && form.preferredSubdomain.length >= 3) {
        setSubdomainStatus({ checking: true, available: null, suggested: null });
        
        try {
          const result = await checkSubdomainAvailability(form.preferredSubdomain);
          setSubdomainStatus({
            checking: false,
            available: result.available,
            suggested: result.suggested
          });
        } catch (error) {
          setSubdomainStatus({ checking: false, available: false, suggested: null });
        }
      }
    };

    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [form.preferredSubdomain]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) newErrors.phone = 'Invalid phone number';
    if (!form.password || form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!form.preferredSubdomain) newErrors.subdomain = 'Website URL is required';
    else if (subdomainStatus.available === false) newErrors.subdomain = 'This URL is not available';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    Keyboard.dismiss();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await register(form);
      
      // Save auth data
      await saveToken(result.token);
      await saveUserData({
        user: result.user,
        tenant: result.tenant
      });

      Alert.alert(
        '🎉 Success!', 
        `Your website is ready!\n\nhttps://${result.tenant.subdomain}.nest-connect.in\n\nYou can now add properties and customize your site!`,
        [
          {
            text: 'Continue to Dashboard',
            onPress: () => navigation.reset({
              index: 0,
              routes: [{ name: 'MainTabs' }]
            })
          }
        ]
      );
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    }
    setLoading(false);
  };

  const getSubdomainColor = () => {
    if (subdomainStatus.checking) return '#9ca3af';
    if (subdomainStatus.available === true) return '#10b981';
    if (subdomainStatus.available === false) return '#ef4444';
    return '#6b7280';
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{ padding: 20 }}>
        
        {/* Header */}
        <Card style={{ marginBottom: 24, backgroundColor: 'white' }}>
          <Card.Content style={{ alignItems: 'center', padding: 32 }}>
            <Title style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 }}>
              Create Your Real Estate Website
            </Title>
            <Paragraph style={{ textAlign: 'center', color: '#6b7280', fontSize: 16 }}>
              Get your professional broker website in under 2 minutes
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Registration Form */}
        <Card style={{ backgroundColor: 'white' }}>
          <Card.Content style={{ padding: 24 }}>
            
            {/* Full Name */}
            <TextInput
              label="Full Name *"
              value={form.name}
              onChangeText={(text) => setForm({...form, name: text})}
              mode="outlined"
              style={{ marginBottom: 16 }}
              error={!!errors.name}
            />
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
            </HelperText>

            {/* Email */}
            <TextInput
              label="Email Address *"
              value={form.email}
              onChangeText={(text) => setForm({...form, email: text})}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ marginBottom: 16 }}
              error={!!errors.email}
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>

            {/* Phone */}
            <TextInput
              label="Phone Number *"
              value={form.phone}
              onChangeText={(text) => setForm({...form, phone: text})}
              mode="outlined"
              keyboardType="phone-pad"
              style={{ marginBottom: 16 }}
              error={!!errors.phone}
            />
            <HelperText type="error" visible={!!errors.phone}>
              {errors.phone}
            </HelperText>

            {/* Password */}
            <TextInput
              label="Password *"
              value={form.password}
              onChangeText={(text) => setForm({...form, password: text})}
              mode="outlined"
              secureTextEntry
              style={{ marginBottom: 16 }}
              error={!!errors.password}
            />
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
            </HelperText>

            {/* Website URL */}
            <Surface style={{ 
              backgroundColor: '#f8fafc', 
              borderRadius: 8, 
              padding: 16, 
              marginBottom: 16,
              borderWidth: 1,
              borderColor: errors.subdomain ? '#ef4444' : '#e5e7eb'
            }}>
              <Paragraph style={{ marginBottom: 8, fontWeight: '600', color: '#374151' }}>
                Your Website URL
              </Paragraph>
              
              <TextInput
                label="Choose your website name"
                value={form.preferredSubdomain}
                onChangeText={(text) => {
                  const cleaned = text.toLowerCase().replace(/[^a-z0-9-]/g, '');
                  setForm({...form, preferredSubdomain: cleaned});
                }}
                mode="outlined"
                style={{ marginBottom: 8 }}
                error={!!errors.subdomain}
              />
              
              {/* URL Preview */}
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: 'white',
                padding: 12,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: '#e5e7eb'
              }}>
                <Paragraph style={{ color: getSubdomainColor(), fontWeight: '500' }}>
                  https://{form.preferredSubdomain || 'your-name'}.nest-connect.in
                </Paragraph>
                {subdomainStatus.checking && (
                  <ActivityIndicator size="small" style={{ marginLeft: 8 }} />
                )}
              </View>

              {/* Availability Status */}
              {form.preferredSubdomain && !subdomainStatus.checking && (
                <View style={{ marginTop: 8 }}>
                  {subdomainStatus.available === true && (
                    <Chip icon="check" mode="flat" style={{ backgroundColor: '#dcfce7' }}>
                      ✅ Available
                    </Chip>
                  )}
                  {subdomainStatus.available === false && (
                    <Chip icon="close" mode="flat" style={{ backgroundColor: '#fee2e2' }}>
                      ❌ Not Available
                    </Chip>
                  )}
                </View>
              )}

              <HelperText type="error" visible={!!errors.subdomain}>
                {errors.subdomain}
              </HelperText>
            </Surface>

            {/* Register Button */}
            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading || subdomainStatus.available === false}
              style={{ 
                marginTop: 16,
                paddingVertical: 8,
                backgroundColor: '#3b82f6'
              }}
              contentStyle={{ height: 50 }}
            >
              Create My Website
            </Button>

            {/* Login Link */}
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Paragraph>Already have an account?</Paragraph>
              <Button 
                mode="text" 
                onPress={() => navigation.navigate('Login')}
                style={{ marginTop: 4 }}
              >
                Sign In
              </Button>
            </View>

          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;