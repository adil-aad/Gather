import logo from './image.png'
import { 
  Home, 
  MessageCircle, 
  Search, 
  UserIcon, 
  Users,
  Bell,
  Bookmark,
  Settings
} from 'lucide-react'
export const assets = {
    logo
}

export const menuItemsData = [
    { to: '/', label: 'Home', Icon: Home },
    { to: '/messages', label: 'Messages', Icon: MessageCircle },
    { to: '/connections', label: 'Connections', Icon: Users },
    { to: '/discover', label: 'Discover', Icon: Search },
    { to: '/profile', label: 'Profile', Icon: UserIcon },
];

