// app/(growth-manager)/_layout.tsx - Growth Manager routes layout
import { Stack } from 'expo-router';
import { Colors } from '../../shared/theme';

export default function GrowthManagerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.light.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="dashboard" />
    </Stack>
  );
}
