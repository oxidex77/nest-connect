import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { Card, Text, Button, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Requirement } from '../api/mockData';

interface RequirementCardProps {
  requirement: Requirement;
}

const RequirementCard = ({ requirement }: RequirementCardProps) => {
  const handleCall = () => {
    Linking.openURL(`tel:${requirement.contact_phone}`);
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.name}>{requirement.name}</Text>
        </View>
        <Text variant="bodyMedium" style={styles.person}>
          <Icon name="account-circle-outline" size={16} color="#657786" /> {requirement.contact_person}
        </Text>

        <View style={styles.chipContainer}>
            <Chip icon="map-marker-outline" style={styles.chip}>{requirement.location}</Chip>
            <Chip icon="floor-plan" style={styles.chip}>{requirement.config}</Chip>
        </View>

        <View style={styles.footer}>
            <View>
                <Text variant="bodySmall" style={styles.budgetLabel}>Budget</Text>
                <Text variant="headlineSmall" style={styles.budget}>{requirement.budget}</Text>
            </View>
            <Button
                mode="contained"
                icon="phone"
                style={styles.button}
                onPress={handleCall}
            >
                Call Now
            </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F2F5',
  },
  header: {
    marginBottom: 8,
  },
  name: {
    fontWeight: 'bold',
  },
  person: {
    color: '#657786',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#F0F2F5'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
    paddingTop: 12,
    marginTop: 4,
  },
  budgetLabel: {
    color: '#657786',
    fontSize: 12,
  },
  budget: {
    fontWeight: 'bold',
    color: '#14171A',
  },
  button: {
    borderRadius: 8,
    backgroundColor: '#28a745', // Green for a clear 'Call' action
  },
});

export default RequirementCard;