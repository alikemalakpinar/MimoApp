// app/(patient)/_layout.tsx - Patient routes layout
import { Stack } from 'expo-router';
import { Colors } from '../../shared/theme';

export default function PatientLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.light.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="therapist-search" />
      <Stack.Screen name="therapist/[id]" />
      <Stack.Screen name="mood/check-in" />
      <Stack.Screen name="mood/history" />
      <Stack.Screen name="appointment/slot-select" />
      <Stack.Screen name="appointment/confirm" />
      <Stack.Screen name="payment/checkout" />
      <Stack.Screen name="surveys/phq9" />
      <Stack.Screen name="surveys/gad7" />
    </Stack>
  );
}
