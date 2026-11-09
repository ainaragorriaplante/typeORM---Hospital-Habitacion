import { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

type Hospital = { id: number; nombre: string };
type Habitacion = {
  id: number;
  nombre: string;
  camas: number;
  hospital: Hospital;
};
type CheckResult = { estado: string; base: string; hora: string };
type HospitalGroup = { hospital: Hospital; habitaciones: Habitacion[] };

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return (await response.json()) as T;
}

export default function App() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function cargarRegistros() {
    setLoading(true);
    setError("");
    try {
      const [health, registros] = await Promise.all([
        getJson<CheckResult>("/salud"),
        getJson<Habitacion[]>("/habitaciones"),
      ]);
      setResult(health);
      setHabitaciones(registros);
    } catch (requestError) {
      setResult(null);
      setHabitaciones([]);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudieron cargar los registros.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void cargarRegistros();
  }, []);

  const grupos = habitaciones.reduce<HospitalGroup[]>((items, habitacion) => {
    let grupo = items.find((item) => item.hospital.id === habitacion.hospital.id);
    if (!grupo) {
      grupo = { hospital: habitacion.hospital, habitaciones: [] };
      items.push(grupo);
    }
    grupo.habitaciones.push(habitacion);
    return items;
  }, []);

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>FRONTEND · EXPO + REACT NATIVE</Text>
          <Text style={styles.title}>Hospital · registros</Text>
          <Text style={styles.copy}>
            Hospitales y sus habitaciones registradas.
          </Text>
          <Text style={styles.url}>API: {API_URL}</Text>
          {loading ? <Text style={styles.status}>Cargando registros…</Text> : null}
          {result ? (
            <Text style={styles.ok}>
              ✓ Backend conectado · PostgreSQL · {result.base}
            </Text>
          ) : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {!loading && !error && grupos.length === 0 ? (
            <Text style={styles.empty}>No hay hospitales con habitaciones registradas.</Text>
          ) : null}

          {grupos.map((grupo) => (
            <View key={grupo.hospital.id} style={styles.hospitalCard}>
              <Text style={styles.hospitalName}>{grupo.hospital.nombre}</Text>
              <Text style={styles.sectionTitle}>Habitaciones</Text>
              {grupo.habitaciones.map((habitacion) => (
                <View key={habitacion.id} style={styles.roomRow}>
                  <Text style={styles.roomText}>
                    {habitacion.nombre} · {habitacion.camas}{" "}
                    {habitacion.camas === 1 ? "cama" : "camas"}
                  </Text>
                </View>
              ))}
            </View>
          ))}

          <Pressable
            accessibilityRole="button"
            disabled={loading}
            onPress={() => void cargarRegistros()}
            style={[styles.button, loading && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>
              {loading ? "Cargando…" : "Volver a comprobar"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f3f5ed" },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 620,
    alignSelf: "center",
    padding: 28,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    gap: 12,
  },
  eyebrow: { color: "#47705f", fontSize: 12, fontWeight: "700", letterSpacing: 1.2 },
  title: { color: "#183a32", fontSize: 30, fontWeight: "800" },
  copy: { color: "#52675d", fontSize: 16 },
  url: { color: "#334d43", fontFamily: "monospace", fontSize: 13 },
  status: { color: "#52675d" },
  ok: { color: "#17633e", fontWeight: "700" },
  error: { color: "#a13030" },
  empty: { color: "#52675d", paddingVertical: 8 },
  hospitalCard: {
    marginTop: 8,
    padding: 18,
    borderRadius: 12,
    backgroundColor: "#f8f9f5",
  },
  hospitalName: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#eaf0e9",
    color: "#204e43",
    fontSize: 14,
    fontWeight: "700",
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 4,
    color: "#183a32",
    fontSize: 23,
    fontWeight: "800",
  },
  roomRow: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#dce2da",
  },
  roomText: { color: "#334d43", fontSize: 16 },
  button: {
    alignSelf: "flex-start",
    marginTop: 4,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#204e43",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#ffffff", fontWeight: "700" },
});
