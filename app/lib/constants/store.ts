import { Home, Search, Heart, User } from 'lucide-react'

export const navLinks = [
  {
    path: '/',
    icon: Home,
    label: 'Home',
  },
  {
    path: '/search',
    icon: Search,
    label: 'Discover',
  },
  {
    path: '/saved',
    icon: Heart,
    label: 'Favourites',
  },
  {
    path: '/account',
    icon: User,
    label: 'Account',
  },
]
