import { EVENT_PEKALONGAN, KULINER_KHAS, MASJID_INFO, TOKO_BATIK, WISATA_PEKALONGAN } from '@/constants/mockData';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { registerForPushNotificationsAsync, setupAllPrayerNotifications } from '@/utils/notifications';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// ── Colors ────────────────────────────────────────────────
const COLORS = {
    primary: '#DC2626', // Red 600
    primaryDark: '#991B1B', // Red 800
    secondary: '#FACC15', // Yellow 400
    accent: '#2563EB', // Blue 600
    background: '#F8FAFC',
    white: '#FFFFFF',
    text: '#1E293B',
    textMuted: '#64748B',
    success: '#10B981',
};

// ── Service Menu Data ─────────────────────────────────────
const SERVICE_MENUS = [
    { id: 'top_up', icon: 'plus-circle', label: 'Top Up', color: '#EF4444', isMCI: true },
    { id: 'transfer', icon: 'send', label: 'Transfer', color: '#2563EB', isMCI: true },
    { id: 'history', icon: 'history', label: 'Riwayat', color: '#10B981', isMCI: true },
    { id: 'pulsa_data', icon: 'cellphone-wireless', label: 'Pulsa & Data', color: '#EF4444', isMCI: true },
    { id: 'ewallet', icon: 'wallet', label: 'E-Wallet', color: '#3B82F6', isMCI: true },
    { id: 'tiket_kereta', icon: 'train-variant', label: 'Tiket Kereta', color: '#F59E0B', isMCI: true },
    { id: 'pln', icon: 'lightning-bolt', label: 'PLN', color: '#FACC15', isMCI: true },
    { id: 'pdam', icon: 'water-pump', label: 'PDAM', color: '#06B6D4', isMCI: true },
    { id: 'pbb', icon: 'home-city', label: 'Pajak PBB', color: '#8B5CF6', isMCI: true },
    { id: 'pajak_restoran', icon: 'food-variant', label: 'Restoran', color: '#EC4899', isMCI: true },
];

const PRAYER_TIMES = [
    { name: 'Subuh', time: '04:22' },
    { name: 'Dzuhur', time: '11:38' },
    { name: 'Ashar', time: '14:58' },
    { name: 'Maghrib', time: '17:34' },
    { name: 'Isya', time: '18:45' },
];

