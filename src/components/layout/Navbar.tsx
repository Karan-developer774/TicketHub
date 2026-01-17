import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { cities } from '@/lib/helpers';
import { 
  Ticket, 
  MapPin, 
  ChevronDown, 
  User, 
  Film, 
  Music, 
  Plane,
  LogOut,
  Settings,
  History,
  Menu,
  X,
  Laugh,
  Trophy,
  Moon,
  Sun
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const movieCategories = [
  { name: 'Bollywood', href: '/movies/bollywood', icon: Film, description: 'Hindi movies and films' },
  { name: 'Hollywood', href: '/movies/hollywood', icon: Film, description: 'English movies and films' },
  { name: 'Regional Cinema', href: '/movies/regional', icon: Film, description: 'Tamil, Telugu, Malayalam, Kannada' },
];

const eventCategories = [
  { name: 'Live Concerts', href: '/events/concerts', icon: Music, description: 'Music concerts and live performances' },
  { name: 'Comedy Shows', href: '/events/comedy', icon: Laugh, description: 'Stand-up comedy and humor events' },
  { name: 'Sports Events', href: '/events/sports', icon: Trophy, description: 'Cricket, Football, and more' },
];

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut, initialize } = useAuthStore();
  const { selectedCity, setSelectedCity } = useBookingStore();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Ticket className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold gradient-text hidden sm:block">
              TicketHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {/* Movies Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  <Film className="h-4 w-4 mr-1.5" />
                  Movies
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/movies"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        >
                          <Film className="h-6 w-6 text-movie" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            All Movies
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Browse all movies now showing in cinemas
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    {movieCategories.map((item) => (
                      <li key={item.name}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              location.pathname === item.href && "bg-accent"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">{item.name}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Events Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  <Music className="h-4 w-4 mr-1.5" />
                  Events
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/events"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        >
                          <Music className="h-6 w-6 text-event" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            All Events
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Discover live concerts, comedy shows, and more
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    {eventCategories.map((item) => (
                      <li key={item.name}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              location.pathname === item.href && "bg-accent"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">{item.name}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Travel Link */}
              <NavigationMenuItem>
                <Link
                  to="/travel"
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
                    location.pathname === '/travel' && "bg-accent/50"
                  )}
                >
                  <Plane className="h-4 w-4 mr-1.5" />
                  Travel
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* City Selector & Actions */}
          <div className="flex items-center gap-3">
            {/* City Selector */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">{selectedCity}</span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="space-y-1">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCity === city 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-secondary'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* User Actions */}
            {user ? (
              <>
                <NotificationDropdown />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-foreground">
                          {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="font-medium text-foreground">{profile?.full_name || 'User'}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/bookings" className="flex items-center gap-2">
                        <History className="h-4 w-4" />
                        My Bookings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild size="sm" className="bg-gradient-primary hover:opacity-90">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border animate-slide-in-down">
            <div className="flex flex-col gap-2">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Movies</div>
              <Link 
                to="/movies" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Film className="h-5 w-5 text-movie" />
                <span>All Movies</span>
              </Link>
              {movieCategories.map((item) => (
                <Link 
                  key={item.name}
                  to={item.href} 
                  className="flex items-center gap-3 px-3 py-2 ml-4 rounded-lg hover:bg-secondary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
              
              <div className="px-3 py-2 mt-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Events</div>
              <Link 
                to="/events" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Music className="h-5 w-5 text-event" />
                <span>All Events</span>
              </Link>
              {eventCategories.map((item) => (
                <Link 
                  key={item.name}
                  to={item.href} 
                  className="flex items-center gap-3 px-3 py-2 ml-4 rounded-lg hover:bg-secondary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
              
              <div className="px-3 py-2 mt-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Travel</div>
              <Link 
                to="/travel" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Plane className="h-5 w-5 text-travel" />
                <span>Book Travel</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
