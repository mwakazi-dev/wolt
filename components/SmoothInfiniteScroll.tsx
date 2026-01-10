import React, { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const iconDataSets = {
  set1: [
    { emoji: "🍕", color: "#FFE5CC" },
    { emoji: "🍔", color: "#F4D03F" },
    { emoji: "🍟", color: "#F8D7DA" },
    { emoji: "🌮", color: "#D5EDDA" },
    { emoji: "🍗", color: "#FADBD8" },
  ],
  set2: [
    { emoji: "🎮", color: "#D1ECF1" },
    { emoji: "🎧", color: "#E2E3E5" },
    { emoji: "☕", color: "#F4D03F" },
    { emoji: "🍿", color: "#FFE5CC" },
    { emoji: "🥤", color: "#F8D7DA" },
  ],
  set3: [
    { emoji: "🍰", color: "#FADBD8" },
    { emoji: "🍦", color: "#D1ECF1" },
    { emoji: "🍪", color: "#FFE5CC" },
    { emoji: "🎲", color: "#D5EDDA" },
    { emoji: "🕹️", color: "#E2E3E5" },
  ],
};

const ITEM_HEIGHT = 160;
const SCROLL_SPEED = 20; // pixels per second
const MARGIN_VERTICAL = 5;
const GAP = MARGIN_VERTICAL * 2; // gap between items from styles
const PADDING_VERTICAL = 20;

interface SmoothInfiniteScrollProps {
  scrollDirection?: "up" | "down";
  iconSet?: "set1" | "set2" | "set3";
}

const SmoothInfiniteScroll = ({
  scrollDirection = "down",
  iconSet = "set1",
}: SmoothInfiniteScrollProps) => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);

  const iconData = iconDataSets[iconSet];
  const items = [...iconData, ...iconData]; // Duplicate for seamless scroll
  const wrapPoint = iconData.length * (ITEM_HEIGHT + 2 * MARGIN_VERTICAL);

  useEffect(() => {
    // Calculate duration based on SCROLL_SPEED and total distance
    const duration = (wrapPoint / SCROLL_SPEED) * 1000; // convert to milliseconds

    if (scrollDirection === "down") {
      // Start at 0, animate to wrapPoint
      scrollY.value = 0;
      scrollY.value = withRepeat(
        withTiming(wrapPoint, { duration }),
        -1, // infinite repeats
        false // don't reverse
      );
    } else {
      // Start at 0, animate to wrapPoint (for up direction, pos is reversed)
      scrollY.value = 0;
      scrollY.value = withRepeat(
        withTiming(wrapPoint, { duration }),
        -1, // infinite repeats
        false // don't reverse
      );
    }
  }, [scrollDirection, wrapPoint]);

  useAnimatedReaction(
    () => scrollY.value,
    (y) => {
      let pos;
      if (scrollDirection === "down") {
        pos = y % wrapPoint;
      } else {
        pos = wrapPoint - (y % wrapPoint);
      }
      scrollTo(scrollRef, 0, pos, false);
    }
  );

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
    >
      {items.map((item, index) => (
        <View
          key={index}
          style={[styles.iconContainer, { backgroundColor: item.color }]}
        >
          <Text style={{ fontSize: 40 }}>{item.emoji}</Text>
        </View>
      ))}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
  contentContainer: {
    paddingVertical: PADDING_VERTICAL,
  },
  iconContainer: {
    width: 160,
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginHorizontal: 5,
    marginVertical: MARGIN_VERTICAL,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});

export default SmoothInfiniteScroll;
