import AntDesign from '@expo/vector-icons/AntDesign'
import Entypo from '@expo/vector-icons/Entypo'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import Feather from '@expo/vector-icons/Feather'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import Fontisto from '@expo/vector-icons/Fontisto'
import Foundation from '@expo/vector-icons/Foundation'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Octicons from '@expo/vector-icons/Octicons'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import Zocial from '@expo/vector-icons/Zocial'
import * as React from 'react'
import { StyleProp, TextStyle } from 'react-native'

export type icon_vector =
  | 'FontAwesome'
  | 'Fontisto'
  | 'MaterialCommunityIcons'
  | 'AntDesign'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'FontAwesome6'
  | 'Entypo'
  | 'EvilIcons'
  | 'Feather'
  | 'MaterialIcons'
  | 'SimpleLineIcons'
  | 'Zocial'
  | 'Octicons'
  | 'Ionicons'
  | 'Foundation'
  | 'Fontisto'

interface IconProps {
  vector?: icon_vector
  name?: string;
  size?: number
  color?: string
  style?: StyleProp<TextStyle>
  onPress?: () => void
  ref?: any
}

// {...props as IconProps}
const Icon = React.forwardRef(
  (
    props: IconProps = {
      vector: 'FontAwesome',
      name: "email",
      color: 'blue',
      size: 20,
    },
    ref,
  ) => {
    Icon.displayName = 'VectorIcon'
    const { vector, name, size, color, style, onPress, ...rest } = props

    switch (vector) {
      case 'FontAwesome': {
        return <FontAwesome ref={ref} name={name as any} size={size} color={color} style={style} onPress={onPress} {...rest} />
      }
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons ref={ref} name={name as any} size={size} color={color} style={style} onPress={onPress} {...rest} />
      case 'AntDesign':
        return <AntDesign ref={ref} name={name as any} size={size} color={color} style={style} onPress={onPress} {...rest} />
      case 'Entypo':
        return <Entypo ref={ref} name={name as any} size={size} color={color} style={style} onPress={onPress} {...rest} />
      case 'EvilIcons':
        return <EvilIcons ref={ref} name={name as any} size={size} color={color} style={style} onPress={onPress} {...rest} />
      case 'Feather':
        return <Feather ref={ref} name={name as any} size={size} color={color} style={style} onPress={onPress} {...rest} />
      case 'FontAwesome5':
        return <FontAwesome5 ref={ref} name={name as any} size={size} color={color} style={style} onPress={onPress} {...rest} />
      case 'FontAwesome6':
        return <FontAwesome6 ref={ref} name={name as any} size={size} color={color} style={style} onPress={onPress} {...rest} />
      case 'Fontisto':
        return <Fontisto ref={ref} name={name as any} size={size} color={color} style={style} onPress={onPress} {...rest} />
      case 'Foundation':
        return <Foundation ref={ref} name={name as any} size={size} color={color} style={style} onPress={onPress} {...rest} />
      case 'Ionicons':
        return <Ionicons ref={ref} name={name as any} size={size} color={color} style={style} onPress={onPress} {...rest} />
      case 'MaterialIcons':
        return <MaterialIcons ref={ref} name={name as any} size={size} color={color} style={style} onPress={onPress} {...rest} />
      case 'Octicons':
        return <Octicons ref={ref} name={name as any} size={size} color={color} style={style} onPress={onPress} {...rest} />
      case 'SimpleLineIcons':
        return <SimpleLineIcons ref={ref} name={name as any} size={size} color={color} style={style} onPress={onPress} {...rest} />
      case 'Zocial':
        return <Zocial ref={ref} name={name as any} size={size} color={color} style={style} onPress={onPress} {...rest} />
    }

    return <FontAwesome ref={ref} name={name as any} size={size} color={color} style={style} onPress={onPress} {...rest} />
  },
)

export default React.memo(Icon)