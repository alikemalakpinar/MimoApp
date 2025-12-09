// app/(therapist)/_layout.tsx - Therapist routes layout
import { Stack } from 'expo-router';
import { Colors } from '../../shared/theme';

export default function TherapistLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.light.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="appointments" />
      <Stack.Screen name="availability" />
      <Stack.Screen name="session-notes" />
    </Stack>
  );
}
