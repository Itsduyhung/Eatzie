import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

type Notification = {
  id: string;
  name: string;
  avatar: string;
  time: string;
  content: string;
  unread: boolean;
};

const notifications: Notification[] = [
  {
    id: '1',
    name: 'Mixue',
    avatar: require('../../assets/images/mixue-logo_brandlogos.net_wijie.png'),
    time: '17:06',
    content: 'Đơn hàng của bạn đã giao thành công. Cảm ơn bạn đã đặt Mixue!',
    unread: false,
  },
  {
    id: '2',
    name: 'KFC',
    avatar: 'https://1000logos.net/wp-content/uploads/2017/03/KFC-Logo.png',
    time: '16:45',
    content: 'Nhập mã KFCDEAL để nhận ngay ưu đãi 30% cho đơn hàng hôm nay!',
    unread: false,
  },
  {
    id: '3',
    name: 'Hight Land',
    avatar: require('../../assets/images/highlands_coffee-logo.png'),
    time: '15:20',
    content: 'Bạn vừa nhận được mã giảm giá 20k cho mọi thức uống tại Highlands Coffee.',
    unread: false,
  },
  {
    id: '4',
    name: 'Lotteria',
    avatar: require('../../assets/images/lotteria-brandlogo.net.png'),
    time: '14:10',
    content: 'Đơn hàng Lotteria của bạn đã được xác nhận và đang chuẩn bị giao.',
    unread: false,
  },
  {
    id: '5',
    name: 'StarBuck',
    avatar: require('../../assets/images/starbucks_1992ΓÇô2011-logo_brandlogos.net_mrr9i.png'),
    time: '13:30',
    content: 'StarBuck tặng bạn mã FREESHIP cho đơn hàng đầu tiên trong tuần này!',
    unread: true,
  },
];

export default function NotificationScreen() {
  const [tab, setTab] = useState('all');

  const renderItem = ({ item }: { item: Notification }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          {item.unread && <View style={styles.dot} />}
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.content}>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={{ marginRight: 16 }}>
            <Feather name="settings" size={22} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="options-outline" size={22} color="#222" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabButton, tab === 'all' && styles.tabActive]}
          onPress={() => setTab('all')}
        >
          <Text style={[styles.tabText, tab === 'all' && styles.tabTextActive]}>Tất cả (10)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, tab === 'unread' && styles.tabActive]}
          onPress={() => setTab('unread')}
        >
          <Text style={[styles.tabText, tab === 'unread' && styles.tabTextActive]}>Chưa đọc(5)</Text>
        </TouchableOpacity>
      </View>
      {/* Notification List */}
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F2F4F7',
    borderRadius: 16,
    marginBottom: 20,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: '#5B5FEF',
  },
  tabText: {
    color: '#222',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1ED760',
    marginRight: 6,
  },
  time: {
    marginLeft: 'auto',
    color: '#888',
    fontSize: 13,
  },
  content: {
    color: '#444',
    fontSize: 14,
    marginRight: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 2,
    marginLeft: 60,
  },
});