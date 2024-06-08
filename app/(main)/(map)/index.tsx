import React, { useEffect, useContext, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import MapView, { Marker, Polyline } from "react-native-maps";
import { FontAwesome6 } from "@expo/vector-icons";
import { debounce } from "lodash";
import API from "@/constants/Api";
import { GlobalContext } from "../../../constants/globalContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

function decodePolyline(encoded: any) {
  let points = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
      let b, shift = 0, result = 0;
      do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
      } while (b >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
      } while (b >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lng * 1e-5, longitude: lat * 1e-5 });
  }

  return points;
}

export default function Page() {
  const [poly, setPoly] = useState<any>([]);
  const [res, setRes] = useState<any>(null);
  const [recent, setRecent] = useState<any>(null);
  const {state} =useContext(GlobalContext)
useEffect(() => {
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("search-destination");
      if (value !== null) {
        const val = JSON.parse(value);
        setRecent(Array.isArray(val) ? val : [val]);
      }
    } catch (e) {
      console.error('Error reading value', e);
    }
  };
  getData()
}, [])

// const handleMyLocationData = (data: any) => {
//   updateFirstLocation(data);
// };
// const handleSecondLocationdata = (data: any) => {
//   updateSecondLocation(data);
// };
  const initialRegion = {
    latitude: 30.3753,
    longitude: 69.3451,
    latitudeDelta: 5,
    longitudeDelta: 5,
  };

  const locationDelayedApi = debounce(
    async (mylocation: any, destination: any) => {
      let obj = {
        point_1: `${mylocation.point.lng},${mylocation.point.lat}`,
        point_2: `${destination.point.lng},${destination.point.lat}`,
      };

      try {
        const response = await API.getRoutes(obj);
        setRes(response);
      } catch (error) {
        console.log(error);
      }
    },
    500
  );
  

  useEffect(() => {
    if (state.firstLocation && state.secondLocation) {
      locationDelayedApi(state.firstLocation, state.secondLocation);
    }
  }, [state]);

  useEffect(() => {
    if (res) {
      const points = res.paths?.map((v: any) => v.points)[0];
      // if (points) {
      //   const arr: any = ;
      //   setPoly(arr);
      // }
      setPoly(points)
    }
  }, [res]);

  let coord = [
    { latitude: 67.00476, longitude: 24.914440000000003 },
    { latitude: 67.00704, longitude: 24.911350000000002 },
    { latitude: 67.00852, longitude: 24.908260000000002 },
    { latitude: 67.00999, longitude: 24.90397 },
    { latitude: 67.0112, longitude: 24.900360000000003 },
    { latitude: 67.01234000000001, longitude: 24.899160000000002 },
    { latitude: 67.01388, longitude: 24.898300000000003 },
    { latitude: 67.01589, longitude: 24.898130000000002 },
    { latitude: 67.01744000000001, longitude: 24.899330000000003 },
    { latitude: 67.01844000000001, longitude: 24.90088 },
  ];

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {state.firstLocation && (
          <Marker
            coordinate={{
              latitude: state.firstLocation.point.lat,
              longitude: state.firstLocation.point.lng,
            }}
            title="First Marker"
            description="This is the first marker"
          />
        )}

        {state.secondLocation && (
          <Marker
            coordinate={{
              latitude: state.secondLocation.point.lat,
              longitude: state.secondLocation.point.lng,
            }}
            title="Second Marker"
            description="This is the second marker"
          />
        )}
        {/* <Polyline
            coordinates={coord}
            strokeWidth={5}
            strokeColor="red"
          /> */}

          <Polyline coordinates={decodePolyline(poly)} strokeWidth={5} strokeColor="red" />
        
      </MapView>
      <View style={styles.Movebutton}>
        <Link style={styles.button} href="/(location)">
          <FontAwesome6 name="arrow-trend-up" size={40} />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    marginTop: 3,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    paddingHorizontal: 18,
    borderRadius: 30,
    elevation: 3,
    backgroundColor: "#FFFFFF",
    color: "#175E96",
  },
  Movebutton: {
    bottom: 60,
    left: 110,
  },
});


// import React, { useState, useEffect, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   SafeAreaView,
//   ActivityIndicator,
//   Image,
// } from "react-native";
// import MapView, { Marker, Polyline } from "react-native-maps";
// import * as Location from "expo-location";
// import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
// import { router, useLocalSearchParams } from "expo-router";
// import { getDistance } from "geolib";

// const Pickup = () => {
//   const [location, setLocation] = useState(null);
//   const [destinationLocation, setDestinationLocation] = useState(null);
//   const [startLocation, setStartLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);
//   const mapRef = useRef(null);
//   const { startPointData, destinationPoint, focusedIcon } =
//     useLocalSearchParams();
//   const [distance, setDistance] = useState(null);
//   const [route, setRoute] = useState("");
//   const [price, setPrice] = useState(null);

