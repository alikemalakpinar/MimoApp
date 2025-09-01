import { Tabs } from "expo-router";
export default function TabsLayout(){
  return (
    <Tabs screenOptions={{ headerShown:false }}>
      <Tabs.Screen name="home" options={{ title: "Ana Sayfa" }}/>
      <Tabs.Screen name="appointments" options={{ title: "Randevular" }}/>
      <Tabs.Screen name="chat" options={{ title: "Sohbet" }}/>
      <Tabs.Screen name="profile" options={{ title: "Profil" }}/>
    </Tabs>
  );
}
