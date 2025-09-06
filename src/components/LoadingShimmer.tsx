import React from 'react';
import { View, StyleSheet } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
// ========================= THE FIX IS HERE =========================
// We now import LinearGradient from Expo's own library, which is
// already included in the Expo Go app.
import { LinearGradient } from 'expo-linear-gradient';
// ===================================================================

// This is a placeholder for a single card.
const ShimmerCard = () => (
    <View style={styles.card}>
        <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            style={styles.imagePlaceholder}
            shimmerColors={['#F0F0F0', '#E0E0E0', '#F0F0E0']}
        />
        <View style={styles.content}>
            <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={styles.titlePlaceholder}
                shimmerColors={['#F0F0F0', '#E0E0E0', '#F0F0E0']}
            />
            <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={styles.subtitlePlaceholder}
                shimmerColors={['#F0F0F0', '#E0E0E0', '#F0F0E0']}
            />
            <View style={styles.bottomRow}>
                <ShimmerPlaceHolder
                    LinearGradient={LinearGradient}
                    style={styles.pricePlaceholder}
                    shimmerColors={['#F0F0F0', '#E0E0E0', '#F0F0E0']}
                />
                <ShimmerPlaceHolder
                    LinearGradient={LinearGradient}
                    style={styles.tagPlaceholder}
                    shimmerColors={['#F0F0F0', '#E0E0E0', '#F0F0E0']}
                />
            </View>
        </View>
    </View>
);

// This is the component you will import into your screens.
const LoadingShimmer = () => {
  return (
    <View style={styles.container}>
      {[...Array(3)].map((_, index) => (
        <ShimmerCard key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 16
    },
    card: {
        borderRadius: 20,
        marginBottom: 24,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    imagePlaceholder: {
        height: 180,
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    content: {
        padding: 16,
    },
    titlePlaceholder: {
        height: 24,
        width: '70%',
        borderRadius: 8,
        marginBottom: 8,
    },
    subtitlePlaceholder: {
        height: 16,
        width: '50%',
        borderRadius: 8,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    pricePlaceholder: {
        height: 28,
        width: '40%',
        borderRadius: 8,
    },
    tagPlaceholder: {
        height: 28,
        width: '30%',
        borderRadius: 8,
        marginLeft: 16,
    }
});

export default LoadingShimmer;