//   // console.log(startPointData, "startPoint");
//   // console.log(destinationPoint, "destination");
//   // console.log(focusedIcon, "icon");

//   const pricingData = [
//     {
//       category: "basic",
//       range: [1, 3],
//       bike: 150,
//       rickshaw: 300,
//       car: 450,
//     },
//     {
//       category: "middle",
//       range: [3, 7],
//       bike: 300,
//       rickshaw: 450,
//       car: 600,
//     },
//     {
//       category: "high",
//       range: [7, 10],
//       bike: 450,
//       rickshaw: 600,
//       car: 750,
//     },
//   ];

//   useEffect(() => {
//     if (startPointData && destinationPoint) {
//       const start = JSON.parse(startPointData);
//       const end = JSON.parse(destinationPoint);
//       setStartLocation(start);
//       setDestinationLocation(end);
//       calculateDistance(start.geocodes.main, end.geocodes.main);
//     }
//   }, [startPointData, destinationPoint]);

//   useEffect(() => {
//     if (startLocation && destinationLocation) {
//       routingSet();
//     }
//   }, [startLocation, destinationLocation]);

//   const routingSet = async () => {
//     if (!startLocation || !destinationLocation) {
//       console.log("Start point or destination point is missing");
//       return;
//     }

//     const startLat = startLocation.geocodes.main.latitude;
//     const startLng = startLocation.geocodes.main.longitude;
//     const endLat = destinationLocation.geocodes.main.latitude;
//     const endLng = destinationLocation.geocodes.main.longitude;

//     try {
//       const resp = await fetch(
//         https://graphhopper.com/api/1/route?point=${startLat},${startLng}&point=${endLat},${endLng}&profile=car&locale=de&calc_points=true&key=0dd88075-7e23-46cc-9abe-f3bf99fc0800
//       );

//       const data = await resp.json();
//       setRoute(data.paths[0].points);
//     } catch (error) {
//       console.error("Error fetching route data:", error);
//     }
//   };

//   const decodePolyline = (encoded) => {
//     const poly = [];
//     let index = 0;
//     let len = encoded.length;
//     let lat = 0;
//     let lng = 0;
//     while (index < len) {
//       let b;
//       let shift = 0;
//       let result = 0;
//       do {
//         b = encoded.charCodeAt(index++) - 63;
//         result |= (b & 0x1f) << shift;
//         shift += 5;
//       } while (b >= 0x20);
//       const dlat = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
//       lat += dlat;
//       shift = 0;
//       result = 0;
//       do {
//         b = encoded.charCodeAt(index++) - 63;
//         result |= (b & 0x1f) << shift;
//         shift += 5;
//       } while (b >= 0x20);
//       const dlng = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
//       lng += dlng;
//       const latlng = { latitude: lat / 1e5, longitude: lng / 1e5 };
//       poly.push(latlng);
//     }
//     console.log(poly);

//     return poly;
//   };

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         setErrorMsg("Permission to access location was denied");
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       setLocation(location);

//       if (mapRef.current && startPointData && destinationPoint) {
//         const start = JSON.parse(startPointData);
//         const end = JSON.parse(destinationPoint);
//         mapRef.current.fitToCoordinates(
//           [
//             {
//               latitude: start.geocodes.main.latitude,
//               longitude: start.geocodes.main.longitude,
//             },
//             {
//               latitude: end.geocodes.main.latitude,
//               longitude: end.geocodes.main.longitude,
//             },
//           ],
//           {
//             edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
//             animated: true,
//           }
//         );
//       }
//     })();
//   }, [startPointData, destinationPoint]);

//   const calculateDistance = (start, end) => {
//     const distanceInMeters = getDistance(
//       { latitude: start.latitude, longitude: start.longitude },
//       { latitude: end.latitude, longitude: end.longitude }
//     );
//     setDistance(distanceInMeters);
//     calculatePrice(distanceInMeters / 1000);
//   };

//   const calculatePrice = (distanceInKm) => {
//     console.log;
//     let calculatedPrice = 0;

//     if (distanceInKm <= 3) {
//       if (focusedIcon === "motorbike") {
//         calculatedPrice = 150;
//       } else if (focusedIcon === "rickshaw") {
//         calculatedPrice = 300;
//       } else if (focusedIcon === "car-side") {
//         calculatedPrice = 450;
//       }
//     } else if (distanceInKm > 3 && distanceInKm <= 7) {
//       if (focusedIcon === "motorbike") {
//         calculatedPrice = 300;
//       } else if (focusedIcon === "rickshaw") {
//         calculatedPrice = 450;
//       } else if (focusedIcon === "car-side") {
//         calculatedPrice = 600;
//       }
//     } else if (distanceInKm > 7 && distanceInKm <= 10) {
//       if (focusedIcon === "motorbike") {
//         calculatedPrice = 450;
//       } else if (focusedIcon === "rickshaw") {
//         calculatedPrice = 600;
//       } else if (focusedIcon === "car-side") {
//         calculatedPrice = 750;
//       }
//     } else if (distanceInKm > 10) {
//       const extraKm = distanceInKm - 10;
//       const multiplier =
//         focusedIcon === "motorbike"
//           ? 50
//           : focusedIcon === "rickshaw"
//           ? 100
//           : 150;
//       calculatedPrice =
//         (focusedIcon === "motorbike"
//           ? 450
//           : focusedIcon === "rickshaw"
//           ? 600
//           : 750) +
//         extraKm * multiplier;
//     }

