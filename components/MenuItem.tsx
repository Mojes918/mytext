import { Feather, FontAwesome6, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";

const menuItems = [
    {
      label: 'Private',
      IconComponent: MaterialCommunityIcons,
      iconName: 'shield-account-variant-outline',
      onSelect: () => alert('Private selected'),
    },
    {
      label: 'Payments',
      IconComponent: MaterialIcons,
      iconName: 'credit-card',
      onSelect: () => alert('Payments selected'),
    },
    {
      label: 'Linked Devices',
      IconComponent: FontAwesome6,
      iconName: 'link',
      onSelect: () => alert('Linked Devices selected'),
    },
    {
      label: 'Star Messages',
      IconComponent: MaterialCommunityIcons,
      iconName: 'star-check-outline',
      onSelect: () => alert('Star Messages selected'),
    },
    {
      label: 'Invite Friends',
      IconComponent: Feather,
      iconName: 'users',
      onSelect: () => alert('Invite Friends selected'),
    },
    {
      label: 'Settings',
      IconComponent: SimpleLineIcons,
      iconName: 'settings',
      onSelect: () => alert('Settings selected'),
    },
  ];

  export default menuItems;