import Icon from "@/components/Icon";
import Input from "@/components/Input";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/utils/constants";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { FlatList, StatusBar } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Dialog, Image, Text, TouchableOpacity, View } from "react-native-ui-lib";

interface Location {
    id: string;
    name: string;
    address: string;
    distance: string;
}

const POPULAR_LOCATIONS: Location[] = [
    {
        id: "1",
        name: "Los Angeles",
        address: "California, United States",
        distance: "3.21 KM",
    },
    {
        id: "2",
        name: "San Francisco",
        address: "2118 Thornridge Cir. Syracuse...",
        distance: "2.24 KM",
    },
    {
        id: "3",
        name: "New York",
        address: "2118 Thornridge Cir. Syracuse...",
        distance: "2.84 KM",
    },
];

const LocationItem = ({ item, onPress }: { item: Location; onPress: () => void }) => (
    <TouchableOpacity
        row
        spread
        centerV
        paddingV-15
        onPress={onPress}
        style={{ borderBottomWidth: 1, borderColor: "#F0F0F0" }}
    >
        <View row flex>
            <Icon vector="Ionicons" name="location" size={24} color={theme.color.primary} />
            <View marginL-15 flex>
                <Text white semibold regularSize>{item.name}</Text>
                <Text gray regular small marginT-4 numberOfLines={1}>{item.address}</Text>
            </View>
        </View>
        <Text gray semibold small>{item.distance}</Text>
    </TouchableOpacity>
);

const ChooseLocation = () => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [searchResults, setSearchResults] = React.useState<Location[]>([]);
    const [isSearching, setIsSearching] = React.useState(false);
    const [locDialog, setLocDialog] = React.useState(false);

    // Simulated Google Places Autocomplete
    const handleSearch = React.useCallback((query: string) => {
        setSearchQuery(query);

        if (query.length > 2) {
            setIsSearching(true);
            // Simulate API delay
            setTimeout(() => {
                // Filter popular locations as mock search results
                const filtered = POPULAR_LOCATIONS.filter(
                    (loc) =>
                        loc.name.toLowerCase().includes(query.toLowerCase()) ||
                        loc.address.toLowerCase().includes(query.toLowerCase())
                );

                // Add some mock search results
                if (filtered.length === 0) {
                    setSearchResults([
                        {
                            id: "search_1",
                            name: query,
                            address: "Search result for " + query,
                            distance: "1.5 KM",
                        },
                    ]);
                } else {
                    setSearchResults(filtered);
                }
                setIsSearching(false);
            }, 300);
        } else {
            setSearchResults([]);
        }
    }, []);

    const handleSelectLocation = (location: Location) => {
        // Navigate back with selected location
        router.back();
    };

    const displayLocations = searchQuery.length > 2 ? searchResults : POPULAR_LOCATIONS;

    return (
        <View flex bg-white>
            <StatusBar barStyle="dark-content" />

            {/* Full Screen Map Placeholder */}
            <View flex bg-inputBg center>
                {/* Header */}
                <View
                    absT
                    row
                    spread
                    centerV
                    width={SCREEN_WIDTH}
                    paddingH-20
                >
                    <TouchableOpacity
                        bg-lightGray2
                        br100
                        padding-12
                        onPress={() => router.back()}
                        style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                        }}
                    >
                        <Icon vector="Ionicons" name="arrow-back" size={20} color={theme.color.black} />
                    </TouchableOpacity>

                    <Text black semibold regularSize>Choose your location</Text>
                    <View width={moderateScale(30)} />
                </View>
                <TouchableOpacity onPress={() => setLocDialog(true)}>
                    <Image
                        source={require("@/assets/images/locMarker.png")}
                        width={moderateScale(60)}
                        height={moderateScale(60)}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            {/* Bottom Sheet Dialog */}
            <Dialog
                visible={locDialog}
                onDismiss={() => setLocDialog(false)}
                width={SCREEN_WIDTH}
                height={SCREEN_HEIGHT * 0.5}
                bottom
                containerStyle={{
                    borderRadius: 0,
                    borderTopLeftRadius: moderateScale(25),
                    borderTopRightRadius: moderateScale(25),
                    backgroundColor: theme.color.white,
                }}
                ignoreBackgroundPress
            >
                <View flex paddingH-20 paddingT-20>
                    {/* Drag Handle */}
                    <View centerH marginB-25>
                        <View
                            width={moderateScale(40)}
                            height={moderateScale(4)}
                            br100
                            bg-inputBorder
                        />
                    </View>

                    {/* Search Bar */}
                    <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                        leadingAccessory={
                            <Icon vector="Feather" name="search" size={20} color={theme.color.lightGray} />
                        }
                    />

                    {/* Popular Location / Search Results */}
                    <Text black semibold regularSize marginT-20 marginB-10>
                        {searchQuery.length > 2 ? "Search Results" : "Popular Location"}
                    </Text>

                    <FlatList
                        data={displayLocations}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <LocationItem item={item} onPress={() => handleSelectLocation(item)} />
                        )}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            isSearching ? (
                                <Text gray regular small center marginT-20>Searching...</Text>
                            ) : (
                                <Text gray regular small center marginT-20>No locations found</Text>
                            )
                        }
                    />
                </View>
            </Dialog>
        </View>
    );
};

export default ChooseLocation;
