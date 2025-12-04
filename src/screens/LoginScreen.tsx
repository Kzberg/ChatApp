import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setErr("Isi email dan password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("Chat");
    } catch (e) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        navigation.replace("Chat");
      } catch (e2) {
        setErr("Gagal login/daftar");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login / Daftar</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button title="Masuk" onPress={handleLogin} />

      {err ? <Text style={styles.error}>{err}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 80 },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  error: { color: "red", marginTop: 10 },
  title: { fontSize: 26, marginBottom: 25, textAlign: "center" },
});
