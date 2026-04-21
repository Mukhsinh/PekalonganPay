import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ITEMS: { name: string; title: string; icon: IconName; iconFocused: IconName }[] = [
    { name: 'home', title: 'Beranda', icon: 'grid-outline', iconFocused: 'grid' },
    { name: 'history', title: 'Riwayat', icon: 'receipt-outline', iconFocused: 'receipt' },
    { name: 'qris', title: 'QRIS', icon: 'qr-code-outline', iconFocused: 'qr-code' },
    { name: 'umkm', title: 'UMKM', icon: 'storefront-outline', iconFocused: 'storefront' },
    { name: 'profile', title: 'Profil', icon: 'person-circle-outline', iconFocused: 'person-circle' },
];

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 0,
                    height: Platform.OS === 'ios' ? 95 : 75,
                    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
                    paddingTop: 10,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -10 },
                    shadowOpacity: 0.1,
                    shadowRadius: 20,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                },
                tabBarActiveTintColor: '#DC2626',
                tabBarInactiveTintColor: '#94A3B8',
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '700',
                    marginTop: 2,
                },
            }}
        >
            {TAB_ITEMS.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        title: tab.title,
                        tabBarIcon: ({ focused, color }) => {
                            if (tab.name === 'qris') {
                                return (
                                    <View style={styles.qrisContainer}>
                                        <LinearGradient
                                            colors={['#DC2626', '#2563EB']}
                                            style={styles.qrisGradient}
                                        >
                                            <Ionicons
                                                name="qr-code"
                                                size={28}
                                                color="#FFFFFF"
                                            />
                                        </LinearGradient>
                                        <View style={styles.qrisShadow} />
                                    </View>
                                );
                            }
                            return (
                                <View style={styles.iconContainer}>
                                    <View style={[
                                        styles.iconBackground,
                                        focused && styles.iconBackgroundActive
                                    ]}>
                                        <Ionicons
                                            name={focused ? tab.iconFocused : tab.icon}
                                            size={focused ? 24 : 22}
                                            color={focused ? '#DC2626' : '#94A3B8'}
                                        />
                                    </View>
                                </View>
                            );
                        },
                    }}
                />
            ))}
        </Tabs>
    );
}

const styles = StyleSheet.create({
    qrisContainer: {
        width: 65,
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 35,
    },
    qrisGradient: {
        width: 62,
        height: 62,
        borderRadius: 31,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        elevation: 12,
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    qrisShadow: {
        position: 'absolute',
        bottom: -5,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(220, 38, 38, 0.4)',
        zIndex: 1,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
    },
    iconBackground: {
        width: 40,
        height: 40,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconBackgroundActive: {
        backgroundColor: '#FEF2F2',
    },
});
