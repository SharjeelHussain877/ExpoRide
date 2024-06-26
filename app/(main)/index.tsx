import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import BottomCard from "@/components/BottomCard";

const defaultColor = "#20588F";

export default function DashboardScreen() {
  const navigation = useNavigation();

  // const goToScreen = (screenName) => {
  //   navigation.navigate(screenName);
  // };

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <View style={Styles.Header}>
        <Text style={Styles.headText}>Try local Favourite</Text>
        <Text style={Styles.titleText}>
          Local Resturant are open with delivering with Uber Eats
        </Text>
        <TouchableOpacity style={Styles.headerBtn}>
          <Text style={Styles.headerBtnText}>Order Now</Text>
        </TouchableOpacity>
      </View>
      <View style={Styles.ImageDiv}>
        <Link href={"/(map)/(location)"}>
          <View style={{ marginBottom: 10 }}>
            <Image
              source={{
                uri: "https://www.shareicon.net/data/2015/06/12/53301_car_512x512.png", 
              }}
              style={Styles.cardImage1}
            />
            <Text style={Styles.cardText}> Go Ride </Text>
          </View>
        </Link>
        <Link href={"/(map)/(location)"}>
          <View>
            <Image
              source={{
                uri: "https://static.vecteezy.com/system/resources/previews/019/607/567/non_2x/fast-food-vector-clipart-design-graphic-clipart-design-free-png.png",
              }}
              style={Styles.cardImage1}
            />
            <Text style={Styles.cardText}>Food</Text>
          </View>
        </Link>
      </View>
      <Text style={Styles.text}>History</Text>

      <BottomCard title={"Clifton"} description={"78500"} />
      <BottomCard title={"Nazimabad"} description={"43500"} />
      <BottomCard title={"Bahadurabad"} description={"34930"} />
      <BottomCard title={"Model"} description={"53783"} />
    </ScrollView>
  );
}

const Styles = StyleSheet.create({
  Header: {
    backgroundColor: "#175E96",
  },
  headText: {
    fontSize: 25,
    color: "#FFFFFF",
    fontWeight: "bold",
    paddingLeft: 20,
    margin: 2,
    paddingTop: 20,
    padding: 9,
  },
  titleText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "400",
    paddingLeft: 23,
    width: 260,
  },
  headerBtn: {
    backgroundColor: "#1a2639",
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 25,
    alignItems: "center",
    width: 190,
    marginLeft: 25,
    marginBottom: 40,
  },
  headerBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  ImageDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    borderRightWidth: 2,
    borderRightColor: "#c3c3c3",
    // bottom:40,
    marginVertical: 10,
    gap: 90,
    borderBottomWidth: 6,
    borderBlockColor: "#c3c3c3",
  },
  cardImage1: {
    width: 100,
    height: 100,
    objectFit: "contain",
  },
  cardText: {
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
    marginTop: 10,
  },
  text: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#AEAEAE",
    marginBottom: 16,
    marginLeft: 15,
  },
});
