import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
    background: '#F8FAFC',
    card: '#FFFFFF',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    accentRed: '#DC2626',
    accentYellow: '#FACC15',
    accentBlue: '#2563EB',
    accentGreen: '#10B981',
    border: '#E2E8F0',
};

const MENU_SECTIONS = [
    {
        title: 'Akun & Keamanan',
        items: [
            { icon: 'shield-checkmark-outline', label: 'Keamanan Akun', subtitle: 'PIN, Biometrik, Perangkat', color: COLORS.accentBlue },
            { icon: 'card-outline', label: 'Metode Pembayaran', subtitle: 'Bank & e-wallet', color: COLORS.accentRed },
            { icon: 'document-text-outline', label: 'Verifikasi Identitas', subtitle: 'Status: Terverifikasi ✓', color: COLORS.accentGreen },
        ],
    },
    {
        title: 'Layanan Pekalongan',
        items: [
            { icon: 'moon-outline', label: 'Jadwal Sholat', subtitle: 'Pengingat ibadah', color: COLORS.accentBlue },
            { icon: 'calendar-outline', label: 'Event Budaya', subtitle: 'Agenda kota Pekalongan', color: COLORS.accentYellow },
            { icon: 'storefront-outline', label: 'UMKM Saya', subtitle: 'Kelola bisnis Anda', color: COLORS.accentRed },
        ],
    },
    {
        title: 'Pusat Bantuan',
        items: [
            { icon: 'help-circle-outline', label: 'Bantuan & FAQ', subtitle: 'Pusat informasi', color: COLORS.textSecondary },
            { icon: 'chatbubbles-outline', label: 'Hubungi Kami', subtitle: 'Layanan CS 24/7', color: COLORS.accentBlue },
            { icon: 'information-circle-outline', label: 'Tentang Aplikasi', subtitle: 'Versi 1.1.0 (PRO)', color: COLORS.textSecondary },
        ],
    },
];

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar dari akun?', [
            { text: 'Batal', style: 'cancel' },
            {
                text: 'Keluar',
                style: 'destructive',
                onPress: () => {
                    logout();
                    router.replace('/(auth)/login');
                }
            },
        ]);
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            {/* Header / AppBar style */}
            <View style={{
                paddingTop: insets.top + 10,
                paddingBottom: 20,
                paddingHorizontal: 20,
                backgroundColor: COLORS.card,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: COLORS.border,
            }}>
                <Text style={{ fontSize: 24, fontWeight: '900', color: COLORS.textPrimary }}>Profil</Text>
                <TouchableOpacity onPress={() => router.push('/settings' as any)}>
                    <Ionicons name="settings-outline" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Profile Card */}
                <View style={{ padding: 20 }}>
                    <View style={{
                        backgroundColor: COLORS.card,
                        borderRadius: 24,
                        padding: 24,
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.05,
                        shadowRadius: 10,
                        elevation: 3,
                    }}>
                        {/* Avatar */}
                        <View style={{ position: 'relative' }}>
                            <View style={{
                                width: 90,
                                height: 90,
                                borderRadius: 32,
                                backgroundColor: '#F1F5F9',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 4,
                                borderColor: COLORS.card,
                                overflow: 'hidden'
                            }}>
                                {user?.avatar_url ? (
                                    <Image
                                        source={{ uri: user.avatar_url }}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                ) : (
                                    <Text style={{ fontSize: 32, fontWeight: '800', color: COLORS.accentRed }}>
                                        {user?.full_name?.substring(0, 2).toUpperCase() || 'AR'}
                                    </Text>
                                )}
                            </View>
                            <TouchableOpacity style={{
                                position: 'absolute',
                                bottom: -4,
                                right: -4,
                                backgroundColor: COLORS.accentBlue,
                                width: 32,
                                height: 32,
                                borderRadius: 12,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 3,
                                borderColor: COLORS.card,
                            }}>
                                <Ionicons name="camera" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, marginTop: 16 }}>
                            {user?.full_name || 'Mukhsin Hadi'}
                        </Text>
                        <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4 }}>
                            {user?.phone || '+62 812 3456 7890'}
                        </Text>

                        {/* KYC Badge */}
                        <View style={{
                            marginTop: 12,
                            backgroundColor: '#ECFDF5',
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 100,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Ionicons name="shield-checkmark" size={14} color={COLORS.accentGreen} />
                            <Text style={{ fontSize: 12, color: COLORS.accentGreen, fontWeight: '700', marginLeft: 4 }}>
                                {user?.kyc_status === 'verified' ? 'Akun Terverifikasi' : 'Belum Verifikasi'}
                            </Text>
                        </View>
                    </View>

                    {/* Referral Promo */}
                    <TouchableOpacity style={{ marginTop: 20 }}>
                        <View style={{
                            backgroundColor: COLORS.accentBlue,
                            borderRadius: 20,
                            padding: 20,
                            flexDirection: 'row',
                            alignItems: 'center',
                            overflow: 'hidden'
                        }}>
                            {/* Decorative elements */}
                            <View style={{
                                position: 'absolute',
                                top: -20,
                                right: -20,
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                backgroundColor: 'rgba(255,255,255,0.1)',
                            }} />

                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>Ajak Teman & Menang!</Text>
                                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Undang teman dan dapatkan saldo hingga Rp50.000</Text>
                            </View>
                            <View style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                width: 44,
                                height: 44,
                                borderRadius: 15,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Ionicons name="gift" size={24} color="#FFF" />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Menu Sections */}
                {MENU_SECTIONS.map((section, sIdx) => (
                    <View key={section.title} style={{ marginTop: sIdx === 0 ? 0 : 20, paddingHorizontal: 20 }}>
                        <Text style={{ fontSize: 14, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 12, marginLeft: 4 }}>
                            {section.title}
                        </Text>
                        <View style={{
                            backgroundColor: COLORS.card,
                            borderRadius: 24,
                            overflow: 'hidden',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.03,
                            shadowRadius: 8,
                            elevation: 2,
                        }}>
                            {section.items.map((item, idx) => (
                                <TouchableOpacity
                                    key={item.label}
                                    activeOpacity={0.7}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingHorizontal: 20,
                                        paddingVertical: 16,
                                        borderBottomWidth: idx < section.items.length - 1 ? 1 : 0,
                                        borderBottomColor: '#F1F5F9',
                                    }}
                                >
                                    <View style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 14,
                                        backgroundColor: `${item.color}10`,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Ionicons name={item.icon as any} size={22} color={item.color} />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 16 }}>
                                        <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.textPrimary }}>{item.label}</Text>
                                        <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>{item.subtitle}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Logout Button */}
                <TouchableOpacity
                    onPress={handleLogout}
                    style={{
                        marginHorizontal: 20,
                        marginTop: 32,
                        backgroundColor: '#FEF2F2',
                        borderRadius: 20,
                        paddingVertical: 18,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: '#FEE2E2',
                    }}
                >
                    <Ionicons name="log-out-outline" size={20} color={COLORS.accentRed} style={{ marginRight: 8 }} />
                    <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.accentRed }}>
                        Keluar dari Akun
                    </Text>
                </TouchableOpacity>

                {/* Footer */}
                <View style={{ alignItems: 'center', marginTop: 32, paddingBottom: 20 }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#CBD5E1' }}>PekalonganPay v1.1.0 PRO</Text>
                    <Text style={{ fontSize: 11, color: '#CBD5E1', marginTop: 4 }}>
                        Terdaftar & Diawasi oleh Bank Indonesia
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
