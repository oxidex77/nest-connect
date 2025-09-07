// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
// import { Text, Appbar, Button } from 'react-native-paper';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { RootStackParamList } from '../../navigation/AppNavigator';
// import { Project, fetchMatchingProjects } from '../../api/mockData';

// // --- Theme Colors ---
// const purpleColor = '#8B5CF6';
// const blackColor = '#111827';
// const whiteColor = '#FFFFFF';
// const greyColor = '#6B7280';
// const lightGreyColor = '#F3F4F6';
// const lightPurpleBg = '#F5F3FF';

// // --- Icon Mapping ---
// const AMENITY_ICONS: { [key: string]: string } = {
//     pool: 'pool', gym: 'weight-lifter', garden: 'flower-tulip', security: 'shield-check',
//     clubhouse: 'domain', 'kids-play-area': 'human-child', cctv: 'cctv', lift: 'elevator'
// };

// // --- Reusable Row Component for Perfect Alignment ---
// // By adding a '?' after 'children', we mark it as an optional prop.
// const Row = ({ children, style }: { children?: React.ReactNode, style?: any }) => (
//     <View style={[styles.row, style]}>{children}</View>
// );

// // --- NEW: Static Labels Column Component ---
// const LabelsColumn = () => (
//     <View style={styles.labelsColumn}>
//         <Row style={styles.headerRow}><Text style={styles.labelTextHeader}>Project Details</Text></Row>
//         <Row><Text style={styles.labelText}>Developer</Text></Row>
//         <Row><Text style={styles.labelText}>Location</Text></Row>
//         <Row><Text style={styles.labelText}>Possession</Text></Row>
//         <Row><Text style={styles.labelText}>2 BHK Price</Text></Row>
//         <Row><Text style={styles.labelText}>3 BHK Price</Text></Row>
//         <Row style={styles.amenitiesRow}><Text style={styles.labelText}>Amenities</Text></Row>
//         <Row style={styles.highlightsRow}><Text style={styles.labelText}>Highlights</Text></Row>
//         <Row style={styles.actionsRow} />
//     </View>
// );

// // --- NEW: Dynamically Rendered Project Column Component ---
// const ProjectColumn = ({ project }: { project: Project }) => {
//     const findConfig = (type: '1 BHK' | '2 BHK' | '3 BHK') => project.configurations.find(c => c.type === type);

//     return (
//         <View style={styles.projectColumn}>
//             {/* Project Name Header */}
//             <Row style={[styles.headerRow, { backgroundColor: lightPurpleBg }]}>
//                 <View>
//                     <Text style={styles.projectName}>{project.projectName}</Text>
//                 </View>
//             </Row>

//             {/* Data Cells that align with LabelsColumn */}
//             <Row><Text style={styles.cellText} numberOfLines={1}>{project.developerName}</Text></Row>
//             <Row><Text style={styles.cellText} numberOfLines={1}>{project.location}</Text></Row>
//             <Row><Text style={styles.cellText}>{project.possessionDate}</Text></Row>
//             <Row><Text style={styles.cellText}>{findConfig('2 BHK')?.priceRange || '—'}</Text></Row>
//             <Row><Text style={styles.cellText}>{findConfig('3 BHK')?.priceRange || '—'}</Text></Row>

//             <Row style={styles.amenitiesRow}>
//                 <View style={styles.amenitiesContainer}>
//                     {project.amenities.slice(0, 5).map(amenity => (
//                         <Icon key={amenity} name={AMENITY_ICONS[amenity] || 'star-circle'} size={20} color={greyColor} style={{ marginRight: 8 }} />
//                     ))}
//                 </View>
//             </Row>

//             <Row style={styles.highlightsRow}>
//                 {project.highlights.map(highlight => (
//                     <Text key={highlight} style={styles.highlightText}>• {highlight}</Text>
//                 ))}
//             </Row>

//             <Row style={styles.actionsRow}>
//                 <Button mode="contained" compact style={{ backgroundColor: purpleColor }}>Interested</Button>
//             </Row>
//         </View>
//     );
// };


