// app/(auth)/_layout.tsx
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: false,
      animation: 'slide_from_right', // Smooth geçiş animasyonu
      gestureEnabled: true, // Swipe back desteği
    }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="email-verification" />
      <Stack.Screen name="onboarding-intro" />
      <Stack.Screen name="personality-test" />
      <Stack.Screen name="psychologist-matching" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}