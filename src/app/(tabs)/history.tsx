import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TxnFilter = 'semua' | 'masuk' | 'keluar';

const COLORS = {
    primary: '#DC2626',
    secondary: '#FACC15',
    accent: '#2563EB',
    background: '#F8FAFC',
    white: '#FFFFFF',
    text: '#1E293B',
    textMuted: '#64748B',
    success: '#10B981',
    error: '#EF4444',
};

const TRANSACTIONS = [
    { id: '1', name: 'Top Up Saldo', amount: 500000, type: 'topup', date: '21 Apr 2026', time: '09:15', status: 'success' },
    { id: '2', name: 'Transfer ke BCA - Siti', amount: -250000, type: 'transfer_bank', date: '21 Apr 2026', time: '10:30', status: 'success' },
    { id: '3', name: 'QRIS - Batik Sejahtera', amount: -175000, type: 'qris_pay', date: '20 Apr 2026', time: '14:22', status: 'success' },
    { id: '4', name: 'Transfer dari Ahmad', amount: 300000, type: 'transfer_user', date: '20 Apr 2026', time: '11:08', status: 'success' },
    { id: '5', name: 'Soto Tauto Pak Marto', amount: -35000, type: 'merchant_pay', date: '19 Apr 2026', time: '12:45', status: 'success' },
    { id: '6', name: 'Top Up OVO', amount: -100000, type: 'ewallet_topup', date: '19 Apr 2026', time: '09:30', status: 'success' },
    { id: '7', name: 'Transfer BRI Gagal', amount: -500000, type: 'transfer_bank', date: '18 Apr 2026', time: '15:20', status: 'failed' },
    { id: '8', name: 'Top Up Saldo', amount: 1000000, type: 'topup', date: '18 Apr 2026', time: '08:00', status: 'success' },
];

const TYPE_ICONS: Record<string, { icon: string; color: string }> = {
    topup: { icon: 'arrow-down-circle', color: COLORS.success },
    transfer_bank: { icon: 'send', color: COLORS.accent },
    transfer_user: { icon: 'people', color: '#8B5CF6' },
    qris_pay: { icon: 'qr-code', color: COLORS.secondary },
    merchant_pay: { icon: 'storefront', color: COLORS.primary },
    ewallet_topup: { icon: 'card', color: '#EC4899' },
};

export default function HistoryScreen() {
    const insets = useSafeAreaInsets();
    const [filter, setFilter] = useState<TxnFilter>('semua');

    const filteredTxn = TRANSACTIONS.filter((t) => {
        if (filter === 'masuk') return t.amount > 0;
        if (filter === 'keluar') return t.amount < 0;
        return true;
    });

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
        }).format(Math.abs(amount)).replace('Rp', 'Rp ');

    const totalIn = TRANSACTIONS.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const totalOut = TRANSACTIONS.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <Text style={styles.headerTitle}>Riwayat Transaksi</Text>

                {/* Summary Cards */}
                <View style={styles.summaryContainer}>
                    <View style={[styles.summaryCard, { borderColor: COLORS.success + '30' }]}>
                        <View style={[styles.summaryIcon, { backgroundColor: COLORS.success + '15' }]}>
                            <Ionicons name="trending-up" size={16} color={COLORS.success} />
                        </View>
                        <View>
                            <Text style={styles.summaryLabel}>Total Masuk</Text>
                            <Text style={[styles.summaryValue, { color: COLORS.success }]}>
                                {formatCurrency(totalIn)}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.summaryCard, { borderColor: COLORS.error + '30' }]}>
                        <View style={[styles.summaryIcon, { backgroundColor: COLORS.error + '15' }]}>
                            <Ionicons name="trending-down" size={16} color={COLORS.error} />
                        </View>
                        <View>
                            <Text style={styles.summaryLabel}>Total Keluar</Text>
                            <Text style={[styles.summaryValue, { color: COLORS.error }]}>
                                {formatCurrency(totalOut)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Filters */}
                <View style={styles.filterContainer}>
                    {(['semua', 'masuk', 'keluar'] as TxnFilter[]).map((f) => (
                        <TouchableOpacity
                            key={f}
                            onPress={() => setFilter(f)}
                            style={[
                                styles.filterItem,
                                filter === f && styles.filterItemActive
                            ]}
                        >
                            <Text style={[
                                styles.filterText,
                                filter === f && styles.filterTextActive
                            ]}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <FlatList
                data={filteredTxn}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    const typeInfo = TYPE_ICONS[item.type] || { icon: 'help-circle', color: COLORS.textMuted };
                    const isPositive = item.amount > 0;
                    return (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.transactionItem}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: typeInfo.color + '15' }]}>
                                <Ionicons name={typeInfo.icon as any} size={22} color={typeInfo.color} />
                            </View>

                            <View style={styles.transactionInfo}>
                                <Text style={styles.transactionName}>{item.name}</Text>
                                <Text style={styles.transactionDate}>
                                    {item.date} • {item.time}
                                </Text>
                            </View>

                            <View style={styles.amountContainer}>
                                <Text style={[
                                    styles.transactionAmount,
                                    { color: item.status === 'failed' ? COLORS.textMuted : isPositive ? COLORS.success : COLORS.text },
                                    item.status === 'failed' && { textDecorationLine: 'line-through' }
                                ]}>
                                    {isPositive ? '+' : '-'} {formatCurrency(item.amount)}
                                </Text>
                                {item.status === 'failed' && (
                                    <Text style={styles.failedBadge}>Gagal</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
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
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 20,
    },
    summaryContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
    },
    summaryIcon: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 10,
        color: COLORS.textMuted,
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '700',
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    filterItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    filterItemActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    filterTextActive: {
        color: COLORS.white,
    },
    listContent: {
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 14,
        borderRadius: 20,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    transactionInfo: {
        flex: 1,
        marginLeft: 14,
    },
    transactionName: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.text,
    },
    transactionDate: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    transactionAmount: {
        fontSize: 15,
        fontWeight: '700',
    },
    failedBadge: {
        fontSize: 10,
        color: COLORS.error,
        fontWeight: '700',
        marginTop: 2,
        textTransform: 'uppercase',
    },
});

