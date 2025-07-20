import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { CustomButton } from '@/components/ui/CustomButton';
import { HeaderSetting } from '@/components/home/HeaderSetting';
import { ScrollScreenLayout } from '@/components/layout/ScrollScreenLayout';

const fakeUser = {
  avatar: require('@/assets/images/z6661346213660_5f591cb732a04b3061b0ccff731bcfd9.jpg'),
  name: 'Phan Duy Hùng',
  email: 'dziihunsaypaii@gmail.com',
  phone: '0706220209',
  joined: '07/06/2025',
};

const UserInfo = () => {
  return (
    <ScrollScreenLayout
      header={<HeaderSetting nameTitle="Thông tin người dùng" />}
      headerBackgroundColor="white"
    >
      <YStack backgroundColor="#F5F5F5" flex={1} padding="$4">
        {/* Avatar và tên */}
        <YStack backgroundColor="white" borderRadius="$4" padding="$4" marginBottom="$4" alignItems="center">
          <Image
            source={fakeUser.avatar}
            style={styles.avatar}
            resizeMode="cover"
          />
          <Text style={styles.name}>{fakeUser.name}</Text>
        </YStack>

        {/* Thông tin chi tiết */}
        <YStack backgroundColor="white" borderRadius="$4" padding="$4" marginBottom="$4">
          <View style={styles.infoBox}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{fakeUser.email}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Số điện thoại:</Text>
            <Text style={styles.value}>{fakeUser.phone}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Tham gia:</Text>
            <Text style={styles.value}>{fakeUser.joined}</Text>
          </View>
        </YStack>

        {/* Nút chỉnh sửa */}
        <CustomButton
          backgroundColor="#8B5CF6"
          onPress={() => {
            // Có thể thêm logic chỉnh sửa sau
            console.log("Chỉnh sửa thông tin người dùng");
          }}
          paddingVertical="$3"
          marginTop="$4"
        >
          <Text color="white" fontSize="$5" fontWeight="bold">
            Chỉnh sửa thông tin
          </Text>
        </CustomButton>
      </YStack>
    </ScrollScreenLayout>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    marginTop: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#222',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  label: {
    fontWeight: '600',
    color: '#666',
    width: 120,
    fontSize: 16,
  },
  value: {
    color: '#222',
    fontSize: 16,
    fontWeight: '400',
    flex: 1,
  },
});

export default UserInfo; 