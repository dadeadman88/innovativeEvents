import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import { SCREEN_WIDTH } from "@/utils/constants";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { useState } from "react";
import { Calendar } from "react-native-calendars";
import { moderateScale } from "react-native-size-matters";
import { Text, TouchableOpacity, View } from "react-native-ui-lib";

const TIME_SLOTS = [
    { id: "1", time: "08:00", active: false },
    { id: "2", time: "09:00", active: true },
    { id: "3", time: "10:00", active: false },
    { id: "4", time: "11:00", active: false },
    { id: "5", time: "12:00", active: false },
    { id: "6", time: "13:00", active: false },
];

const SelectDate = () => {
    const [selectedTime, setSelectedTime] = useState("09:00");
    const [selectedDate, setSelectedDate] = useState("2025-12-25");

    return (
        <View bg-white flex>
            <Container appBar appBarTitle="Select Date">
                {/* Calendar Section */}
                <View marginT-20>
                    <Calendar
                        current={selectedDate}
                        onDayPress={(day: { dateString: React.SetStateAction<string>; }) => {
                            setSelectedDate(day.dateString);
                        }}
                        theme={{
                            backgroundColor: theme.color.white,
                            calendarBackground: theme.color.white,
                            textSectionTitleColor: theme.color.gray,
                            arrowColor: theme.color.primary,
                            monthTextColor: theme.color.black,
                            indicatorColor: theme.color.primary,
                            textDayFontFamily: theme.font.regular,
                            textMonthFontFamily: theme.font.semibold,
                            textDayHeaderFontFamily: theme.font.regular,
                            textDayFontSize: moderateScale(14),
                            textMonthFontSize: moderateScale(16),
                            textDayHeaderFontSize: moderateScale(14),
                        }}
                        markedDates={{
                            [selectedDate]: { selected: true, disableTouchEvent: true, selectedColor: theme.color.primary }
                        }}
                    />
                </View>

                {/* Time Slots Section */}
                <View marginT-30>
                    <Text black semibold regularSize marginB-15>
                        Time
                    </Text>
                    <View row center style={{ flexWrap: 'wrap' }}>
                        {TIME_SLOTS.map((slot) => {
                            const isSelected = selectedTime === slot.time;
                            return (
                                <TouchableOpacity
                                    key={slot.id}
                                    marginR-10
                                    marginB-10
                                    center
                                    paddingV-17
                                    br30
                                    backgroundColor={isSelected ? theme.color.primary : theme.color.white}
                                    style={{
                                        width: SCREEN_WIDTH * 0.41,
                                        borderWidth: isSelected ? 0 : 1,
                                        borderColor: theme.color.inputBorder,
                                    }}
                                    onPress={() => setSelectedTime(slot.time)}
                                >
                                    <Text
                                        regular
                                        small
                                        style={{ color: isSelected ? theme.color.white : theme.color.black }}
                                    >
                                        {slot.time}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>


            </Container>
            {/* Footer Summary Card */}
            <View
                bg-white
                padding-25
                shadowColor="#000"
                shadowOffset={{ width: 0, height: -3 }}
                shadowOpacity={0.1}
                shadowRadius={5}
                elevation={5}
                borderTopLeftRadius={moderateScale(30)}
                borderTopRightRadius={moderateScale(30)}
            >
                <View row centerV marginB-20 br50 style={{ borderWidth: 1, borderColor: theme.color.inputBorder }}>
                    <View flex marginR-10 padding-15 >
                        <View row centerV marginB-5>
                            <Icon vector="Ionicons" name="calendar-outline" size={16} color={theme.color.gray} />
                            <Text gray regular extraSmall marginL-5>Date</Text>
                        </View>
                        <Text black semibold small>{selectedDate}</Text>
                    </View>
                    <View backgroundColor={theme.color.inputBorder} width={1} height={"80%"} />
                    <View flex marginL-10 padding-15>
                        <View row centerV marginB-5>
                            <Icon vector="Ionicons" name="time-outline" size={16} color={theme.color.gray} />
                            <Text gray regular extraSmall marginL-5>Time</Text>
                        </View>
                        <Text black semibold small>{selectedTime} AM</Text>
                    </View>
                </View>

                <CustomButton
                    label="Continue"
                    onPress={() => router.back()}
                />
            </View>
        </View>
    );
};

export default SelectDate;
