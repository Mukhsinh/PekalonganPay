import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
    primary: '#DC2626',
    secondary: '#FACC15',
    accent: '#2563EB',
    background: '#F8FAFC',
    white: '#FFFFFF',
    text: '#1E293B',
    textMuted: '#64748B',
    success: '#10B981',
};

const CATEGORIES = [
    { id: 'all', label: 'Semua', icon: '📋' },
    { id: 'batik', label: 'Batik', icon: '🎨' },
    { id: 'kuliner', label: 'Kuliner', icon: '🍜' },
    { id: 'kerajinan', label: 'Kerajinan', icon: '✨' },
    { id: 'jasa', label: 'Jasa', icon: '🔧' },
];

const MERCHANTS = [
    { id: '1', name: 'Batik Pesisir Pekalongan', category: 'batik', rating: 4.8, reviews: 156, distance: '0.5 km', verified: true, description: 'Batik cap dan tulis khas pesisir Pekalongan', accentColor: '#8B4513' },
    { id: '2', name: 'Soto Tauto Pak Marto', category: 'kuliner', rating: 4.9, reviews: 312, distance: '0.8 km', verified: true, description: 'Soto tauto legendaris sejak 1985', accentColor: COLORS.primary },
    { id: '3', name: 'Megono Bu Siti Khas Pekalongan', category: 'kuliner', rating: 4.7, reviews: 89, distance: '1.2 km', verified: true, description: 'Nasi megono dan garang asem', accentColor: COLORS.accent },
    { id: '4', name: 'Kerajinan Anyaman Rotan', category: 'kerajinan', rating: 4.5, reviews: 45, distance: '2.1 km', verified: false, description: 'Kerajinan rotan berkualitas ekspor', accentColor: '#D4A843' },
    { id: '5', name: 'Batik Jlamprang Al-Fatih', category: 'batik', rating: 4.6, reviews: 78, distance: '3.0 km', verified: true, description: 'Batik jlamprang motif klasik Pekalongan', accentColor: '#2E0854' },
    { id: '6', name: 'Service HP Cepat', category: 'jasa', rating: 4.3, reviews: 34, distance: '0.3 km', verified: false, description: 'Service HP semua merk, garansi 30 hari', accentColor: '#00D9C0' },
];

export default function UMKMScreen() {
    const insets = useSafeAreaInsets();
    const [activeCategory, setActiveCategory] = useState('all');
    const [search, setSearch] = useState('');

    const filtered = MERCHANTS.filter((m) => {
        const matchCategory = activeCategory === 'all' || m.category === activeCategory;
        const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <View style={styles.titleRow}>
                    <Text style={styles.headerTitle}>UMKM Pekalongan</Text>
                    <TouchableOpacity style={styles.mapButton}>
                        <Ionicons name="map" size={20} color={COLORS.accent} />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={COLORS.textMuted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cari UMKM, batik, kuliner..."
                        placeholderTextColor={COLORS.textMuted}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* Category Pills */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryScroll}
                >
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            onPress={() => setActiveCategory(cat.id)}
                            style={[
                                styles.categoryPill,
                                activeCategory === cat.id && styles.categoryPillActive
                            ]}
                        >
                            <Text style={styles.categoryIcon}>{cat.icon}</Text>
                            <Text style={[
                                styles.categoryLabel,
                                activeCategory === cat.id && styles.categoryLabelActive
                            ]}>
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                <View style={styles.resultsHeader}>
                    <Text style={styles.resultsCount}>{filtered.length} UMKM ditemukan</Text>
                    <TouchableOpacity style={styles.filterButton}>
                        <Ionicons name="options-outline" size={16} color={COLORS.textMuted} />
                        <Text style={styles.filterButtonText}>Filter</Text>
                    </TouchableOpacity>
                </View>

                {filtered.map((merchant) => (
                    <TouchableOpacity
                        key={merchant.id}
                        activeOpacity={0.9}
                        style={styles.merchantCard}
                    >
                        <View style={[styles.cardDecor, { backgroundColor: merchant.accentColor }]} />
                        <View style={styles.cardContent}>
                            <View style={styles.cardHeader}>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.merchantTitleRow}>
                                        <Text style={styles.merchantName} numberOfLines={1}>
                                            {merchant.name}
                                        </Text>
                                        {merchant.verified && (
                                            <View style={styles.verifiedBadge}>
                                                <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.merchantDesc} numberOfLines={2}>
                                        {merchant.description}
                                    </Text>
                                </View>
                                <View style={styles.ratingBadge}>
                                    <Ionicons name="star" size={14} color={COLORS.secondary} />
                                    <Text style={styles.ratingText}>{merchant.rating}</Text>
                                </View>
                            </View>

                            <View style={styles.cardFooter}>
                                <View style={styles.footerInfo}>
                                    <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
                                    <Text style={styles.footerText}>{merchant.distance}</Text>
                                </View>
                                <View style={styles.footerInfo}>
                                    <Ionicons name="chatbubble-outline" size={14} color={COLORS.textMuted} />
                                    <Text style={styles.footerText}>{merchant.reviews} Ulasan</Text>
                                </View>
                                <TouchableOpacity style={styles.visitButton}>
                                    <Text style={styles.visitButtonText}>Kunjungi</Text>
                                    <Ionicons name="chevron-forward" size={12} color={COLORS.white} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.text,
    },
    mapButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.accent + '10',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        height: 48,
        marginLeft: 10,
        fontSize: 14,
        color: COLORS.text,
    },
    categoryScroll: {
        gap: 10,
    },
    categoryPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    categoryPillActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    categoryIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    categoryLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    categoryLabelActive: {
        color: COLORS.white,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 16,
    },
    resultsCount: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    filterButtonText: {
        fontSize: 14,
        color: COLORS.textMuted,
        fontWeight: '500',
    },
    merchantCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        flexDirection: 'row',
    },
    cardDecor: {
        width: 6,
        height: '100%',
    },
    cardContent: {
        flex: 1,
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    merchantTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    merchantName: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        maxWidth: '85%',
    },
    verifiedBadge: {
        marginTop: 2,
    },
    merchantDesc: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 4,
        lineHeight: 18,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.secondary + '15',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.secondary,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        gap: 12,
    },
    footerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    footerText: {
        fontSize: 12,
        color: COLORS.textMuted,
        fontWeight: '500',
    },
    visitButton: {
        marginLeft: 'auto',
        backgroundColor: COLORS.accent,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    visitButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.white,
    },
});
