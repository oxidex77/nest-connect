import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { Modal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types'; // <-- CORRECTED IMPORT

// --- Color Palette ---
const colors = {
    primary: '#6366F1',
    secondary: '#F59E0B',
    surface: '#FFFFFF',
    text: '#1E293B',
    textSecondary: '#64748B',
    textLight: '#94A3B8',
    border: '#E2E8F0',
    shadow: '#0F172A',
    fabShadow: 'rgba(99, 102, 241, 0.4)',
};

// --- Enhanced Floating Action Button ---
interface EnhancedFABProps {
    onPress: () => void;
}

export const EnhancedFAB = ({ onPress }: EnhancedFABProps) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const rotateAnim = React.useRef(new Animated.Value(0)).current;

    const animatePress = () => {
        Animated.parallel([
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
            ]),
            Animated.timing(rotateAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start(() => rotateAnim.setValue(0));
    };

    const handlePress = () => {
        animatePress();
        onPress();
    };

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });

    return (
        <View style={styles.fabContainer}>
            <Animated.View style={[styles.fabWrapper, { transform: [{ scale: scaleAnim }] }]}>
                <TouchableOpacity style={styles.fabTouchable} onPress={handlePress} activeOpacity={0.9}>
                    <View style={styles.fab}>
                        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                            <Icon name="plus" size={28} color="#FFFFFF" />
                        </Animated.View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

// --- Enhanced Modal Component ---
interface EnhancedModalProps {
    visible: boolean;
    onDismiss: () => void;
    navigation: StackNavigationProp<RootStackParamList>;
}

export const EnhancedModal = ({ visible, onDismiss, navigation }: EnhancedModalProps) => {
    const slideAnim = React.useRef(new Animated.Value(300)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, { toValue: 0, tension: 100, friction: 8, useNativeDriver: true }).start();
        } else {
            Animated.timing(slideAnim, { toValue: 300, duration: 250, useNativeDriver: true }).start();
        }
    }, [visible]);

    return (
        <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
            <Animated.View style={[styles.modalWrapper, { transform: [{ translateY: slideAnim }] }]}>
                <View style={styles.modalSurface}>
                    <View style={styles.modalHeader}>
                        <View style={styles.modalHandle} />
                        <Text style={styles.modalTitle}>Quick Actions</Text>
                        <Text style={styles.modalSubtitle}>Choose what you'd like to add</Text>
                    </View>
                    <View style={styles.modalActions}>
                        <TouchableOpacity
                            onPress={() => { onDismiss(); navigation.navigate('CategorySelection', { flow: 'requirement' }); }}
                            style={styles.modalActionItem}
                        >
                            <View style={styles.primaryButton}>
                                <View style={styles.buttonIconContainer}><Icon name="clipboard-plus-outline" size={24} color="#FFFFFF" /></View>
                                <View style={styles.buttonTextContainer}>
                                    <Text style={styles.buttonTitle}>Add Requirement</Text>
                                    <Text style={styles.buttonSubtitle}>Find matching properties</Text>
                                </View>
                                <Icon name="arrow-right" size={20} color="rgba(255,255,255,0.8)" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { onDismiss(); navigation.navigate('CategorySelection', { flow: 'listing' }); }}
                            style={styles.modalActionItem}
                        >
                            <View style={styles.secondaryButton}>
                                <View style={[styles.buttonIconContainer, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}><Icon name="home-plus-outline" size={24} color={colors.primary} /></View>
                                <View style={styles.buttonTextContainer}>
                                    <Text style={styles.secondaryButtonTitle}>List Property</Text>
                                    <Text style={styles.secondaryButtonSubtitle}>Add to your inventory</Text>
                                </View>
                                <Icon name="arrow-right" size={20} color={colors.textLight} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    fabContainer: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 10,
        bottom: Platform.OS === 'ios' ? 30 : 20,
    },
    fabWrapper: {
        shadowColor: colors.fabShadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.6,
        shadowRadius: 16,
        elevation: 12,
    },
    fabTouchable: { borderRadius: 32 },
    fab: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#FFFFFF',
        backgroundColor: colors.secondary,
    },
    modalContainer: { margin: 0, justifyContent: 'flex-end' },
    modalWrapper: { borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' },
    modalSurface: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 24,
    },
    modalHeader: {
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: 28,
        paddingBottom: 32,
    },
    modalHandle: {
        width: 48,
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 280,
    },
    modalActions: { paddingHorizontal: 28, gap: 16 },
    modalActionItem: { borderRadius: 20, overflow: 'hidden' },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderRadius: 20,
        backgroundColor: colors.primary,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderRadius: 20,
        backgroundColor: colors.surface,
        borderWidth: 2,
        borderColor: colors.border,
    },
    buttonIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    buttonTextContainer: { flex: 1 },
    buttonTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    buttonSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
    },
    secondaryButtonTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 2,
    },
    secondaryButtonSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500',
    },
});