// const ProjectComparisonDeckScreen = () => {
//     const navigation = useNavigation();
//     const route = useRoute<RouteProp<RootStackParamList, 'ProjectComparisonDeck'>>();
//     const [projects, setProjects] = useState<Project[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchMatchingProjects(route.params.requirements)
//             .then(setProjects)
//             .finally(() => setLoading(false));
//     }, [route.params.requirements]);

//     if (loading) {
//         return (
//             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: whiteColor }}>
//                 <ActivityIndicator size="large" color={purpleColor} />
//             </View>
//         );
//     }

//     return (
//         <SafeAreaView style={styles.container}>
//             <Appbar.Header style={styles.appbar}>
//                 <Appbar.BackAction onPress={() => navigation.goBack()} color={blackColor} />
//                 <Appbar.Content title="Project Comparison Deck" titleStyle={styles.appbarTitle} />
//             </Appbar.Header>

//             {/* The Main Comparison Matrix */}
//             <View style={styles.matrixContainer}>
//                 <LabelsColumn />
//                 <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                     {projects.map(project => (
//                         <ProjectColumn key={project.id} project={project} />
//                     ))}
//                 </ScrollView>
//             </View>

//             {/* --- ACTION BAR --- */}
//             <View style={styles.actionBar}>
//                 <TouchableOpacity style={styles.actionButton}>
//                     <Icon name="file-pdf-box" size={24} color={purpleColor} />
//                     <Text style={styles.actionText}>Share PDF</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.actionButton}>
//                     <Icon name="download-box-outline" size={24} color={purpleColor} />
//                     <Text style={styles.actionText}>Brochures</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.actionButton}>
//                     <Icon name="whatsapp" size={24} color={purpleColor} />
//                     <Text style={styles.actionText}>Send</Text>
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: whiteColor },
//     appbar: { backgroundColor: whiteColor, elevation: 2 },
//     appbarTitle: { fontWeight: 'bold', color: blackColor },
//     matrixContainer: {
//         flex: 1,
//         flexDirection: 'row',
//     },
//     // --- Column Styles ---
//     labelsColumn: {
//         width: 120,
//         backgroundColor: lightGreyColor,
//         borderRightWidth: 1,
//         borderRightColor: '#E5E7EB',
//     },
//     projectColumn: {
//         width: Dimensions.get('window').width * 0.6, // Each project takes 60% of the screen width
//         borderRightWidth: 1,
//         borderRightColor: '#E5E7EB',
//     },
//     // --- Row Styles for Alignment ---
//     row: {
//         height: 55,
//         paddingHorizontal: 12,
//         justifyContent: 'center',
//         borderBottomWidth: 1,
//         borderBottomColor: '#E5E7EB',
//     },
//     headerRow: {
//         height: 70,
//         justifyContent: 'center',
//     },
//     amenitiesRow: {
//         height: 60,
//     },
//     highlightsRow: {
//         height: 100,
//         alignItems: 'flex-start',
//     },
//     actionsRow: {
//         height: 70,
//         alignItems: 'center',
//     },
//     // --- Text and Content Styles ---
//     labelTextHeader: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: blackColor,
//     },
//     labelText: {
//         fontSize: 14,
//         fontWeight: '500',
//         color: greyColor,
//     },
//     projectName: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: blackColor,
//     },
//     developerName: {
//         fontSize: 12,
//         color: greyColor,
//     },
//     cellText: {
//         fontSize: 14,
//         color: blackColor,
//         fontWeight: '500',
//     },
//     amenitiesContainer: {
//         flexDirection: 'row',
//     },
//     highlightText: {
//         fontSize: 13,
//         color: blackColor,
//         marginBottom: 4,
//     },
//     // --- Action Bar Styles ---
//     actionBar: {
//         height: 80,
//         backgroundColor: 'rgba(255, 255, 255, 0.98)',
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         alignItems: 'center',
//         borderTopWidth: 1,
//         borderColor: '#E5E7EB',
//         paddingBottom: 10,
//     },
//     actionButton: {
//         alignItems: 'center',
//     },
//     actionText: {
//         color: purpleColor,
//         fontWeight: '500',
//         marginTop: 4,
//         fontSize: 12,
//     },
// });

