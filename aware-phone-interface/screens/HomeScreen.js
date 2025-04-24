import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
  Alert,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Searchbar } from "react-native-paper";
import { useDrunkMode } from "../constants/DrunkModeContext";
import { fetchAllApps, fetchAppRestrictions, subscribeToAppRestrictions } from "@/services/AppService";

// Constants for grid layout
const numColumns = 4;
const screenWidth = Dimensions.get("window").width;
const itemSize = screenWidth / numColumns - 20;
const drunkModeItemSize = screenWidth / 3 - 20;
const dockSize = screenWidth / 5;

export default function HomeScreen() {
  const navigation = useNavigation();
  const { isDrunkMode, toggleDrunkMode } = useDrunkMode(); // Access Drunk Mode context

  const [apps, setApps] = useState([]); // Store the list of apps
  const [searchQuery, setSearchQuery] = useState(""); // Store the search query
  const [loading, setLoading] = useState(true); // Loading state
  const [showBACModal, setShowBACModal] = useState(false);
  const [drinkInput, setDrinkInput] = useState('');
  const [bac, setBac] = useState(null);

  // Load all apps and their restrictions initially
  useEffect(() => {
    const loadAppsAndRestrictions = async () => {
      setLoading(true);
      try {
        const fetchedApps = await fetchAllApps();
        const restrictedApps = await fetchAppRestrictions(fetchedApps);
        setApps(restrictedApps); // Update the app list
      } catch (error) {
        console.error("Error fetching apps or restrictions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAppsAndRestrictions();
  }, []); // Run on first render

  // Fetch restrictions only when Drunk Mode changes
  useEffect(() => {
    const loadRestrictions = async () => {
      setLoading(true);
      try {
        const updatedApps = await fetchAppRestrictions(apps);
        setApps(updatedApps); // Update the app list with new restrictions
      } catch (error) {
        console.error("Error fetching restrictions on drunk mode toggle:", error);
      } finally {
        setLoading(false);
      }
    };

    if (apps.length > 0) {
      loadRestrictions(); // Fetch restrictions when Drunk Mode toggles
    }
  }, [isDrunkMode]); // Dependency on Drunk Mode state

  // Subscribe to real-time restriction updates
  useEffect(() => {
    const unsubscribe = subscribeToAppRestrictions(async () => {
      const updatedApps = await fetchAppRestrictions(apps);
      setApps(updatedApps); // Update the app list when restrictions change
    });

    return () => {
      unsubscribe(); // Unsubscribe when the component unmounts
    };
  }, []);

  // Handlers for emergency actions (only show up when in Drunk Mode)
  const handleShareLocation = () => {
    Alert.alert("Details Shared", "📍 Location and Safety Prefrences Shared with Emergency Contact.", [{ text: "OK" }]);
  };

  const handleCall999 = () => {
    Alert.alert("Confirm Call", "Are you sure you want to call 999?", [
      { text: "Cancel", style: "cancel" },
      { text: "Call", onPress: () => Alert.alert("Calling 999", "📞 Emergency services contacted.", [{ text: "OK" }]) },
    ]);
  };

  const handleCallDriver = () => {
    Alert.alert("Designated Driver", "📞 Calling your designated driver.", [{ text: "OK" }]);
  };

  // Filter apps based on Drunk Mode and search query
  const visibleApps = isDrunkMode
    ? apps.filter((app) => !app.isRestricted)
    : apps.filter((app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const renderItem = ({ item }) => {
    const isDisabled = isDrunkMode && item.isRestricted;
    const itemSizeStyle = isDrunkMode ? drunkModeItemSize : itemSize;

    return (
      <TouchableOpacity
        style={[
          styles.item,
          { backgroundColor: item.colour || "#707B7C", width: itemSizeStyle, height: itemSizeStyle }
        ]}
        onPress={() => !isDisabled && navigation.navigate(item.name)}
        disabled={isDisabled}
      >
        <Ionicons name={item.icon} size={50} color="#fff" />
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderDockItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.dockItem, { backgroundColor: item.colour || '#707B7C' }]}
      onPress={() => navigation.navigate(item.name)}
    >
      <Ionicons name={item.icon} size={40} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <StatusBar barStyle="light-content" />
      <Searchbar 
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      {/* Drunk Mode Toggle */}
      <View style={styles.drunkModeContainer}>
        <Text style={styles.drunkModeText}>Drunk Mode</Text>
        <TouchableOpacity
          onPress={() => {
            if (isDrunkMode) {
              Alert.alert(
                "Disable Drunk Mode?",
                "Are you sure you want to turn Drunk Mode off?",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Turn Off", onPress: () => toggleDrunkMode() }
                ]
              );
            } else {
              toggleDrunkMode();
            }
          }}
          style={styles.drunkModeButton}
        >
          <Text style={styles.drunkModeButtonText}>{isDrunkMode ? "ON 🍻" : "OFF ❌"}</Text>
        </TouchableOpacity>
      </View>

      {/* App Grid */}
      {loading ? (
        <Text style={styles.loadingText}>Loading apps...</Text>
      ) : (
        <FlatList
          data={visibleApps}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          key={isDrunkMode ? 'drunk' : 'sober'}
          numColumns={isDrunkMode ? 3 : numColumns}
          contentContainerStyle={styles.grid}
        />
      )}

      {/* Dock for Drunk Mode */}
      {!isDrunkMode && (
        <View style={styles.dockContainer}>
          <FlatList
            data={visibleApps.slice(0, 4)}
            renderItem={renderDockItem}
            keyExtractor={(item) => item.id}
            horizontal
            contentContainerStyle={styles.dock}
          />
        </View>
      )}

      {/* Drunk Mode Buttons */}
      {isDrunkMode && (
        <View style={styles.drunkButtonsContainer}>
          <View style={styles.drunkButtonRow}>
            <TouchableOpacity style={styles.drunkButton} onPress={handleShareLocation}>
              <Text style={styles.drunkButtonText}>📍 Share Safety Info</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drunkButton} onPress={handleCall999}>
              <Text style={styles.drunkButtonText}>🚨 Call 999</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.drunkButtonRow}>
            <TouchableOpacity style={styles.drunkButton} onPress={handleCallDriver}>
              <Text style={styles.drunkButtonText}>🚗 Call Driver</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drunkButton} onPress={() => setShowBACModal(true)}>
              <Text style={styles.drunkButtonText}>🧪 BAC Calculator</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal visible={showBACModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>BAC Estimator</Text>
            <View style={styles.stepperContainer}>
              <Text style={styles.label}>Number of Drinks</Text>
              <View style={styles.stepperRow}>
                <TouchableOpacity onPress={() => setDrinkInput((prev) => String(Math.max((parseInt(prev) || 0) - 1, 0)))} style={styles.stepperButton}>
                  <Text style={styles.stepperText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{drinkInput || '0'}</Text>
                <TouchableOpacity onPress={() => setDrinkInput((prev) => String((parseInt(prev) || 0) + 1))} style={styles.stepperButton}>
                  <Text style={styles.stepperText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.drunkButton}
              onPress={() => {
                const weight = 65; // TODO: fetch from Supabase
                const drinks = parseFloat(drinkInput);
                if (!isNaN(drinks)) {
                  const bodyWater = 0.58;
                  const metabolismRate = 0.015;
                  const estimated = ((drinks * 10) / (weight * bodyWater) - metabolismRate).toFixed(3);
                  setBac(Math.max(estimated, 0));
                }
              }}
            >
              <Text style={styles.drunkButtonText}>Estimate</Text>
            </TouchableOpacity>
            {bac !== null && (
              <Text style={styles.bacResult}>Estimated BAC: {bac}%</Text>
            )}
            <TouchableOpacity onPress={() => setShowBACModal(false)} style={styles.drunkButton}>
              <Text style={styles.drunkButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 40,
  },
  grid: {
    justifyContent: 'center',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  itemText: {
    marginTop: 5,
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  dockContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  dockItem: {
    width: dockSize,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal: 5,
  },
  searchbar: {
    backgroundColor: 'white',
    marginLeft: 1,
  },
  loadingText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  drunkModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  drunkModeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  drunkModeButton: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 5,
  },
  drunkModeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  drunkButtonsContainer: {
    marginHorizontal: 10,
  },
  drunkButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  drunkButton: {
    backgroundColor: 'red',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  drunkButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  stepperContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButton: {
    backgroundColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10,
  },
  stepperText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  stepperValue: {
    fontSize: 18,
    fontWeight: '500',
    minWidth: 30,
    textAlign: 'center',
  },
  bacResult: {
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
});
