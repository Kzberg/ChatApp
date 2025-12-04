import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { messagesCollection, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { launchImageLibrary } from "react-native-image-picker";
import { auth } from "../firebase";

export default function ChatScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // Load offline first
    (async () => {
      const saved = await AsyncStorage.getItem("chat_history");
      if (saved) setMessages(JSON.parse(saved));
    })();

    // Listen Firestore
    const q = query(messagesCollection, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, async (snap) => {
      const list: any[] = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...(doc.data() as any) }));
      setMessages(list);
      await AsyncStorage.setItem("chat_history", JSON.stringify(list));
    });

    return () => unsub();
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    await addDoc(messagesCollection, {
      text: message,
      user: auth.currentUser?.email || "User",
      createdAt: serverTimestamp(),
    });

    setMessage("");
  };

  const uploadImage = async () => {
    const result: any = await launchImageLibrary({ mediaType: "photo" });
    if (!result.assets || result.assets.length === 0) return;

    const img = result.assets[0];
    const imgUri = img.uri;

    const response = await fetch(imgUri);
    const blob = await response.blob();

    const imgRef = ref(storage, `images/${Date.now()}.jpg`);
    await uploadBytes(imgRef, blob);
    const url = await getDownloadURL(imgRef);

    await addDoc(messagesCollection, {
      image: url,
      user: auth.currentUser?.email,
      createdAt: serverTimestamp(),
    });
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.msgBox}>
      <Text style={styles.user}>{item.user}</Text>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <Text style={styles.text}>{item.text}</Text>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList data={messages} keyExtractor={(i) => i.id} renderItem={renderItem} />

      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Ketik pesan..."
        style={styles.input}
      />

      <Button title="Kirim" onPress={sendMessage} />
      <Button title="Upload Gambar" onPress={uploadImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  msgBox: {
    padding: 12,
    backgroundColor: "#eee",
    marginBottom: 10,
    borderRadius: 10,
  },
  user: { fontSize: 12, fontWeight: "bold", marginBottom: 5 },
  text: { fontSize: 16 },
  image: { width: 200, height: 200, borderRadius: 10 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
  },
});
