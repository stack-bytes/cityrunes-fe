import { LinearGradient } from "expo-linear-gradient";

export default function Background({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LinearGradient
      colors={["#E7F3FF", "#DDEBFB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1, borderRadius: 40 }}
    >
      {children}
    </LinearGradient>
  );
}
