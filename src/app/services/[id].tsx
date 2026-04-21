import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const SERVICE_CONFIG: Record<string, { label: string; icon: string; color: string; placeholder: string }> = {
    top_up: { label: 'Top Up', icon: 'add-circle', color: '#EF4444', placeholder: 'Pilih Metode Pembayaran' },
    transfer: { label: 'Transfer', icon: 'swap-horizontal', color: '#2563EB', placeholder: 'Masukkan Nomor Rekening' },
    history: { label: 'Riwayat Transaksi', icon: 'time', color: '#10B981', placeholder: 'Cari Transaksi' },
    pulsa_data: { label: 'Pulsa & Data', icon: 'phone-portrait', color: '#f6d365', placeholder: 'Masukkan Nomor HP' },
    pln: { label: 'PLN', icon: 'flash', color: '#f6d365', placeholder: 'Masukkan ID Pelanggan' },
    pdam: { label: 'PDAM', icon: 'water', color: '#00c6fb', placeholder: 'Masukkan ID Pelanggan' },
    telkom: { label: 'Telkom & Indihome', icon: 'home', color: '#fa709a', placeholder: 'Masukkan ID Pelanggan' },
    bpjs: { label: 'BPJS', icon: 'heart', color: '#5ee7df', placeholder: 'Masukkan Nomor VA' },
    tv_kabel: { label: 'Tv Kabel', icon: 'tv', color: '#667eea', placeholder: 'Masukkan ID Pelanggan' },
    cicilan: { label: 'Cicilan', icon: 'calendar', color: '#feb47b', placeholder: 'Masukkan Nomor Kontrak' },
    asuransi: { label: 'Asuransi', icon: 'shield-checkmark', color: '#2af598', placeholder: 'Masukkan Nomor Polis' },
    pasca_bayar: { label: 'Pasca Bayar', icon: 'receipt', color: '#84fab0', placeholder: 'Masukkan Nomor HP / ID' },
    kartu_kredit: { label: 'Kartu Kredit', icon: 'card', color: '#4facfe', placeholder: 'Masukkan Nomor Kartu' },
    tiket_pesawat: { label: 'Tiket Pesawat', icon: 'airplane', color: '#00c6fb', placeholder: 'Cari Destinasi' },
    tiket_kereta: { label: 'Tiket Kereta', icon: 'train', color: '#667eea', placeholder: 'Cari Stasiun' },
    pbb: { label: 'Pajak PBB', icon: 'home', color: '#8B5CF6', placeholder: 'Masukkan NOP (Nomor Objek Pajak)' },
    pajak_restoran: { label: 'Pajak Restoran', icon: 'restaurant', color: '#EC4899', placeholder: 'Masukkan ID Billing' },
    hotel: { label: 'Pesan Hotel', icon: 'bed', color: '#fa709a', placeholder: 'Cari Lokasi / Hotel' },
    more: { label: 'Layanan Lain', icon: 'grid', color: '#94A3B8', placeholder: 'Cari Layanan' },
};

const PRODUCTS = [
    { id: '1', name: 'Paket 10.000', price: 10500 },
    { id: '2', name: 'Paket 25.000', price: 25500 },
    { id: '3', name: 'Paket 50.000', price: 50200 },
    { id: '4', name: 'Paket 100.000', price: 99500 },
];

export default function ServiceDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const config = SERVICE_CONFIG[id as string] || SERVICE_CONFIG.more;
    const [targetId, setTargetId] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleTransaction = () => {
        if (!targetId || !selectedProduct) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert('Transaksi Berhasil!\nTerima kasih telah menggunakan PekalonganPay.');
            router.back();
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{config.label}</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>{config.placeholder}</Text>
                        <TextInput
                            style={styles.input}
                            value={targetId}
                            onChangeText={setTargetId}
                            placeholder="e.g. 081234567890"
                            keyboardType="numeric"
                        />
                    </View>

                    <Text style={styles.sectionTitle}>Pilih Produk / Nominal</Text>
                    <View style={styles.productGrid}>
                        {PRODUCTS.map((product) => (
                            <TouchableOpacity
                                key={product.id}
                                style={[
                                    styles.productCard,
                                    selectedProduct === product.id && styles.productCardSelected
                                ]}
                                onPress={() => setSelectedProduct(product.id)}
                            >
                                <Text style={[
                                    styles.productName,
                                    selectedProduct === product.id && styles.productTextSelected
                                ]}>{product.name}</Text>
                                <Text style={[
                                    styles.productPrice,
                                    selectedProduct === product.id && styles.productTextSelected
                                ]}>Rp {product.price.toLocaleString('id-ID')}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.mainButton,
                            (!targetId || !selectedProduct || loading) && styles.mainButtonDisabled
                        ]}
                        onPress={handleTransaction}
                        disabled={!targetId || !selectedProduct || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.mainButtonText}>Beli Sekarang</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },
    content: {
        padding: 16,
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1E293B',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 16,
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    productCard: {
        width: '48%',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    productCardSelected: {
        backgroundColor: '#DC2626',
        borderColor: '#DC2626',
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 12,
        color: '#DC2626',
        fontWeight: '700',
    },
    productTextSelected: {
        color: '#FFFFFF',
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    mainButton: {
        backgroundColor: '#DC2626',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    mainButtonDisabled: {
        backgroundColor: '#CBD5E1',
    },
    mainButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
