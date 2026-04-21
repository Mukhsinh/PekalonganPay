import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function KYCVerifyScreen() {
    const router = useRouter();
    const [nik, setNik] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const handleVerify = async () => {
        if (nik.length !== 16) {
            Alert.alert('Error', 'NIK harus 16 digit');
            return;
        }

        setIsVerifying(true);
        // Simulate Dukcapil API call
        setTimeout(() => {
            setIsVerifying(false);
            setIsVerified(true);
            setTimeout(() => {
                router.replace('/(tabs)/home');
            }, 2000);
        }, 2000);
    };

    return (
        <LinearGradient colors={['#0A1628', '#0D2847']} style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    paddingHorizontal: 28,
                }}
            >
                {/* Back */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ position: 'absolute', top: 60, left: 0 }}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>

                {/* Step Indicator */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
                    {[1, 2, 3].map((s) => (
                        <View
                            key={s}
                            style={{
                                width: 32,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: '#00D9C0',
                            }}
                        />
                    ))}
                </View>

                {/* Icon */}
                <View style={{ alignSelf: 'center', marginBottom: 24 }}>
                    <View
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            backgroundColor: isVerified ? 'rgba(46, 213, 115, 0.12)' : 'rgba(212, 168, 67, 0.12)',
                            borderWidth: 1.5,
                            borderColor: isVerified ? '#2ED573' : '#D4A843',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Ionicons
                            name={isVerified ? 'checkmark-circle' : 'card-outline'}
                            size={36}
                            color={isVerified ? '#2ED573' : '#D4A843'}
                        />
                    </View>
                </View>

                {/* Title */}
                <Text style={{ fontSize: 24, fontWeight: '800', color: '#FFF', textAlign: 'center' }}>
                    {isVerified ? 'KYC Terverifikasi! ✅' : 'Verifikasi KYC'}
                </Text>
                <Text style={{ fontSize: 14, color: '#94A3B8', textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
                    {isVerified
                        ? 'Akun Anda sekarang terverifikasi penuh.\nAnda dapat menggunakan semua fitur PekalonganPay.'
                        : 'Masukkan NIK untuk verifikasi identitas.\nData Anda divalidasi melalui API Dukcapil.'}
                </Text>

                {!isVerified && (
                    <>
                        {/* NIK Input */}
                        <View style={{ marginTop: 32, marginBottom: 24 }}>
                            <Text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 8, fontWeight: '600' }}>
                                Nomor Induk Kependudukan (NIK)
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(255,255,255,0.06)',
                                    borderRadius: 14,
                                    borderWidth: 1,
                                    borderColor: 'rgba(212, 168, 67, 0.3)',
                                    paddingHorizontal: 16,
                                }}
                            >
                                <Ionicons name="card-outline" size={20} color="#D4A843" style={{ marginRight: 12 }} />
                                <TextInput
                                    style={{ flex: 1, height: 52, color: '#FFF', fontSize: 16, letterSpacing: 2 }}
                                    placeholder="3375 •••• •••• ••••"
                                    placeholderTextColor="#4A5568"
                                    keyboardType="number-pad"
                                    value={nik}
                                    onChangeText={setNik}
                                    maxLength={16}
                                />
                                {nik.length === 16 && (
                                    <Ionicons name="checkmark-circle" size={20} color="#2ED573" />
                                )}
                            </View>
                            <Text style={{ fontSize: 11, color: '#4A5568', marginTop: 6 }}>
                                💡 NIK digunakan untuk verifikasi identitas Anda dan tidak akan dibagikan
                            </Text>
                        </View>

                        {/* Info Box */}
                        <View
                            style={{
                                backgroundColor: 'rgba(212, 168, 67, 0.08)',
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: 'rgba(212, 168, 67, 0.15)',
                                padding: 16,
                                marginBottom: 24,
                            }}
                        >
                            <Text style={{ fontSize: 12, color: '#D4A843', fontWeight: '600', marginBottom: 8 }}>
                                🔒 Keamanan Data Anda
                            </Text>
                            <Text style={{ fontSize: 11, color: '#94A3B8', lineHeight: 18 }}>
                                • Data NIK dienkripsi AES-256 sebelum dikirim{'\n'}
                                • Validasi real-time dengan API Dukcapil{'\n'}
                                • Sesuai standar PCI-DSS & regulasi BI{'\n'}
                                • Data tersimpan aman di server terenkripsi
                            </Text>
                        </View>

                        {/* Verify Button */}
                        <TouchableOpacity
                            onPress={handleVerify}
                            disabled={isVerifying || nik.length !== 16}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={nik.length === 16 ? ['#D4A843', '#B48E38'] : ['#333', '#333']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    height: 54,
                                    borderRadius: 14,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    opacity: nik.length === 16 ? 1 : 0.4,
                                }}
                            >
                                <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700', letterSpacing: 1 }}>
                                    {isVerifying ? '🔍 MEMVERIFIKASI...' : 'VERIFIKASI KYC'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Skip */}
                        <TouchableOpacity
                            onPress={() => router.replace('/(tabs)/home')}
                            style={{ marginTop: 16, alignSelf: 'center' }}
                        >
                            <Text style={{ color: '#64748B', fontSize: 13 }}>
                                Lewati untuk saat ini →
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </LinearGradient>
    );
}