// export default ProjectComparisonDeckScreen;


import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Text, Appbar, Button } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../navigation/types'; // <-- CORRECTED IMPORT

// --- TYPE DEFINITION (Self-contained within the file) ---
export interface Project {
  id: string;
  projectName: string;
  developerName: string;
  location: string;
  possessionDate: string;
  configurations: { type: '1 BHK' | '2 BHK' | '3 BHK'; priceRange: string; }[];
  amenities: string[];
  highlights: string[];
}

// --- MOCK DATA (TEMPORARY) ---
// This data now lives here temporarily until the backend for Projects is built.
const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj1',
    projectName: 'Elysian Towers',
    developerName: 'Prestige Group',
    location: 'Mira Road East',
    possessionDate: 'Dec 2026',
    configurations: [
      { type: '2 BHK', priceRange: '₹1.3–1.5 Cr' },
      { type: '3 BHK', priceRange: '₹1.9–2.2 Cr' },
    ],
    amenities: ['pool', 'gym', 'garden', 'security', 'clubhouse'],
    highlights: ['Italian Marble Flooring', 'Rooftop Infinity Pool', 'EV Charging Points'],
  },
  {
    id: 'proj2',
    projectName: 'Orchid Paradise',
    developerName: 'Lodha Group',
    location: 'Kandivali West',
    possessionDate: 'Jun 2025',
    configurations: [
      { type: '1 BHK', priceRange: '₹85–95 L' },
      { type: '2 BHK', priceRange: '₹1.4–1.6 Cr' },
    ],
    amenities: ['gym', 'garden', 'kids-play-area', 'cctv', 'lift'],
    highlights: ['Vastu Compliant Homes', 'Podium Garden', 'High-speed Elevators'],
  },
];

// --- Theme Colors & Icons ---
const purpleColor = '#8B5CF6';
const blackColor = '#111827';
const whiteColor = '#FFFFFF';
const greyColor = '#6B7280';
const lightGreyColor = '#F3F4F6';
const lightPurpleBg = '#F5F3FF';
const AMENITY_ICONS: { [key: string]: string } = {
    pool: 'pool', gym: 'weight-lifter', garden: 'flower-tulip', security: 'shield-check',
    clubhouse: 'domain', 'kids-play-area': 'human-child', cctv: 'cctv', lift: 'elevator'
};

// --- Reusable & Static Components ---
const Row = ({ children, style }: { children?: React.ReactNode, style?: any }) => <View style={[styles.row, style]}>{children}</View>;

const LabelsColumn = () => (
    <View style={styles.labelsColumn}>
        <Row style={styles.headerRow}><Text style={styles.labelTextHeader}>Project Details</Text></Row>
        <Row><Text style={styles.labelText}>Developer</Text></Row>
        <Row><Text style={styles.labelText}>Location</Text></Row>
        <Row><Text style={styles.labelText}>Possession</Text></Row>
        <Row><Text style={styles.labelText}>2 BHK Price</Text></Row>
        <Row><Text style={styles.labelText}>3 BHK Price</Text></Row>
        <Row style={styles.amenitiesRow}><Text style={styles.labelText}>Amenities</Text></Row>
        <Row style={styles.highlightsRow}><Text style={styles.labelText}>Highlights</Text></Row>
        <Row style={styles.actionsRow} />
    </View>
);

