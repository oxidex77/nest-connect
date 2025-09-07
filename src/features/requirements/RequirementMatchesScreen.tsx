import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Text, Appbar, Chip, useTheme, ActivityIndicator, Icon } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import MatchCard from '../../components/MatchCard';
import LoadingShimmer from '../../components/LoadingShimmer';

// This screen is now ready for a future API call like `fetchMatches(requirementId)`
const RequirementMatchesScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const theme = useTheme();
    const { requirementId, requirementName } = route.params;

    const [matches, setMatches] = useState<any[]>([]); // Will hold property data in the future
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('Best Match');

    useEffect(() => {
        // --- TODO: Future API Call ---
        // In the future, you would make an API call here:
        // fetchMatchesForRequirement(requirementId).then(setMatches).finally(() => setLoading(false));
        
        // For now, we simulate a delay and then show an empty state.
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, [requirementId]);
    
    const filters = ['Best Match', 'Price: Low to High', 'Newest First', 'Carpet Area'];

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header elevated style={{ backgroundColor: '#FFFFFF' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={`Matches for '${requirementName}'`} titleStyle={{fontWeight: 'bold'}} />
            </Appbar.Header>

            {/* Filter Chips can remain as they are UI-only for now */}
            
            {loading ? (
                <LoadingShimmer />
            ) : matches.length > 0 ? (
                <FlatList
                    data={matches}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => <MatchCard property={item} />}
                    contentContainerStyle={styles.list}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Icon name="home-search-outline" size={80} color="#D1D5DB" />
                    <Text style={styles.emptyTitle}>No Matches Found Yet</Text>
                    <Text style={styles.emptySubtitle}>The AI matching engine is warming up. This feature is coming soon!</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    list: { paddingHorizontal: 16, paddingTop: 16 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyTitle: { marginTop: 16, fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
    emptySubtitle: { marginTop: 8, textAlign: 'center', color: '#6B7280', lineHeight: 20 },
});

export default RequirementMatchesScreen;