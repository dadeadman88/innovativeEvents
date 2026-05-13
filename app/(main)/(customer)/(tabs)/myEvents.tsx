import Container from "@/components/Container";
import Icon from "@/components/Icon";
import { CustomerEventListItem, EventActions } from "@/redux/actions/EventActions";
import { AppDispatch, RootState } from "@/redux/store";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { ActivityIndicator } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Text, TouchableOpacity, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";

const MyEvents = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((s: RootState) => s.auth.user?.id);
  const [events, setEvents] = React.useState<CustomerEventListItem[]>([]);
  const [loadingList, setLoadingList] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingList(true);
      if (!userId) {
        if (!cancelled) {
          setEvents([]);
          setLoadingList(false);
        }
        return;
      }
      try {
        const list = await dispatch(EventActions.FetchMyEvents({ input_id: userId })).unwrap();
        if (!cancelled) setEvents(list);
      } catch {
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch, userId]);

  return (
    <Container
      appBar={false}
      contentBackgroundColor="#000"
      containerProps={{
        style: {
          paddingTop: 16,
          paddingHorizontal: "6%",
          paddingBottom: "4%",
        },
      }}
      scrollProps={{ showsVerticalScrollIndicator: false }}
    >
      <View row centerV>
        <View width={moderateScale(44)} />
        <View flex center>
          <Text semibold regularSize style={{ color: "#fff" }}>
            My Events
          </Text>
        </View>
        <View width={moderateScale(44)} />
      </View>

      <View marginT-16>
        {loadingList ? (
          <View center paddingV-40>
            <ActivityIndicator color={theme.color.primary} />
          </View>
        ) : events.length === 0 ? (
          <View center paddingV-32>
            <Text regular small style={{ color: "#818898", textAlign: "center" }}>
              No events yet.
            </Text>
          </View>
        ) : (
          events.map((event) => (
            <TouchableOpacity
              key={event.id}
              marginB-16
              style={{
                backgroundColor: "#1E1E1E",
                borderRadius: moderateScale(16),
                overflow: "hidden",
              }}
              onPress={() =>
                router.push({
                  pathname: "/eventDetail",
                  params: { event: encodeURIComponent(JSON.stringify(event)) },
                })
              }
            >
              <View padding-16>
                <View row spread>
                  <Text
                    bold
                    medium
                    numberOfLines={2}
                    style={{ color: "#fff", flex: 1, paddingRight: moderateScale(10) }}
                  >
                    {event.title}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: moderateScale(10),
                      paddingVertical: moderateScale(4),
                      borderRadius: moderateScale(20),
                      backgroundColor: event.status === "Completed" ? "#22C55E" : "#8B7FC7",
                      alignSelf: "flex-start",
                    }}
                  >
                    <Text semibold extraSmall style={{ color: "#fff" }}>
                      {event.status}
                    </Text>
                  </View>
                </View>
                <View row centerV marginT-8>
                  <Icon vector="Ionicons" name="location" size={16} color={theme.color.primary} />
                  <Text small regular style={{ color: "#818898", marginLeft: 6 }}>
                    {event.address}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </Container>
  );
};

export default MyEvents;
