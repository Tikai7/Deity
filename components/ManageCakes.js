/**
 * ManageCakes.js
 * Permet à l'utilisateur d'ajouter / supprimer des gâteaux dynamiques.
 * Les gâteaux statiques (dans STATIC_CAKES) sont affichés en lecture seule.
 * Les gâteaux dynamiques sont persistés dans AsyncStorage (clé "dynamic_cakes").
 *
 * Dépendance : expo-image-picker  →  npx expo install expo-image-picker
 */

import React, { useState, useEffect, useContext } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, Image,
    TextInput, Alert, Modal, ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { containerStyles, textStyles, buttonStyles, PALETTE } from '../styles/Styles';
import {
    STATIC_CAKES, getDynamicCakes, saveDynamicCakes
} from '../utils/CakesConfig';
import { Data } from '../context/Data';

export default function ManageCakes({ handleVisible }) {
    const { isIOS, setRefresh } = useContext(Data);

    const [dynamicCakes, setDynamicCakes] = useState([]);
    const [loading, setLoading]           = useState(true);

    // Modal d'ajout
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [newName, setNewName]                 = useState("");
    const [newImageUri, setNewImageUri]         = useState(null);

    // ── Chargement initial ────────────────────────────────────────────────────
    useEffect(() => {
        const load = async () => {
            const d = await getDynamicCakes();
            setDynamicCakes(d);
            setLoading(false);
        };
        load();
    }, []);

    // ── Image picker ──────────────────────────────────────────────────────────
    async function pickImage() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission refusée", "Autorisez l'accès à la galerie dans les paramètres.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled && result.assets.length > 0) {
            setNewImageUri(result.assets[0].uri);
        }
    }

    // ── Ajout d'un nouveau gâteau dynamique ───────────────────────────────────
    async function handleAdd() {
        if (!newName.trim()) {
            Alert.alert("Nom requis", "Veuillez saisir un nom pour ce gâteau.");
            return;
        }
        if (!newImageUri) {
            Alert.alert("Image requise", "Veuillez sélectionner une image.");
            return;
        }

        // ID : max id existant + 1 (statiques + dynamiques)
        const allIds = [...STATIC_CAKES, ...dynamicCakes].map(c => c.id);
        const newId  = allIds.length > 0 ? Math.max(...allIds) + 1 : 1;

        const newCake = {
            id:    newId,
            name:  newName.trim(),
            image: newImageUri,   // URI string → rendu avec { uri: ... }
        };

        const updated = [...dynamicCakes, newCake];
        await saveDynamicCakes(updated);
        setDynamicCakes(updated);
        setRefresh(old => !old);  // propage à toute l'app

        // Reset modal
        setNewName("");
        setNewImageUri(null);
        setAddModalVisible(false);
    }

    // ── Suppression d'un gâteau dynamique ─────────────────────────────────────
    function confirmDelete(cake) {
        Alert.alert(
            "Supprimer ce gâteau ?",
            `"${cake.name}" sera retiré de l'application.\nLes commandes existantes ne sont pas affectées.`,
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer", style: "destructive",
                    onPress: async () => {
                        const updated = dynamicCakes.filter(c => c.id !== cake.id);
                        await saveDynamicCakes(updated);
                        setDynamicCakes(updated);
                        setRefresh(old => !old);
                    }
                }
            ]
        );
    }

    // ── Render d'une ligne gâteau ─────────────────────────────────────────────
    function CakeRow({ cake, isDynamic }) {
        return (
            <View style={{
                flexDirection: "row", alignItems: "center",
                paddingVertical: 12, paddingHorizontal: 16,
                borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.15)',
            }}>
                <Image
                    source={typeof cake.image === 'string' ? { uri: cake.image } : cake.image}
                    style={{ width: 56, height: 56, borderRadius: 10, marginRight: 14 }}
                />
                <View style={{ flex: 1 }}>
                    <Text style={{ ...textStyles.primaryText, fontSize: 16 }}>{cake.name}</Text>
                    <Text style={{ color: PALETTE.tertiary, fontSize: 12, marginTop: 2 }}>
                        {isDynamic ? "Personnalisé" : "Par défaut"}
                    </Text>
                </View>
                {isDynamic && (
                    <TouchableOpacity onPress={() => confirmDelete(cake)} style={{ padding: 8 }}>
                        <MaterialIcons name="delete-outline" size={24} color={PALETTE.secondary} />
                    </TouchableOpacity>
                )}
                {!isDynamic && (
                    <MaterialIcons name="lock-outline" size={20} color={PALETTE.tertiary} />
                )}
            </View>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <ScrollView style={{ backgroundColor: PALETTE.primary, paddingTop: isIOS ? "35%" : "15%", width: "100%" }}>

            {/* Header */}
            <View style={{ flexDirection: "row", marginTop: isIOS ? "-10%" : "0%", marginBottom: "5%", paddingHorizontal: "5%", alignItems: "center" }}>
                <TouchableOpacity onPress={handleVisible} style={{ marginRight: 12 }}>
                    <MaterialIcons name="arrow-back" size={30} color={PALETTE.white} />
                </TouchableOpacity>
                <Text style={{ ...textStyles.title, fontSize: 22, marginBottom: 0, flex: 1, textAlign: "left" }}>
                    Gérer les gâteaux
                </Text>
                <TouchableOpacity
                    onPress={() => setAddModalVisible(true)}
                    style={{
                        backgroundColor: PALETTE.white,
                        borderRadius: 20, width: 40, height: 40,
                        alignItems: "center", justifyContent: "center",
                    }}
                >
                    <MaterialIcons name="add" size={26} color={PALETTE.primary} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator color={PALETTE.white} style={{ marginTop: 40 }} />
            ) : (
                <View style={{ marginHorizontal: "5%", borderRadius: 12, overflow: "hidden", backgroundColor: 'rgba(255,255,255,0.08)' }}>
                    {/* Gâteaux statiques */}
                    {STATIC_CAKES.map(cake => <CakeRow key={cake.id} cake={cake} isDynamic={false} />)}

                    {/* Gâteaux dynamiques */}
                    {dynamicCakes.map(cake => <CakeRow key={cake.id} cake={cake} isDynamic={true} />)}

                    {dynamicCakes.length === 0 && (
                        <View style={{ padding: 24, alignItems: "center" }}>
                            <Text style={{ color: PALETTE.tertiary, textAlign: "center" }}>
                                Aucun gâteau personnalisé.{'\n'}Appuyez sur "+" pour en ajouter un.
                            </Text>
                        </View>
                    )}
                </View>
            )}

            {/* ── Modal ajout ─────────────────────────────────────────────── */}
            <Modal visible={addModalVisible} animationType="slide" transparent>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: "flex-end" }}>
                    <View style={{
                        backgroundColor: PALETTE.primary,
                        borderTopLeftRadius: 24, borderTopRightRadius: 24,
                        padding: 28, paddingBottom: isIOS ? 48 : 28,
                    }}>
                        <Text style={{ ...textStyles.title, fontSize: 20, marginBottom: 20, textAlign: "center" }}>
                            Nouveau gâteau
                        </Text>

                        {/* Sélecteur d'image */}
                        <TouchableOpacity onPress={pickImage} style={{
                            alignSelf: "center", marginBottom: 20,
                            width: 110, height: 110, borderRadius: 14,
                            borderWidth: 2, borderColor: PALETTE.white,
                            borderStyle: "dashed",
                            alignItems: "center", justifyContent: "center",
                            overflow: "hidden",
                        }}>
                            {newImageUri ? (
                                <Image source={{ uri: newImageUri }} style={{ width: 110, height: 110 }} />
                            ) : (
                                <View style={{ alignItems: "center" }}>
                                    <MaterialIcons name="add-photo-alternate" size={36} color={PALETTE.white} />
                                    <Text style={{ color: PALETTE.white, fontSize: 12, marginTop: 4 }}>Choisir image</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Nom */}
                        <TextInput
                            value={newName}
                            onChangeText={setNewName}
                            placeholder="Nom du gâteau (ex: Tarte citron)"
                            placeholderTextColor={PALETTE.tertiary}
                            maxLength={30}
                            style={{
                                ...containerStyles.inputContainer,
                                width: "100%", marginBottom: 24,
                            }}
                        />

                        {/* Boutons */}
                        <TouchableOpacity
                            onPress={handleAdd}
                            style={{ ...buttonStyles.primaryButton, width: "100%", height: 50, marginBottom: 12 }}
                        >
                            <Text style={textStyles.secondaryText}>Ajouter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { setAddModalVisible(false); setNewName(""); setNewImageUri(null); }}
                            style={{ ...buttonStyles.secondaryButton, width: "100%", height: 50 }}
                        >
                            <Text style={textStyles.primaryText}>Annuler</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );
}
