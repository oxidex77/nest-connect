import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Appbar, Card, Title, ActivityIndicator, Button } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { getMyRequirements } from '../../services/api';
import { RequirementsStackParamList } from '../../navigation/types'; 

type MyRequirementsNavigationProp = StackNavigationProp<RequirementsStackParamList, 'MyRequirements'>;

// Define the Requirement type based on our Mongoose model
interface Requirement {
    _id: string;
    clientName: string;
    purpose: string;
    propertyTypes: string[];
    budget: { min: number; max: number; };
    preferredLocations: { city: string, areas: string[] }[];
}

const RequirementCard = ({ item, onPress }: { item: Requirement; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress}>
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Title style={styles.cardTitle}>{item.clientName}'s Requirement</Title>
                    {/* Placeholder for match count */}
                    <View style={styles.matchChip}><Text style={styles.matchChipText}>Find Matches</Text></View>
                </View>
                <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                        <Icon name="tag-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>Looking to {item.purpose}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Icon name="floor-plan" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{item.propertyTypes.join(', ')}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Icon name="cash" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>
                            Budget: ₹{item.budget.min/100000}L - ₹{item.budget.max/100000}L
                        </Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    </TouchableOpacity>
);

const MyRequirementsScreen = () => {
    const navigation = useNavigation<MyRequirementsNavigationProp>();
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadRequirements = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getMyRequirements();
            setRequirements(data);
        } catch (error) {
            console.error(error);
            // Optionally show a snackbar or error message to the user
        } finally {
            setLoading(false);
        }
    }, []);

    // useFocusEffect will refetch data every time the screen comes into view
    useFocusEffect(
        useCallback(() => {
            loadRequirements();
        }, [loadRequirements])
    );

    if (loading && requirements.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} size="large" color="#4F46E5" />
                <Text style={styles.loadingText}>Loading Your Requirements...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header elevated={true} style={{ backgroundColor: '#FFFFFF' }}>
                <Appbar.Content title="My Requirements" titleStyle={styles.appbarTitle} />
            </Appbar.Header>

            {requirements.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="file-document-outline" size={80} color="#D1D5DB" />
                    <Text style={styles.emptyTitle}>No Requirements Found</Text>
                    <Text style={styles.emptySubtitle}>Tap the '+' button to add your first client requirement.</Text>
                </View>
            ) : (
                <FlatList
                    data={requirements}
                    renderItem={({ item }) => (
                        <RequirementCard
                            item={item}
                            onPress={() => navigation.navigate('RequirementMatches', { requirementId: item._id, requirementName: item.clientName })}
                        />
                    )}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={loadRequirements} colors={['#4F46E5']} />}
                    ListHeaderComponent={<Text style={styles.headerText}>You have {requirements.length} active requirements.</Text>}
                />
            )}
        </SafeAreaView>
    );
};

// --- Styles (using the existing beautiful styles) ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    appbarTitle: { fontWeight: 'bold' },
    list: { padding: 16 },
    headerText: { fontSize: 16, color: '#6B7280', paddingBottom: 16 },
    card: { marginBottom: 16, backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    cardTitle: { fontWeight: 'bold', color: '#1F2937' },
    matchChip: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
    matchChipText: { color: '#4338CA', fontWeight: '600' },
    detailsContainer: { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderColor: '#F3F4F6' },
    detailItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    detailText: { marginLeft: 12, color: '#374151', fontSize: 14, textTransform: 'capitalize' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
    loadingText: { marginTop: 10, fontSize: 16, color: '#6B7280' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyTitle: { marginTop: 16, fontWeight: 'bold', color: '#1F2937' },
    emptySubtitle: { marginTop: 8, textAlign: 'center', color: '#6B7280', lineHeight: 20 },
});

export default MyRequirementsScreen;