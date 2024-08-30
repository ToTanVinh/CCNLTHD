import Styles from "./Styles";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AnimatedImage from "../Animation/Animated";
import { UIManager, Platform } from "react-native";
import axios from "axios";
import Swiper from "react-native-swiper";
import { useState } from "react";
import { useEffect } from "react";
import { FlatList } from "react-native";
const HomeDocTor = ({ navigation }) => {
  const [news, setNews] = useState();
  const [newsData, setNewsData] = useState([]);
  const banners = [
    require("../Image/animatedImage1.jpg"),
    require("../Image/animatedImage2.jpg"),
  ];
  console.log("banner", banners);

  return (
    <View style={Styles.container}>
      <View style={Styles.title}>
        <View style={Styles.titleDetail}>
          <View>
            <Text style={Styles.textTitle}>Doctor Home</Text>
          </View>
          <TouchableOpacity style={Styles.search}>
            <Icon name="search" size={20} color="#000"></Icon>
          </TouchableOpacity>
        </View>
      </View>
      <View style={Styles.animate}>
        {/* {Array.from({ length: numberOfImages }, (_, index) => {
            console.log("index", index);
            return <AnimatedImage key={index} delay={200} images={images1} />;
          })} */}
        <Swiper
          showsButtons={true}
          autoplay={true}
          autoplayTimeout={3}
          showsPagination={false}
        >
          {banners.map((banner, index) => {
            return <Image style={Styles.image} key={index} source={banner} />;
          })}
        </Swiper>
      </View>
      <View style={Styles.containerInfor}>
        <View style={Styles.infor}>
          <View style={Styles.iconSection}>
            <Icon name="calendar" size={40} color="#37aea8" />
            <Text>Danh sách lịch hẹn</Text>
          </View>
          <View style={Styles.iconSection}>
            <Icon name="phone" size={40} color="#37aea8" />
            <Text>Cuộc gọi</Text>
          </View>
          <View style={Styles.iconSection}>
            <Icon name="medkit" size={40} color="#37aea8" />
            <Text>Thuốc</Text>
          </View>
          <View style={Styles.iconSection}>
            <Icon name="syringe" size={40} color="#37aea8" />
            <Text>Tiêm</Text>
          </View>
          <View style={Styles.iconSection}>
            <Icon name="prescription-bottle-alt" size={40} color="#37aea8" />
            <Text>Đơn thuốc</Text>
          </View>
          <View style={Styles.iconSection}>
            <Icon name="file-invoice-dollar" size={40} color="#37aea8" />
            <Text>Hóa Đơn</Text>
          </View>
        </View>
      </View>
      <View style={Styles.news}>
        {newsData.map((item, index) => {
          return (
            <View key={index} style={Styles.newsItem}>
              <Text>{item.title}</Text>
              <Text>{item.description}</Text>
            </View>
          );
        })}
      </View>
      <View style={Styles.root}></View>
    </View>
  );
};
export default HomeDocTor;
