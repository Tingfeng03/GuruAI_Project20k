// import React from "react";
// import {View, StyleSheet} from "react-native";
// import {Card, Text} from "react-native-paper";
// import { ScrollView } from "react-native";
// import { useSelector, useDispatch } from "react-redux";
// // import { navigateToTripPlan } from "./actions/navigationActions";

// interface ActivityContent {
//     trip : {
//         specificNameOfLocation : string;
//         Address : string;
//         goingWhere : {
//             lat: number;
//             long: number;
//         };
//         duration : {
//             startTime: string; // Example value can be "8:30"
//             endTime: string;
//         };
//         WhatToDo : string;
//     }
// }

// interface TripFlow {
//     datetime : Date;
//     activity: ActivityContent[];
// }

// const dummyTripFlow: TripFlow = {
//     datetime: new Date("2023-03-15T08:30:00"),
//     activity: [
//       {
//         trip: {
//           specificNameOfLocation: "Central Park",
//           Address: "New York, NY, USA",
//           goingWhere: {
//             lat: 40.785091,
//             long: -73.968285,
//           },
//           duration: {
//             startTime: "08:30",
//             endTime: "10:00",
//           },
//           WhatToDo: "Enjoy a relaxing walk and picnic.",
//         },
//       },
//       {
//         trip: {
//           specificNameOfLocation: "Metropolitan Museum of Art",
//           Address: "1000 5th Ave, New York, NY, USA",
//           goingWhere: {
//             lat: 40.779437,
//             long: -73.963244,
//           },
//           duration: {
//             startTime: "10:30",
//             endTime: "12:00",
//           },
//           WhatToDo: "Explore art exhibits and collections.",
//         },
//       },
//     ],
//   };

// const getMapImageURL = (lat: number, long: number) => {
//     return `https://static-maps.yandex.ru/1.x/?ll=${long},${lat}&z=15&l=map&size=600,300`;
// };

// const TripFlow: React.FC = () => {
//     const [data, setdata] = React.useState<TripFlow[]>([]);
//     // Retrieve the selected tripSerialNo from Redux instead of route params
//     const { tripSerialNo } = useSelector((state: any) => state.navigation);
//     const dispatch = useDispatch();

<<<<<<< Updated upstream
//     React.useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // TODO: replace with actual backend API
//                 const response = await fetch(`https://${process.env.EXPO_PUBLIC_LOCAL_FRONTEND_IP}:8080/api/TripFlow/`);
//                 const data: TripFlow[] = await response.json();
//                 setdata([dummyTripFlow]);
//             } catch (error) {
//                 console.error("Error fetching data: ", error);
//             } 
//         };
//         fetchData();
//     }, [tripSerialNo]); 
=======
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // TODO: replace with actual backend API
                // const response = await fetch(`https://${process.env.EXPO_PUBLIC_LOCAL_FRONTEND_IP}:8080/api/TripFlow/${serialNo}`);
                // const data: TripFlow[] = await response.json();
                setdata([dummyTripFlow]);
            } catch (error) {
                console.error("Error fetching data: ", error);
            } 
        };
        fetchData();
    }, [tripSerialNo]); 
>>>>>>> Stashed changes

//     return (
//         // consider using FlatList if more than 20 items
//         <View style={styles.container}>
//             <Text style={styles.title1}>Your Plan Trip</Text>
//             <ScrollView contentContainerStyle={styles.scrollContent}>
//                 {data.map((tripflow: TripFlow, index) => 
//                     tripflow.activity.map((card: ActivityContent, cardIndex) => {
//                         const trip = card.trip;
//                         return (
//                             <Card key={`${index}-${cardIndex}`} style={styles.card}>
//                                 <Card.Cover source={{uri: getMapImageURL(trip.goingWhere.lat, trip.goingWhere.long)}} />
//                                 <Card.Content>
//                                     <Text style={styles.title}>{trip.specificNameOfLocation}</Text>
//                                     <Text style={styles.address}>{trip.Address}</Text>
//                                     <Text style={styles.details}>{trip.WhatToDo}</Text>
//                                     <Text style={styles.datetime}>{new Date(tripflow.datetime).toLocaleString()}</Text>
//                                     <Text style={styles.datetime}>{trip.duration.startTime}-{trip.duration.endTime}</Text>
//                                 </Card.Content>
//                             </Card>
//                         )
//                     })    
//                 )}
//             </ScrollView>
//             {/* Optionally add a back button */}
//             <Text style={{ color: "blue", margin: 15 }} onPress={() => dispatch(navigateToTripPlan())}>
//                 Back to Trip Plans
//             </Text>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#f8f9fa",
//     },
//     scrollContent: {
//         padding: 16,
//     },
//     card: {
//         marginBottom: 16,
//         borderRadius: 8,
//         overflow: "hidden",
//     },
//     title1: {
//         fontSize: 18,
//         fontWeight: "bold",
//         margin: 15,
//     },
//     title: {
//         fontSize: 18,
//         fontWeight: "bold",
//         marginTop: 8,
//     },
//     address: {
//         fontSize: 14,
//         color: "gray",
//         marginBottom: 4,
//     },
//     details: {
//         fontSize: 16,
//         marginBottom: 4,
//     },
//     datetime: {
//         fontSize: 12,
//         color: "#555",
//     },
// });

// export default TripFlow;
