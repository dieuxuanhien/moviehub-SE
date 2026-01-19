'use client';
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/nextjs';
import { Logo } from '@/components/logo';
import { Button } from '@movie-hub/shacdn-ui/button';
import { 
  MenuIcon, 
  TicketPlus, 
  XIcon, 
  MapPin, 
  ChevronDown,
  Sparkles,
  TrendingUp,
  Calendar,
  Gift,
  PartyPopper,
  Tv,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { MagicSearch } from './magic-search';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@movie-hub/shacdn-ui/select';
import { Skeleton } from '@movie-hub/shacdn-ui/skeleton';

export interface CinemaSelector {
  id: string;
  name: string;
}
interface NavbarProps {
  cinemas: CinemaSelector[];
}
export const Navbar = ({ cinemas }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const [cinemaSelected, setCinemaSelected] = useState<string | undefined>();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectCinema = (cinemaId: string) => {
    setCinemaSelected(cinemaId);
    router.push(`/cinemas/${cinemaId}`);
  };

  const navLinks = [
    { 
      href: '/showtimes', 
      label: 'LỊCH CHIẾU',
      icon: Calendar,
      gradient: 'from-purple-400 to-pink-400'
    },
    { 
      href: '/promotions', 
      label: 'KHUYẾN MÃI',
      icon: Gift,
      gradient: 'from-pink-400 to-rose-400'
    },
    { 
      href: '/rent', 
      label: 'TỔ CHỨC SỰ KIỆN',
      icon: PartyPopper,
      gradient: 'from-blue-400 to-cyan-400'
    },
    { 
      href: '/services', 
      label: 'DỊCH VỤ GIẢI TRÍ KHÁC',
      icon: Tv,
      gradient: 'from-cyan-400 to-teal-400'
    },
    { 
      href: '/about', 
      label: 'GIỚI THIỆU',
      icon: Info,
      gradient: 'from-teal-400 to-green-400'
    },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-screen z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-black/98 backdrop-blur-xl shadow-lg shadow-purple-900/20' 
        : 'bg-gradient-to-b from-black/95 via-black/90 to-transparent backdrop-blur-md'
    }`}>
      {/* Animated glow line at top */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
      
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
        {/* Row 1: Logo, Search, Auth */}
        <div className="flex items-center justify-between h-20 gap-x-4">
          {/* Logo with glow effect */}
          <div className="flex-shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              <Logo />
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
            <div className="w-full relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <MagicSearch />
            </div>
          </div>

          {/* Auth Section with enhanced styling */}
          <div className="flex items-center gap-3">
            <ClerkLoading>
              <div className="relative">
                <Skeleton className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-spin" />
              </div>
            </ClerkLoading>

            <ClerkLoaded>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="relative px-6 py-2.5 h-11 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white rounded-full font-bold text-sm tracking-wider shadow-lg shadow-purple-900/50 hover:shadow-xl hover:shadow-purple-900/70 transition-all duration-300 border-none overflow-hidden group">
                    <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="relative z-10">LOGIN</span>
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </Button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: 'w-10 h-10 border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-300 ring-2 ring-purple-900/30',
                      },
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Action
                        label="Vé của tôi"
                        labelIcon={<TicketPlus size={16} />}
                        onClick={() => {
                          router.push('/my-booking');
                        }}
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </div>
              </SignedIn>
            </ClerkLoaded>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 transition-all duration-300 group"
            >
              <MenuIcon className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Row 2: Cinema Selector + Navigation Links - Desktop */}
        <div className="hidden lg:flex items-center justify-center gap-6 pb-4 border-t border-white/10 pt-3">
          {/* Cinema Selector with icon */}
          <Select value={cinemaSelected} onValueChange={handleSelectCinema}>
            <SelectTrigger className="w-[200px] h-11 text-white bg-gradient-to-r from-white/5 to-white/10 border border-white/20 rounded-xl px-4 hover:from-white/10 hover:to-white/15 hover:border-purple-500/50 transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-0 group backdrop-blur-sm flex-shrink-0">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <SelectValue placeholder="UIT Cinema" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-neutral-900/95 backdrop-blur-xl text-white border-purple-500/30 rounded-xl overflow-hidden shadow-2xl shadow-purple-900/50">
              {cinemas.map((cinema) => (
                <SelectItem
                  key={cinema.id}
                  value={cinema.id}
                  className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 focus:bg-gradient-to-r focus:from-purple-600/30 focus:to-pink-600/30 transition-all duration-200 py-3"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    {cinema.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative px-4 py-2.5 rounded-lg overflow-hidden"
                >
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Active state background */}
                  {isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20`} />
                  )}
                  
                  <div className="relative flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'} group-hover:text-white transition-colors duration-300`} />
                    <span className={`font-bold text-xs tracking-wide ${
                      isActive ? 'text-white' : 'text-gray-300'
                    } group-hover:text-white transition-all duration-300 whitespace-nowrap`}>
                      {item.label}
                    </span>
                  </div>
                  
                  {/* Animated underline */}
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${item.gradient} transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </div>

      {/* Mobile Menu Overlay - Enhanced */}
      <div
        className={`fixed inset-0 z-40 bg-gradient-to-br from-black via-purple-950/50 to-black backdrop-blur-2xl flex flex-col transition-all duration-500 lg:hidden ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none translate-y-8'
        }`}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 transition-all duration-300 group"
        >
          <XIcon className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Mobile Cinema Selector */}
        <div className="relative z-10 px-8 pt-24 pb-8">
          <Select value={cinemaSelected} onValueChange={handleSelectCinema}>
            <SelectTrigger className="w-full h-14 text-white bg-gradient-to-r from-white/10 to-white/5 border-2 border-purple-500/30 rounded-2xl px-6 hover:border-purple-500/50 transition-all duration-300 text-lg">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-purple-400" />
                <SelectValue placeholder="UIT Cinema" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-neutral-900/95 backdrop-blur-xl text-white border-purple-500/30 rounded-2xl">
              {cinemas.map((cinema) => (
                <SelectItem
                  key={cinema.id}
                  value={cinema.id}
                  className="cursor-pointer hover:bg-purple-600/20 focus:bg-purple-600/30 text-base py-4"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    {cinema.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Navigation Links */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 px-8">
          {navLinks.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group w-full max-w-md transition-all duration-300 ${
                  isOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`relative p-5 rounded-2xl overflow-hidden transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r ' + item.gradient + ' shadow-lg shadow-purple-900/50' 
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} ${isActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'} transition-opacity duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-xl font-bold tracking-wide ${
                      isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    } transition-colors duration-300`}>
                      {item.label}
                    </span>
                    <TrendingUp className={`w-5 h-5 ml-auto ${
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-purple-400'
                    } group-hover:translate-x-1 transition-all duration-300`} />
                  </div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile Search */}
        <div className="relative z-10 px-8 pb-8">
          <div className="w-full">
            <MagicSearch />
          </div>
        </div>
      </div>
    </nav>
  );
};
