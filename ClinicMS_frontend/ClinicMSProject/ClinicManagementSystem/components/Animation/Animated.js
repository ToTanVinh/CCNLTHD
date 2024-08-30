import { useRef, useEffect, useState } from "react";
import { Animated } from "react-native";
import { Image, View } from "react-native";
import { StyleSheet } from "react-native";
import Styles from "../Animation/Styles";
import { Dimensions } from "react-native";
const AnimatedImage = ({ delay, images }) => {
  const translateX = useRef(new Animated.Value(-1000)).current;
  const [currentImage, setCurrentImage] = useState(0);
  useEffect(() => {
    const startAnimation = () => {
      Animated.timing(translateX, {
        toValue: 1,
        delay,
        duration: 2000,
        useNativeDriver: false,
      }).start(() => {
        startAnimation();
      });
    };
    startAnimation();
  }, [translateX, delay]);
  return (
    <Animated.View
      style={[
        { transform: [{ translateX }] },
        Styles.imageContainer,
        { overflow: "hidden" },
      ]}
    >
      {images.map((image, index) => (
        <Image key={index} source={image} style={Styles.image} />
      ))}
    </Animated.View>
  );
};
export default AnimatedImage;
