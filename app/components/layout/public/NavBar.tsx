import { Menu } from 'lucide-react'; // Import the menu icon
import Logo from '~/components/common/Logo';
import { Button } from '~/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '~/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'; // Import Sheet components
import { navitems } from './navitems';



const NavBar = () => {

    return (
        <header className="border-b">
            <nav className="flex justify-between items-center py-4 px-8">
                <div className="flex items-center space-x-8">
                    <Logo />
                    {/* Desktop Navigation Menu */}
                    <NavigationMenu className="hidden lg:block">
                        <NavigationMenuList className="flex space-x-8">

                            {
                                navitems.map((item, i) => (
                                    <NavigationMenuItem key={i} >
                                        <NavigationMenuLink href={item.path} className={navigationMenuTriggerStyle()}>
                                            {item.title}
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                ))
                            }

                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Mobile Menu Toggle and Sheet */}

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                        {/* Mobile Navigation Menu */}
                        <NavigationMenu className="flex flex-col space-y-4 mt-8">
                            <NavigationMenuList className="flex flex-col space-y-4">
                                <NavigationMenuItem>

                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Dashboard
                                    </NavigationMenuLink>

                                </NavigationMenuItem>
                                <NavigationMenuItem>

                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Projects
                                    </NavigationMenuLink>

                                </NavigationMenuItem>
                                <NavigationMenuItem>

                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Team
                                    </NavigationMenuLink>

                                </NavigationMenuItem>
                                <NavigationMenuItem>

                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>

                                        Settings
                                    </NavigationMenuLink>

                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>

                        {/* Buttons in the Sheet */}
                        <div className="mt-8 flex flex-col space-y-4">
                            <Button variant="outline" className="w-full">
                                Login
                            </Button>
                            <Button className="w-full">Sign Up</Button>
                        </div>
                    </SheetContent>
                </Sheet>


                {/* Desktop Login and Sign Up Buttons */}
                <div className="hidden lg:flex items-center space-x-4">
                    <Button variant="outline">Login</Button>
                    <Button>Sign Up</Button>
                </div>
            </nav>
        </header>
    );
};

export default NavBar;