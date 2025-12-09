// shared/components/Confetti.tsx - Celebration confetti animation
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { Colors } from '../theme';

const { width, height } = Dimensions.get('window');

const CONFETTI_COLORS = [
  Colors.light.primary,
  Colors.light.secondary,
  Colors.light.accent,
  Colors.light.gold,
  '#FF69B4', // Pink
  '#00CED1', // Dark Cyan
  '#FFD700', // Gold
  '#9370DB', // Medium Purple
];

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  rotation: Animated.Value;
  translateY: Animated.Value;
  translateX: Animated.Value;
  opacity: Animated.Value;
}

interface ConfettiProps {
  active: boolean;
  duration?: number;
  pieces?: number;
  onComplete?: () => void;
}

export const Confetti: React.FC<ConfettiProps> = ({
  active,
  duration = 3000,
  pieces = 50,
  onComplete,
}) => {
  const confettiPieces = useRef<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      // Generate confetti pieces
      confettiPieces.current = Array.from({ length: pieces }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: Math.random() * 8 + 6,
        rotation: new Animated.Value(0),
        translateY: new Animated.Value(-50),
        translateX: new Animated.Value(0),
        opacity: new Animated.Value(1),
      }));

      // Animate each piece
      confettiPieces.current.forEach((piece, index) => {
        const delay = Math.random() * 500;
        const horizontalMovement = (Math.random() - 0.5) * 200;

        Animated.parallel([
          Animated.timing(piece.translateY, {
            toValue: height + 100,
            duration: duration + Math.random() * 1000,
            delay,
            easing: Easing.quad,
            useNativeDriver: true,
          }),
          Animated.timing(piece.translateX, {
            toValue: horizontalMovement,
            duration: duration,
            delay,
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.timing(piece.rotation, {
              toValue: 1,
              duration: 1000 + Math.random() * 500,
              easing: Easing.linear,
              useNativeDriver: true,
            })
          ),
          Animated.timing(piece.opacity, {
            toValue: 0,
            duration: duration,
            delay: delay + duration * 0.7,
            useNativeDriver: true,
          }),
        ]).start();
      });

      // Call onComplete after animation
      const timer = setTimeout(() => {
        onComplete?.();
      }, duration + 500);

      return () => clearTimeout(timer);
    }
  }, [active, duration, pieces, onComplete]);

  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiPieces.current.map((piece) => (
        <Animated.View
          key={piece.id}
          style={[
            styles.confetti,
            {
              left: piece.x,
              width: piece.size,
              height: piece.size * 1.5,
              backgroundColor: piece.color,
              borderRadius: piece.size / 4,
              transform: [
                { translateY: piece.translateY },
                { translateX: piece.translateX },
                {
                  rotate: piece.rotation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
              opacity: piece.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

// Celebration burst effect
export const CelebrationBurst: React.FC<{ active: boolean; onComplete?: () => void }> = ({
  active,
  onComplete,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (active) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 500,
          delay: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        scaleAnim.setValue(0);
        onComplete?.();
      });
    }
  }, [active]);

  if (!active) return null;

  return (
    <View style={styles.burstContainer} pointerEvents="none">
      <Animated.View
        style={[
          styles.burst,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {[...Array(8)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.burstRay,
              {
                transform: [{ rotate: `${i * 45}deg` }],
                backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              },
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
};

// Success checkmark animation
export const SuccessAnimation: React.FC<{ active: boolean }> = ({ active }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (active) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(checkAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [active]);

  if (!active) return null;

  return (
    <Animated.View
      style={[
        styles.successContainer,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={styles.successCircle}>
        <Animated.View
          style={[
            styles.checkmark,
            {
              opacity: checkAnim,
              transform: [
                {
                  scale: checkAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.checkmarkStem} />
          <View style={styles.checkmarkKick} />
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  confetti: {
    position: 'absolute',
    top: 0,
  },
  burstContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  burst: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  burstRay: {
    position: 'absolute',
    width: 8,
    height: 60,
    borderRadius: 4,
  },
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 30,
    height: 30,
    position: 'relative',
  },
  checkmarkStem: {
    position: 'absolute',
    width: 4,
    height: 20,
    backgroundColor: '#FFFFFF',
    left: 18,
    top: 5,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  checkmarkKick: {
    position: 'absolute',
    width: 4,
    height: 10,
    backgroundColor: '#FFFFFF',
    left: 8,
    top: 15,
    borderRadius: 2,
    transform: [{ rotate: '-45deg' }],
  },
});

export default { Confetti, CelebrationBurst, SuccessAnimation };
