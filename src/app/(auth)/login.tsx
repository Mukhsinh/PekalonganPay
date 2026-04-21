import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Alert,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState('');
    const [showPin, setShowPin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const buttonScale = useRef(new Animated.Value(1)).current;

    const handleLogin = async () => {
        if (!phone || phone.length < 10) {
            Alert.alert('Error', 'Masukkan nomor HP yang valid');
            return;
        }
        if (!pin || pin.length !== 6) {
            Alert.alert('Error', 'PIN harus 6 digit');
            return;
        }

        setIsLoading(true);
        // Simulate login
        setTimeout(() => {
            setIsLoading(false);
            router.replace('/(tabs)/home');
        }, 1500);
    };

    const onPressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <LinearGradient
                colors={['#0A1628', '#0D2847']}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        paddingHorizontal: 28,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={{ alignItems: 'center', marginBottom: 48 }}>
                        <View
                            style={{
                                width: 72,
                                height: 72,
                                borderRadius: 20,
                                backgroundColor: 'rgba(0, 217, 192, 0.12)',
                                borderWidth: 1.5,
                                borderColor: '#00D9C0',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 20,
                            }}
                        >
                            <Text style={{ fontSize: 36, fontWeight: '800', color: '#00D9C0' }}>₽</Text>
                        </View>
                        <Text style={{ fontSize: 28, fontWeight: '800', color: '#FFFFFF' }}>
                            Selamat Datang
                        </Text>
                        <Text style={{ fontSize: 14, color: '#94A3B8', marginTop: 8 }}>
                            Masuk ke akun PekalonganPay Anda
                        </Text>
                    </View>

                    {/* Phone Input */}
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 8, fontWeight: '600' }}>
                            Nomor HP
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255,255,255,0.06)',
                                borderRadius: 14,
                                borderWidth: 1,
                                borderColor: 'rgba(0, 217, 192, 0.2)',
                                paddingHorizontal: 16,
                            }}
                        >
                            <Text style={{ color: '#00D9C0', fontSize: 16, fontWeight: '700', marginRight: 8 }}>
                                +62
                            </Text>
                            <View style={{ width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.1)', marginRight: 12 }} />
                            <TextInput
                                style={{
                                    flex: 1,
                                    height: 52,
                                    color: '#FFFFFF',
                                    fontSize: 16,
                                }}
                                placeholder="812 3456 7890"
                                placeholderTextColor="#4A5568"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                                maxLength={13}
                            />
                            <Ionicons name="phone-portrait-outline" size={20} color="#64748B" />
                        </View>
                    </View>

                    {/* PIN Input */}
                    <View style={{ marginBottom: 24 }}>
                        <Text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 8, fontWeight: '600' }}>
                            PIN (6 digit)
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255,255,255,0.06)',
                                borderRadius: 14,
                                borderWidth: 1,
                                borderColor: 'rgba(0, 217, 192, 0.2)',
                                paddingHorizontal: 16,
                            }}
                        >
                            <Ionicons name="lock-closed-outline" size={20} color="#64748B" style={{ marginRight: 12 }} />
                            <TextInput
                                style={{
                                    flex: 1,
                                    height: 52,
                                    color: '#FFFFFF',
                                    fontSize: 20,
                                    letterSpacing: 8,
                                }}
                                placeholder="• • • • • •"
                                placeholderTextColor="#4A5568"
                                keyboardType="number-pad"
                                secureTextEntry={!showPin}
                                value={pin}
                                onChangeText={setPin}
                                maxLength={6}
                            />
                            <TouchableOpacity onPress={() => setShowPin(!showPin)}>
                                <Ionicons
                                    name={showPin ? 'eye-off-outline' : 'eye-outline'}
                                    size={22}
                                    color="#64748B"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Biometric Login Option */}
                    <TouchableOpacity
                        style={{
                            alignSelf: 'center',
                            marginBottom: 24,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="finger-print-outline" size={18} color="#00D9C0" />
                            <Text style={{ color: '#00D9C0', fontSize: 13, marginLeft: 6, fontWeight: '500' }}>
                                Login dengan Biometrik
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <TouchableOpacity
                            onPress={handleLogin}
                            onPressIn={onPressIn}
                            onPressOut={onPressOut}
                            disabled={isLoading}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={['#00D9C0', '#0D7377']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    height: 54,
                                    borderRadius: 14,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    shadowColor: '#00D9C0',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 12,
                                    elevation: 8,
                                }}
                            >
                                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 1 }}>
                                    {isLoading ? 'MEMPROSES...' : 'MASUK'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Register Link */}
                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/register')}
                        style={{ marginTop: 24, alignItems: 'center' }}
                    >
                        <Text style={{ color: '#94A3B8', fontSize: 14 }}>
                            Belum punya akun?{' '}
                            <Text style={{ color: '#D4A843', fontWeight: '700' }}>Daftar Sekarang</Text>
                        </Text>
                    </TouchableOpacity>

                    {/* Footer */}
                    <View style={{ alignItems: 'center', marginTop: 48 }}>
                        <Text style={{ fontSize: 10, color: '#4A5568', letterSpacing: 1 }}>
                            Dilindungi enkripsi AES-256
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            <Ionicons name="shield-checkmark-outline" size={12} color="#2ED573" />
                            <Text style={{ fontSize: 10, color: '#4A5568', marginLeft: 4 }}>
                                PCI-DSS Compliant • Diawasi Bank Indonesia
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}
