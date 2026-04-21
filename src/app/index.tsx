import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;
  const batikOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Batik pattern fade in
    Animated.timing(batikOpacity, {
      toValue: 0.15,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Staggered animation sequence
    Animated.sequence([
      // Logo scale & fade
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Title fade
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Subtitle fade
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Shimmer effect loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Navigate after splash
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const shimmerTranslate = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#0A1628', '#0D2847', '#0D7377']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        {/* Batik decorative circles */}
        <Animated.View
          style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 250,
            height: 250,
            borderRadius: 125,
            borderWidth: 1,
            borderColor: '#D4A843',
            opacity: batikOpacity,
          }}
        />
        <Animated.View
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: 150,
            borderWidth: 1,
            borderColor: '#00D9C0',
            opacity: batikOpacity,
          }}
        />
        <Animated.View
          style={{
            position: 'absolute',
            top: height * 0.3,
            left: -40,
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 0.5,
            borderColor: '#D4A843',
            opacity: batikOpacity,
          }}
        />

        {/* Logo */}
        <Animated.View
          style={{
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
            marginBottom: 24,
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 28,
              backgroundColor: 'rgba(0, 217, 192, 0.15)',
              borderWidth: 2,
              borderColor: '#00D9C0',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#00D9C0',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <Text style={{ fontSize: 48, fontWeight: '800', color: '#00D9C0' }}>₽</Text>
          </View>
        </Animated.View>

        {/* App Name */}
        <Animated.View style={{ opacity: titleOpacity, alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 36,
              fontWeight: '800',
              color: '#FFFFFF',
              letterSpacing: 2,
            }}
          >
            Pekalongan
            <Text style={{ color: '#00D9C0' }}>Pay</Text>
          </Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={{ opacity: subtitleOpacity, marginTop: 8 }}>
          <Text
            style={{
              fontSize: 14,
              color: '#D4A843',
              letterSpacing: 4,
              textTransform: 'uppercase',
              fontWeight: '500',
            }}
          >
            Batik City • Smart Payment
          </Text>
        </Animated.View>

        {/* Shimmer line */}
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 120,
            width: width * 0.6,
            height: 2,
            overflow: 'hidden',
            borderRadius: 1,
          }}
        >
          <LinearGradient
            colors={['transparent', '#00D9C0', 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ width: '100%', height: '100%' }}
          />
        </Animated.View>

        {/* Licensed badge */}
        <View
          style={{
            position: 'absolute',
            bottom: 60,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 10, color: '#64748B', letterSpacing: 1 }}>
            DIAWASI OLEH
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#94A3B8',
              fontWeight: '600',
              marginTop: 4,
            }}
          >
            Bank Indonesia 🇮🇩
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}
