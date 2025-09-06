import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, Linking } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  FAB,
  Chip,
  ActivityIndicator,
  Divider
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { getUserData } from '../../services/auth';
import { getMyTenant } from '../../services/api';

const BrokerSiteScreen = ({ navigation }) => {
  const [tenant, setTenant] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    properties: 0,
    requirements: 0,
    views: 0
  });

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const userData = await getUserData();
      setUser(userData.user);
      
      if (userData.tenant) {
        setTenant(userData.tenant);
        // Load additional stats if needed
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load your website data');
    } finally {
      setLoading(false);
    }
  };

  const openWebsite = () => {
    if (tenant?.subdomain) {
      const url = `https://${tenant.subdomain}.nest-connect.in`;
      Linking.openURL(url);
    }
  };

  const shareWebsite = async () => {
    if (tenant?.subdomain) {
      const url = `https://${tenant.subdomain}.nest-connect.in`;
      const message = `Check out my real estate website: ${url}`;
      
      try {
        const { Share } = await import('react-native');
        await Share.share({ message });
      } catch (error) {
        Alert.alert('Error', 'Failed to share website');
      }
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Paragraph style={{ marginTop: 16 }}>Loading your website...</Paragraph>
      </View>
    );
  }

  if (!tenant) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
        <Card>
          <Card.Content style={{ alignItems: 'center', padding: 32 }}>
            <Title>No Website Found</Title>
            <Paragraph style={{ textAlign: 'center', marginVertical: 16 }}>
              It looks like you don't have a broker website yet. Contact support to set one up.
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Website Info */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ flex: 1 }}>
                <Title>{tenant.displayName}</Title>
                <Paragraph style={{ fontSize: 16, color: '#666' }}>
                  {tenant.subdomain}.nest-connect.in
                </Paragraph>
              </View>
              <Chip 
                mode="outlined" 
                style={{ 
                  backgroundColor: tenant.status === 'active' ? '#e8f5e8' : '#fee2e2',
                }}
              >
                {tenant.status}
              </Chip>
            </View>
            
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button 
                mode="contained" 
                icon="web"
                onPress={openWebsite}
                style={{ flex: 1 }}
              >
                View Site
              </Button>
              <Button 
                mode="outlined" 
                icon="share"
                onPress={shareWebsite}
                style={{ flex: 1 }}
              >
                Share
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Stats */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Title>Quick Stats</Title>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 }}>
              <View style={{ alignItems: 'center' }}>
                <Title style={{ fontSize: 24, color: '#3b82f6' }}>
                  {tenant.analytics?.viewCount || 0}
                </Title>
                <Paragraph>Views</Paragraph>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Title style={{ fontSize: 24, color: '#10b981' }}>
                  {stats.properties}
                </Title>
                <Paragraph>Properties</Paragraph>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Title style={{ fontSize: 24, color: '#f59e0b' }}>
                  {stats.requirements}
                </Title>
                <Paragraph>Requirements</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Theme Info */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Title>Current Theme</Title>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
              <Chip 
                mode="outlined"
                style={{ marginRight: 8 }}
              >
                {tenant.theme?.palette || 'modern'}
              </Chip>
              <Button 
                mode="text" 
                onPress={() => navigation.navigate('ThemeSettings')}
              >
                Customize
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Contact Info Preview */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Title>Contact Information</Title>
            <Divider style={{ marginVertical: 12 }} />
            
            {tenant.contact?.phone && (
              <Paragraph>📞 {tenant.contact.phone}</Paragraph>
            )}
            {tenant.contact?.email && (
              <Paragraph>✉️ {tenant.contact.email}</Paragraph>
            )}
            {tenant.contact?.whatsapp && (
              <Paragraph>💬 {tenant.contact.whatsapp}</Paragraph>
            )}
            
            <Button 
              mode="text" 
              onPress={() => navigation.navigate('SiteSettings')}
              style={{ marginTop: 12 }}
            >
              Update Contact Info
            </Button>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={{ marginBottom: 100 }}>
          <Card.Content>
            <Title>Quick Actions</Title>
            
            <Button 
              mode="outlined" 
              icon="home-plus"
              onPress={() => navigation.navigate('AddProperty')}
              style={{ marginTop: 12 }}
            >
              Add New Property
            </Button>
            
            <Button 
              mode="outlined" 
              icon="format-list-bulleted"
              onPress={() => navigation.navigate('AddRequirement')}
              style={{ marginTop: 8 }}
            >
              Add New Requirement
            </Button>
            
            <Button 
              mode="outlined" 
              icon="cog"
              onPress={() => navigation.navigate('SiteSettings')}
              style={{ marginTop: 8 }}
            >
              Website Settings
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        icon="plus"
        onPress={() => navigation.navigate('AddProperty')}
      />
    </View>
  );
};

export default BrokerSiteScreen;