export default function HomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user, setUser } = useAuthStore();
    const [refreshing, setRefreshing] = useState(false);
    const [balance, setBalance] = useState(0);
    const [showBalance, setShowBalance] = useState(true);
    const [activePrayer, setActivePrayer] = useState('Ashar');
    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const interval = setInterval(() => {
            updateActivePrayer();
        }, 60000);
        updateActivePrayer();

        // Notifications Setup
        registerForPushNotificationsAsync();
        setupAllPrayerNotifications(PRAYER_TIMES);

        return () => clearInterval(interval);
    }, []);

    const updateActivePrayer = () => {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        let found = PRAYER_TIMES[0].name;
        for (let i = 0; i < PRAYER_TIMES.length; i++) {
            if (currentTime >= PRAYER_TIMES[i].time) {
                found = PRAYER_TIMES[i].name;
            }
        }
        setActivePrayer(found);
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    const userData = profile as any;
                    setUser(userData);
                    setBalance(userData.balance || 0);
                    return;
                }
            }

            const { data: targetUser } = await supabase
                .from('users')
                .select('*')
                .eq('full_name', 'Mukhsin Hadi')
                .single();

            if (targetUser) {
                const userData = targetUser as any;
                setUser(userData);
                setBalance(userData.balance || 0);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUserData();
        setRefreshing(false);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount).replace('Rp', 'Rp ').replace(',00', '');
    };

    const headerTranslate = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, -10],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* ══════ TOP HEADER (BRANDING & GREETING) ══════ */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                }
            >
                {/* ══════ TOP HEADER (BRANDING & GREETING) ══════ */}
                <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: COLORS.white }]}>
                    <View style={styles.brandingLeft}>
                        <Text style={styles.brandPekalongan}>Pekalongan</Text>
                        <Text style={styles.brandPay}>Pay</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <View style={styles.greetingContainer}>
                            <Text style={styles.greetingText}>Halo, <Text style={styles.userNameStylish}>{user?.full_name?.split(' ')[0] || 'Mukhsin'}</Text></Text>
                        </View>
                        <TouchableOpacity style={styles.notifButton}>
                            <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
                            <View style={styles.notifBadge} />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* ══════ HERO MOSAIC BALANCE CARD ══════ */}
                <View style={styles.heroContainer}>
                    <Image source={require('../../../assets/images/pekalongan_hero_v3.png')} style={styles.heroImgFull} />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.7)']}
                        style={styles.heroOverlay}
                    >
                        <View style={styles.heroContent}>
                            <View style={styles.balanceHeader}>
                                <Text style={styles.balanceLabel}>Saldo Anda</Text>
                            </View>
                            <View style={styles.balanceRow}>
                                <Text style={styles.balanceText}>
                                    {showBalance ? (typeof formatCurrency === 'function' ? formatCurrency(balance) : `Rp ${balance.toLocaleString('id-ID')}`) : 'Rp ••••••'}
                                </Text>
                                <TouchableOpacity onPress={() => setShowBalance(!showBalance)} style={styles.eyeBtn}>
                                    <Ionicons name={showBalance ? "eye-outline" : "eye-off-outline"} size={22} color="rgba(255,255,255,1)" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* ══════ PRAYER TIMES ══════ */}
                <View style={styles.prayerSection}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <View style={styles.prayerDot} />
                            <Text style={styles.sectionTitle}>Jadwal Sholat Pekalongan</Text>
                        </View>
                        <Text style={styles.currentTimeText}>Selasa, 21 Apr</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.prayerScroll}>
                        {PRAYER_TIMES.map((item, index) => (
                            <View key={index} style={[styles.prayerCard, item.name === activePrayer && styles.prayerCardActive]}>
                                <Text style={[styles.prayerName, item.name === activePrayer && styles.prayerNameActive]}>{item.name}</Text>
                                <Text style={[styles.prayerTime, item.name === activePrayer && styles.prayerTimeActive]}>{item.time}</Text>
                                {item.name === activePrayer && <View style={styles.prayerUnderline} />}
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* ══════ 3D SERVICE GRID (FRAMELESS ISOMETRIC) ══════ */}
                <View style={styles.serviceGrid}>
                    <View style={styles.serviceRow}>
                        {SERVICE_MENUS.slice(0, 5).map((menu) => (
                            <ServiceItem key={menu.id} menu={menu} router={router} />
                        ))}
                    </View>

                    <View style={styles.serviceRow}>
                        {SERVICE_MENUS.slice(5, 10).map((menu) => (
                            <ServiceItem key={menu.id} menu={menu} router={router} />
                        ))}
                    </View>
                </View>

                {/* ══════ KULINER KHAS PEKALONGAN ══════ */}
                <LocalSection
                    title="Kuliner Khas Pekalongan Terdekat"
                    icon="fast-food-outline"
                    data={KULINER_KHAS}
                    type="kuliner"
                />

                {/* ══════ TOKO BATIK PEKALONGAN ══════ */}
                <LocalSection
                    title="Toko Batik Pekalongan"
                    icon="shirt-outline"
                    data={TOKO_BATIK}
                    type="batik"
                />

                {/* ══════ MASJID DI PEKALONGAN ══════ */}
                <LocalSection
                    title="Masjid di Pekalongan"
                    icon="moon-outline"
                    data={MASJID_INFO}
                    type="masjid"
                />

                {/* ══════ WISATA PEKALONGAN ══════ */}
                <LocalSection
                    title="Wisata Pekalongan"
                    icon="camera-outline"
                    data={WISATA_PEKALONGAN}
                    type="wisata"
                />

                {/* ══════ EVENT PEKALONGAN ══════ */}
                <LocalSection
                    title="Event Pekalongan"
                    icon="calendar-outline"
                    data={EVENT_PEKALONGAN}
                    type="event"
                    marginBottom={120}
                />
            </ScrollView>
        </View>
    );
}

