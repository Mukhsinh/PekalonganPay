import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'web') return null;
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('prayer-times', {
            name: 'Jadwal Sholat',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#DC2626',
        });
    }

    if (Device.isDevice) {
        const result = await Notifications.getPermissionsAsync();
        let finalStatus = (result as any).status;
        if (finalStatus !== 'granted') {
            const requestResult = await Notifications.requestPermissionsAsync();
            finalStatus = (requestResult as any).status;
        }
        if (finalStatus !== 'granted') {
            return null;
        }
    }

    return token;
}

export async function schedulePrayerNotification(name: string, time: string) {
    const [hours, minutes] = time.split(':').map(Number);

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Waktunya Sholat!",
            body: `Sekarang masuk waktu ${name} untuk wilayah Pekalongan dan sekitarnya.`,
            data: { screen: 'home' },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            hour: hours,
            minute: minutes,
            repeats: true,
        },
    });
}

export async function setupAllPrayerNotifications(prayerTimes: { name: string, time: string }[]) {
    if (Platform.OS === 'web') return;
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        for (const prayer of prayerTimes) {
            await schedulePrayerNotification(prayer.name, prayer.time);
        }
    } catch (error) {
        console.error('Error setting up notifications:', error);
    }
}