const ProjectColumn = ({ project }: { project: Project }) => {
    const findConfig = (type: '2 BHK' | '3 BHK') => project.configurations.find(c => c.type === type);
    return (
        <View style={styles.projectColumn}>
            <Row style={[styles.headerRow, { backgroundColor: lightPurpleBg }]}><Text style={styles.projectName}>{project.projectName}</Text></Row>
            <Row><Text style={styles.cellText} numberOfLines={1}>{project.developerName}</Text></Row>
            <Row><Text style={styles.cellText} numberOfLines={1}>{project.location}</Text></Row>
            <Row><Text style={styles.cellText}>{project.possessionDate}</Text></Row>
            <Row><Text style={styles.cellText}>{findConfig('2 BHK')?.priceRange || '—'}</Text></Row>
            <Row><Text style={styles.cellText}>{findConfig('3 BHK')?.priceRange || '—'}</Text></Row>
            <Row style={styles.amenitiesRow}>
                <View style={styles.amenitiesContainer}>
                    {project.amenities.slice(0, 5).map(a => <Icon key={a} name={AMENITY_ICONS[a] || 'star'} size={20} color={greyColor} style={{ marginRight: 8 }} />)}
                </View>
            </Row>
            <Row style={styles.highlightsRow}>
                {project.highlights.map(h => <Text key={h} style={styles.highlightText}>• {h}</Text>)}
            </Row>
            <Row style={styles.actionsRow}><Button mode="contained" compact style={{ backgroundColor: purpleColor }}>Interested</Button></Row>
        </View>
    );
};

// --- Main Screen Component ---
const ProjectComparisonDeckScreen = () => {
    const navigation = useNavigation();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace this with a real API call when the backend is ready.
        // For now, we simulate a network delay and use our temporary mock data.
        setTimeout(() => {
            setProjects(MOCK_PROJECTS);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={purpleColor} /></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color={blackColor} />
                <Appbar.Content title="Project Comparison Deck" titleStyle={styles.appbarTitle} />
            </Appbar.Header>
            <View style={styles.matrixContainer}>
                <LabelsColumn />
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {projects.map(project => <ProjectColumn key={project.id} project={project} />)}
                </ScrollView>
            </View>
            <View style={styles.actionBar}>
                <TouchableOpacity style={styles.actionButton}><Icon name="file-pdf-box" size={24} color={purpleColor} /><Text style={styles.actionText}>Share PDF</Text></TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}><Icon name="download-box-outline" size={24} color={purpleColor} /><Text style={styles.actionText}>Brochures</Text></TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}><Icon name="whatsapp" size={24} color={purpleColor} /><Text style={styles.actionText}>Send</Text></TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: whiteColor },
    appbar: { backgroundColor: whiteColor, elevation: 2 },
    appbarTitle: { fontWeight: 'bold', color: blackColor },
    matrixContainer: { flex: 1, flexDirection: 'row' },
    labelsColumn: { width: 120, backgroundColor: lightGreyColor, borderRightWidth: 1, borderRightColor: '#E5E7EB' },
    projectColumn: { width: Dimensions.get('window').width * 0.6, borderRightWidth: 1, borderRightColor: '#E5E7EB' },
    row: { height: 55, paddingHorizontal: 12, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    headerRow: { height: 70, justifyContent: 'center' },
    amenitiesRow: { height: 60 },
    highlightsRow: { height: 100, justifyContent: 'center' },
    actionsRow: { height: 70, alignItems: 'center' },
    labelTextHeader: { fontSize: 16, fontWeight: 'bold', color: blackColor },
    labelText: { fontSize: 14, fontWeight: '500', color: greyColor },
    projectName: { fontSize: 16, fontWeight: 'bold', color: blackColor },
    cellText: { fontSize: 14, color: blackColor, fontWeight: '500' },
    amenitiesContainer: { flexDirection: 'row' },
    highlightText: { fontSize: 13, color: blackColor, marginBottom: 4 },
    actionBar: { height: 80, backgroundColor: 'rgba(255, 255, 255, 0.98)', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderColor: '#E5E7EB', paddingBottom: 10 },
    actionButton: { alignItems: 'center' },
    actionText: { color: purpleColor, fontWeight: '500', marginTop: 4, fontSize: 12 },
});

export default ProjectComparisonDeckScreen;