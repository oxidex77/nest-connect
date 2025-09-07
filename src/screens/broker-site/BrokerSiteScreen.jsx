import React, { useState, useCallback } from 'react';
import { View, ScrollView, Alert, Linking, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  Chip,
  ActivityIndicator,
  Divider,
  Appbar
} from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getUserData } from '../../services/auth';
import { getMyTenant } from '../../services/api'; // For refreshing data
import { MAIN_WEBSITE_URL } from '../../config/constants'; // Use the constant for the Vercel URL

const BrokerSiteScreen = () => {
  const navigation = useNavigation<any>();
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // This function loads the initial data saved on the device
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await getUserData();
      if (userData?.tenant) {
        setTenant(userData.tenant);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load your website data');
    } finally {
      setLoading(false);
    }
  }, []);

  // This function refreshes the data from the live API
  const refreshTenantData = useCallback(async () => {
    setRefreshing(true);
    try {
      // getMyTenant fetches the latest tenant data from the backend
      const latestTenantData = await getMyTenant();
      setTenant(latestTenantData);
    } catch (error) {
      Alert.alert('Refresh Failed', 'Could not update website data from the server.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  // useFocusEffect will load the initial data every time the screen is viewed
  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [loadInitialData])
  );

  // --- CORRECTED URL LOGIC ---
  const openWebsite = () => {
    if (tenant?.subdomain) {
      // Construct the URL with the query parameter for Vercel
      const url = `${MAIN_WEBSITE_URL}?broker=${tenant.subdomain}`;
      Linking.openURL(url).catch(err => Alert.alert('Error', 'Could not open the website.'));
    }
  };

  const shareWebsite = async () => {
    if (tenant?.subdomain) {
      const url = `${MAIN_WEBSITE_URL}?broker=${tenant.subdomain}`;
      const message = `Check out my real estate website: ${url}`;
      try {
        const { Share } = await import('react-native');
        await Share.share({ message });
      } catch (error) {
        Alert.alert('Error', 'Failed to share website');
      }
    }
  };
  // --- END OF CORRECTION ---

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Paragraph style={{ marginTop: 16 }}>Loading your website details...</Paragraph>
      </View>
    );
  }

  if (!tenant) {
    return (
      <SafeAreaView style={styles.container}>
         <Appbar.Header elevated style={{backgroundColor: '#FFFFFF'}}>
            <Appbar.Content title="My Website" titleStyle={styles.appbarTitle} />
        </Appbar.Header>
        <View style={styles.centerContainer}>
            <Card style={styles.card}>
            <Card.Content style={{ alignItems: 'center', padding: 32 }}>
                <Title>No Website Found</Title>
                <Paragraph style={{ textAlign: 'center', marginVertical: 16 }}>
                It looks like your broker website isn't set up yet.
                </Paragraph>
            </Card.Content>
            </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
        <Appbar.Header elevated style={{backgroundColor: '#FFFFFF'}}>
            <Appbar.Content title="My Website" titleStyle={styles.appbarTitle} />
        </Appbar.Header>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshTenantData} />
        }
      >
        {/* Website Info */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Title style={styles.displayName}>{tenant.displayName}</Title>
                <Paragraph style={styles.urlText} selectable>
                  {MAIN_WEBSITE_URL}?broker={tenant.subdomain}
                </Paragraph>
              </View>
              <Chip 
                mode="flat" 
                style={[styles.statusChip, { backgroundColor: tenant.status === 'active' ? '#D1FAE5' : '#FEE2E2'}]}
                textStyle={{color: tenant.status === 'active' ? '#065F46' : '#991B1B'}}
              >
                {tenant.status}
              </Chip>
            </View>
            <View style={styles.buttonRow}>
              <Button mode="contained" icon="web" onPress={openWebsite} style={{ flex: 1 }}>
                View Site
              </Button>
              <Button mode="outlined" icon="share-variant" onPress={shareWebsite} style={{ flex: 1 }}>
                Share
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Stats */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Quick Stats</Title>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Title style={[styles.statValue, { color: '#3b82f6' }]}>{tenant.analytics?.viewCount || 0}</Title>
                <Paragraph>Views</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={[styles.statValue, { color: '#10b981' }]}>0</Title>
                <Paragraph>Properties</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={[styles.statValue, { color: '#f59e0b' }]}>0</Title>
                <Paragraph>Requirements</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Settings</Title>
            <Divider style={{ marginVertical: 12 }} />
            <Button 
              mode="text" 
              icon="palette"
              onPress={() => Alert.alert("Coming Soon!", "Theme customization will be available in a future update.")}
              style={styles.settingsButton}
            >
              Customize Theme
            </Button>
            <Button 
              mode="text" 
              icon="card-account-details-outline"
              onPress={() => Alert.alert("Coming Soon!", "You will be able to edit your site details here.")}
              style={styles.settingsButton}
            >
              Update Contact Info
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    appbarTitle: {
        fontWeight: 'bold',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F8FAFC',
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    card: {
        marginBottom: 16,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    displayName: {
        fontWeight: 'bold',
    },
    urlText: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    statusChip: {
        borderRadius: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    settingsButton: {
        justifyContent: 'flex-start',
        marginTop: 8,
    }
});

export default BrokerSiteScreen;