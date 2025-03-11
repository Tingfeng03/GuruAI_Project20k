import React, { useState, useContext } from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    Platform
} from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TripContext } from '../../Provider/TripContext';
import { useRouter } from 'expo-router';

// Web-friendly date picker using a native HTML input
const WebDatePicker = ({
    date,
    onChange,
    minimumDate
}: {
    date: Date;
    onChange: (event: any, selectedDate?: Date) => void;
    minimumDate?: Date;
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Mimic the onChange signature by passing an empty event
        onChange({}, new Date(e.target.value));
    };

    return (
        <input
            type="date"
            value={date.toISOString().split("T")[0]}
            min={minimumDate ? minimumDate.toISOString().split("T")[0] : undefined}
            onChange={handleChange}
            style={styles.webInput}
        />
    );
};

export default function SelectDateScreen() {
    const router = useRouter();
    const { setTripData } = useContext(TripContext);

    // Date states (using Date objects)
    const [checkIn, setCheckIn] = useState(new Date());
    const [checkOut, setCheckOut] = useState(
        new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    );

    // Controls to show the native pickers (for mobile)
    const [showCheckInPicker, setShowCheckInPicker] = useState(false);
    const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

    // Format a date to a readable string (local format)
    const formatDate = (date: Date) => date.toLocaleDateString();

    // Handlers for date change
    const onChangeCheckIn = (event: any, selectedDate?: Date) => {
        if (Platform.OS !== 'web') setShowCheckInPicker(false);
        if (selectedDate) {
            setCheckIn(selectedDate);
            // Ensure check-out is at least one day after check-in
            if (checkOut < selectedDate) {
                setCheckOut(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
            }
        }
    };

    const onChangeCheckOut = (event: any, selectedDate?: Date) => {
        if (Platform.OS !== 'web') setShowCheckOutPicker(false);
        if (selectedDate) {
            if (selectedDate < checkIn) {
                alert("Check-out date cannot be before check-in date");
            } else {
                setCheckOut(selectedDate);
            }
        }
    };

    // "Done" button handler: update provider and navigate back
    const onDone = () => {
        // Store dates as ISO strings in the provider
        setTripData(
            {
            checkIn: checkIn.toISOString(),
            checkOut: checkOut.toISOString(),
        });
        router.push("/(tabs)/searchPage");
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Button
                            mode="outlined"
                            onPress={() =>
                                Platform.OS === 'web'
                                    ? null
                                    : setShowCheckInPicker(true)
                            }
                            style={styles.dateButton}
                        >
                            {`Check-in: ${formatDate(checkIn)}`}
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() =>
                                Platform.OS === 'web'
                                    ? null
                                    : setShowCheckOutPicker(true)
                            }
                            style={[styles.dateButton, { marginTop: 12 }]}
                        >
                            {`Check-out: ${formatDate(checkOut)}`}
                        </Button>
                    </Card.Content>
                </Card>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        Your stay is from {formatDate(checkIn)} to {formatDate(checkOut)}.
                    </Text>
                </View>
                {/* <Button mode="contained" onPress={onDone} style={styles.doneButton}>
          Done
        </Button> */}
            </View>

            {/* Web version: always show date inputs */}
            {Platform.OS === 'web' && (
                <View style={styles.webPickerContainer}>
                    <Text style={styles.label}>Select Check-in Date</Text>
                    <WebDatePicker
                        date={checkIn}
                        onChange={onChangeCheckIn}
                        minimumDate={new Date()}
                    />
                    <Text style={[styles.label, { marginTop: 12 }]}>
                        Select Check-out Date
                    </Text>
                    <WebDatePicker
                        date={checkOut}
                        onChange={onChangeCheckOut}
                        minimumDate={checkIn}
                    />
                    <Button mode="contained" onPress={onDone} style={styles.doneButton}>
                        Done
                    </Button>
                </View>
            )}

            {/* Mobile DateTimePicker for Check-in */}
            {Platform.OS !== 'web' && showCheckInPicker && (
                <DateTimePicker
                    testID="checkInDatePicker"
                    value={checkIn}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={onChangeCheckIn}
                />
            )}

            {/* Mobile DateTimePicker for Check-out */}
            {Platform.OS !== 'web' && showCheckOutPicker && (
                <DateTimePicker
                    testID="checkOutDatePicker"
                    value={checkOut}
                    mode="date"
                    display="default"
                    minimumDate={checkIn}
                    onChange={onChangeCheckOut}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        borderRadius: 8,
        marginBottom: 16,
    },
    dateButton: {
        paddingVertical: 12,
    },
    infoContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    infoText: {
        fontSize: 14,
        textAlign: 'center',
    },
    webPickerContainer: {
        padding: 16,
        margin: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    webInput: {
        fontSize: 16,
        padding: 8,
        borderWidth: 1,
        borderRadius: 4,
    },
    label: {
        fontSize: 14,
        marginBottom: 4,
    },
    doneButton: {
        marginTop: 16,
    },
});