// ── Sub-Components ───────────────────────────────────────

function ServiceItem({ menu, router }: any) {
    return (
        <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => {
                router.push({
                    pathname: '/services/[id]' as any,
                    params: { id: menu.id }
                });
            }}
        >
            <View style={styles.icon3DFrameless}>
                <View style={[styles.iconShadow, { backgroundColor: menu.color }]} />
                <View style={[styles.iconMain, { transform: [{ perspective: 1000 }, { rotateX: '15deg' }, { rotateY: '-15deg' }] }]}>
                    {menu.isMCI ? (
                        <MaterialCommunityIcons name={menu.icon as any} size={48} color={menu.color} style={{ textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 4 }} />
                    ) : (
                        <Ionicons name={menu.icon as any} size={48} color={menu.color} style={{ textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 4 }} />
                    )}
                </View>
            </View>
            <Text style={styles.serviceLabel}>{menu.label}</Text>
        </TouchableOpacity>
    );
}

function LocalSection({ title, icon, data, type, marginBottom = 20 }: any) {
    const [search, setSearch] = useState('');
    const [isExpanded, setIsExpanded] = useState(true);

    const filteredData = data.filter((item: any) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    ).sort((a: any, b: any) => (a.dist || 0) - (b.dist || 0));

    return (
        <View style={[styles.localSection, { marginBottom }]}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                    <Ionicons name={icon as any} size={20} color={COLORS.primary} />
                    <Text style={styles.sectionTitle}>{title}</Text>
                </View>
                <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                    <Text style={styles.seeAll}>{isExpanded ? 'Sembunyikan' : 'Tampilkan'}</Text>
                </TouchableOpacity>
            </View>

            {isExpanded && (
                <>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={18} color={COLORS.textMuted} />
                        <TextInput
                            placeholder={`Cari ${type}...`}
                            style={styles.searchInput}
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.localScroll}>
                        {filteredData.map((item: any) => (
                            <TouchableOpacity key={item.id} style={styles.productCard}>
                                <View style={styles.cardBadge}>
                                    <Text style={styles.cardBadgeText}>{item.dist} km</Text>
                                </View>
                                <Image source={{ uri: item.img }} style={styles.productImg} />
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                                    <Text style={styles.productCat}>{item.cat || (item.date ? `Event: ${item.date}` : 'Pekalongan')}</Text>
                                    <View style={styles.cardFooter}>
                                        <Text style={styles.productPrice}>{item.price || ''}</Text>
                                        <TouchableOpacity style={styles.miniMapBtn}>
                                            <Ionicons name="navigate" size={14} color={COLORS.accent} />
                                            <Text style={styles.miniMapText}>Rute</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: COLORS.white,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        zIndex: 10,
    },
    brandingLeft: {
        flexDirection: 'column',
    },
    brandPekalongan: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: -0.5,
    },
    brandPay: {
        fontSize: 16,
        fontWeight: '900',
        color: COLORS.accent,
        marginTop: -6,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    greetingContainer: {
        marginRight: 15,
        alignItems: 'flex-end',
    },
    greetingText: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    userNameStylish: {
        fontWeight: '800',
        color: COLORS.text,
        fontSize: 16,
    },
    notifButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notifBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        borderWidth: 1.5,
        borderColor: COLORS.white,
    },
    heroContainer: {
        height: 300,
        width: '100%',
        backgroundColor: COLORS.text,
        overflow: 'hidden',
    },
    heroImgFull: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    mosaicGrid: {
        flex: 1,
        flexDirection: 'row',
    },
    mosaicMainContainer: {
        flex: 2,
        height: '100%',
        overflow: 'hidden',
    },
    mosaicImgMain: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    mosaicRight: {
        flex: 1,
        gap: 2,
        marginLeft: 2,
    },
    mosaicSmallContainer: {
        flex: 1,
        width: '100%',
        overflow: 'hidden',
    },
    mosaicImgSmall: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    mosaicOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: 20,
    },
    heroContent: {
        width: '100%',
    },
    balanceHeader: {
        marginBottom: 10,
    },
    speedCashBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    speedCashIconBg: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    speedCashText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: '700',
        marginLeft: 5,
    },
    balanceLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '600',
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    balanceText: {
        color: COLORS.white,
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: -1,
    },
    eyeBtn: {
        marginLeft: 15,
        padding: 5,
    },
    heroActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 12,
        borderRadius: 20,
        backdropFilter: 'blur(10px)',
    },
    heroActionBtn: {
        alignItems: 'center',
        flex: 1,
    },
    actionIconBg: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    heroActionText: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: '700',
    },
    prayerSection: {
        marginTop: 5,
        paddingHorizontal: 20,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    prayerDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.success,
    },
    currentTimeText: {
        fontSize: 12,
        color: COLORS.textMuted,
        fontWeight: '600',
    },
    prayerScroll: {
        paddingVertical: 15,
    },
    prayerCard: {
        backgroundColor: 'transparent',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        marginRight: 12,
        alignItems: 'center',
        minWidth: 90,
    },
    prayerCardActive: {
        // Remove background for frameless look
    },
    prayerUnderline: {
        marginTop: 4,
        width: 20,
        height: 3,
        borderRadius: 2,
        backgroundColor: COLORS.primary,
    },
    prayerName: {
        fontSize: 12,
        color: COLORS.textMuted,
        fontWeight: '600',
        marginBottom: 4,
    },
    prayerNameActive: {
        color: 'rgba(255,255,255,0.8)',
    },
    prayerTime: {
        fontSize: 18,
        fontWeight: '900',
        color: COLORS.primary,
    },
    prayerTimeActive: {
        color: COLORS.primary,
        fontSize: 20,
    },
    serviceGrid: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    serviceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    serviceItem: {
        width: (width - 40) / 5,
        alignItems: 'center',
    },
    qrisFloatingContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    qrisButton: {
        alignItems: 'center',
        marginTop: -30,
        marginBottom: 10,
    },
    qrisGradient: {
        width: 76,
        height: 76,
        borderRadius: 38,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 15,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        borderWidth: 4,
        borderColor: COLORS.white,
    },
    qrisLabel: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '900',
        color: COLORS.primary,
    },
    icon3DFrameless: {
        width: 72,
        height: 72,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconShadow: {
        position: 'absolute',
        width: 48,
        height: 24,
        borderRadius: 20,
        bottom: 8,
        opacity: 0.15,
        transform: [{ scaleX: 1.2 }, { rotateX: '60deg' }],
    },
    iconMain: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    serviceLabel: {
        marginTop: 10,
        fontSize: 11,
        fontWeight: '800',
        color: COLORS.text,
        textAlign: 'center',
    },
    localSection: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: COLORS.text,
    },
    seeAll: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.accent,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 16,
        paddingHorizontal: 15,
        height: 48,
        marginBottom: 15,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '500',
    },
    localScroll: {
        paddingBottom: 10,
    },
    productCard: {
        width: 220,
        backgroundColor: COLORS.white,
        borderRadius: 24,
        marginRight: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    cardBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        zIndex: 10,
    },
    cardBadgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: '800',
    },
    productImg: {
        width: '100%',
        height: 130,
        resizeMode: 'cover',
    },
    productInfo: {
        padding: 16,
    },
    productName: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 2,
    },
    productCat: {
        fontSize: 12,
        color: COLORS.textMuted,
        fontWeight: '600',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    productPrice: {
        fontSize: 15,
        fontWeight: '900',
        color: COLORS.primary,
    },
    miniMapBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(37, 99, 235, 0.08)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    miniMapText: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.accent,
        marginLeft: 4,
    }
});
