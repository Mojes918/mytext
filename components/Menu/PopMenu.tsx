import { Entypo } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

interface MenuItem {
  label: string;
  IconComponent: React.ComponentType<any>;
  iconName: string;
  onSelect: () => void;
}

interface PopMenuProps {
  menuItems: MenuItem[];
}

const PopMenu: React.FC<PopMenuProps> = ({ menuItems }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const backgroundColor = isDarkMode ? '#333' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const optionBackground = isDarkMode ? '#333' : '#fff';
  const separatorColor = isDarkMode ? '#555' : '#ddd';

  return (
    <View style={styles.container}>
      <Menu>
        <MenuTrigger>
          <Entypo
            name="dots-three-vertical"
            size={20}
            color={textColor}
            style={styles.triggerIcon}
          />
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionsContainer: {
              marginTop: 30,
              width: 180,
              padding: 0,
              borderRadius: 10,
              backgroundColor,
              elevation: 5, // Shadow effect
            },
          }}
        >
          {menuItems.map((item, index) => (
            <MenuOption onSelect={item.onSelect} key={item.label + index}>
              <View
                style={[
                  styles.option,
                  {
                    backgroundColor: optionBackground,
                    borderBottomColor: separatorColor, // Subtle separator between options
                  },
                ]}
              >
                <item.IconComponent name={item.iconName} size={20} color={textColor} />
                <Text style={[styles.optionText, { color: textColor }]}>{item.label}</Text>
              </View>
            </MenuOption>
          ))}
        </MenuOptions>
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  triggerIcon: {
    padding: 2,
    marginRight: 0,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5, // Separator line
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default PopMenu;