//     setPrice(calculatedPrice.toFixed(0));
//   };

//   const resetMarkers = () => {
//     setStartLocation(null);
//     setDestinationLocation(null);
//     setDistance(null);
//     setPrice(null);
//     router.push("/(tabs)");
//   };

//   const getIcon = () => {
//     switch (focusedIcon) {
//       case "motorbike":
//         return require("../../assets/images/desBike.png");
//       case "rickshaw":
//         return require("../../assets/images/desRickshaw.png");
//       case "car-side":
//         return require("../../assets/images/desCar.png");
//       default:
//         return require("../../assets/images/desBike.png");
//     }
//   };

//   const CustomMarker = ({ coordinate, title, icon }) => {
//     return (
//       <Marker coordinate={coordinate} title={title}>
//         <Image
//           source={icon}
//           style={{ width: 40, height: 40 }}
//           resizeMode="contain"
//         />
//       </Marker>
//     );
//   };

//   if (errorMsg) {
//     return <Text>{errorMsg}</Text>;
//   }

//   if (!location) {
//     return (
//       <ActivityIndicator size={"large"} color={"#000"} style={styles.loading} />
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         initialRegion={{
//           latitude: location.coords.latitude,
//           longitude: location.coords.longitude,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//       >
//         {!startLocation && !destinationLocation && (
//           <Marker
//             coordinate={{
//               latitude: location.coords.latitude,
//               longitude: location.coords.longitude,
//             }}
//             title={"Your Location"}
//           />
//         )}
//         {startLocation && (
//           <CustomMarker
//             coordinate={{
//               latitude: startLocation.geocodes.main.latitude,
//               longitude: startLocation.geocodes.main.longitude,
//             }}
//             title={startLocation.name}
//             icon={getIcon()}
//           />
//         )}
//         {destinationLocation && (
//           <Marker
//             coordinate={{
//               latitude: destinationLocation.geocodes.main.latitude,
//               longitude: destinationLocation.geocodes.main.longitude,
//             }}
//             title={destinationLocation.name}
//           />
//         )}
//         {startLocation && destinationLocation && route && (
//           <Polyline
//             coordinates={decodePolyline(route)}
//             strokeColor="#000" // black
//             strokeWidth={2}
//           />
//         )}
//       </MapView>
//       {!startLocation || !destinationLocation ? (
//         <View style={styles.directionBtn}>
//           <TouchableOpacity onPress={() => router.push("booking")}>
//             <FontAwesome5 name="directions" size={38} />
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <>
//           <View style={styles.cancelBtn}>
//             <TouchableOpacity onPress={resetMarkers}>
//               <MaterialIcons name="cancel" size={38} />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.distance}>
//             <Text style={{ fontSize: 15, fontWeight: 700 }}>
//               Distance: {(distance / 1000).toFixed(2)} KM
//             </Text>
//             <Text style={{ fontSize: 15, fontWeight: 700 }}>
//               Total Price: {price} RS
//             </Text>
//           </View>
//         </>
//       )}
//     </SafeAreaView>
//   );
// };

// export default Pickup;

// const styles = StyleSheet.create({
//   loading: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   container: {
//     flex: 1,
//   },
//   map: {
//     width: "100%",
//     height: "100%",
//   },
//   directionBtn: {
//     position: "absolute",
//     zIndex: 99999,
//     right: 20,
//     bottom: 20,
//     backgroundColor: "white",
//     padding: 10,
//     borderRadius: 10,
//     elevation: 4,
//     shadowColor: "#000",
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     shadowOffset: { height: 2, width: 0 },
//   },
//   cancelBtn: {
//     position: "absolute",
//     zIndex: 99999,
//     right: 10,
//     bottom: 50,
//     backgroundColor: "white",
//     padding: 10,
//     borderRadius: 10,
//     elevation: 4,
//     shadowColor: "#000",
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     shadowOffset: { height: 2, width: 0 },
//   },
//   distance: {
//     position: "absolute",
//     zIndex: 99999,
//     bottom: 30,
//     left: 10,
//     backgroundColor: "white",
//     padding: 20,
//     borderRadius: 10,
//     elevation: 4,
//     shadowColor: "#000",
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     shadowOffset: { height: 2, width: 0 },
//     alignItems: "center",
//   },
// });
