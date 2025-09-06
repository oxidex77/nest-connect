import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MatchedProperty } from '../api/mockData';

interface MatchCardProps {
  property: MatchedProperty;
  onPress?: () => void;
}

const MatchCard = ({ property, onPress }: MatchCardProps) => {
    const theme = useTheme();
    // Using a consistent placeholder image service based on property ID
    const propertyImage = `https://picsum.photos/seed/${property.id}/400/300`;

    return (
        <TouchableOpacity onPress={onPress} style={styles.card}>
            <Image source={{ uri: propertyImage }} style={styles.cardImage} />
            <View style={styles.badgeContainer}>
                <View style={[styles.badge, { backgroundColor: '#10B981' }]}>
                    <Icon name="check-decagram" size={14} color="#fff" />
                    <Text style={styles.badgeText}>{property.match_percentage}% Match</Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text variant="titleLarge" style={styles.propertyName} numberOfLines={1}>{property.property_name}</Text>
                <Text style={styles.location} numberOfLines={1}>
                    <Icon name="map-marker-outline" /> {property.location}
                </Text>

                <View style={styles.detailsRow}>
                    <Text style={styles.price}>{property.price}</Text>
                    <View style={styles.separator} />
                    <Text style={styles.detailText}>{property.config}</Text>
                    <View style={styles.separator} />
                    <Text style={styles.detailText}>{property.carpet_area}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        marginBottom: 24,
        backgroundColor: '#FFFFFF',
        elevation: 4,
        shadowColor: '#4B5563',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    cardImage: {
        height: 180,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    badgeContainer: {
        position: 'absolute',
        top: 16,
        left: 16,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 12,
    },
    content: {
        padding: 16,
    },
    propertyName: {
        fontWeight: 'bold',
        color: '#1F2937',
    },
    location: {
        color: '#6B7280',
        marginTop: 4,
        fontSize: 14,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
    },
    separator: {
        height: 16,
        width: 1,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 12,
    },
    detailText: {
        fontSize: 14,
        color: '#4B5563',
    },
});

export default MatchCard;