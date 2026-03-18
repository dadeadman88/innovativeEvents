import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import Input from "@/components/Input";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { ScrollView } from "react-native";
import { verticalScale } from "react-native-size-matters";
import { Text, TouchableOpacity, View } from "react-native-ui-lib";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const YourLocation = () => {
    const [address, setAddress] = React.useState("2972 Westheimer Rd. Santa Ana, Illinois 85486");
    const [selectedDays, setSelectedDays] = React.useState<string[]>(["SUN", "MON", "TUE"]);
    const [fromTime, setFromTime] = React.useState("");
    const [toTime, setToTime] = React.useState("");

    const toggleDay = (day: string) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleDone = () => {
        router.push({
            pathname: "/(main)/(provider)/(tabs)/home",
        });
    };

    return (
        <Container appBar appBarTitle="Your Locaton">
            {/* Map Placeholder */}
            <View
                marginT-20
                bg-inputBg
                br20
                height={verticalScale(200)}
                center
            >
                <Icon vector="Ionicons" name="location" size={40} color={theme.color.gray} />
                <Text gray regular small marginT-10>Map View</Text>
            </View>

            {/* Address Section */}
            <Input
                label="Address:"
                marginT-25
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your address"
            />

            {/* Availability Calendar Section */}
            <Text medium small gray marginT-25>
                Availability calendar:
            </Text>

            <View
                bg-inputBg
                br50
                marginT-15
                padding-20
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                    elevation: 3,
                    borderWidth: 1,
                    borderColor: "#F5F5F5"
                }}
            >
                {/* Time Section */}
                <Text medium small gray>Time</Text>
                <View row marginT-15 gap-15>
                    <TouchableOpacity
                        flex
                        row
                        centerV
                        bg-white
                        br40
                        paddingV-12
                        paddingH-15
                    >
                        <Icon vector="Ionicons" name="time-outline" size={20} color={theme.color.gray} />
                        <Text gray regular small marginL-10>From</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        flex
                        row
                        centerV
                        bg-white
                        br40
                        paddingV-12
                        paddingH-15
                    >
                        <Icon vector="Ionicons" name="time-outline" size={20} color={theme.color.gray} />
                        <Text gray regular small marginL-10>To</Text>
                    </TouchableOpacity>
                </View>

                {/* Select Day Section */}
                <Text medium small gray marginT-25>Select Day</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View row marginT-15 gap-8 >
                        {DAYS.map((day) => {
                            const isSelected = selectedDays.includes(day);
                            return (
                                <TouchableOpacity
                                    key={day}
                                    center
                                    paddingV-8
                                    paddingH-10
                                    br50
                                    onPress={() => toggleDay(day)}
                                    bg-white={!isSelected}
                                    bg-accent={isSelected}
                                >
                                    <Text
                                        color={isSelected ? theme.color.white : theme.color.gray}
                                        semibold
                                        extraSmall12
                                    >
                                        {day}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
            </View>

            {/* Done Button */}
            <View marginT-40 marginB-30>
                <CustomButton
                    label="Done"
                    onPress={handleDone}
                />
            </View>
        </Container>
    );
};

export default YourLocation;
