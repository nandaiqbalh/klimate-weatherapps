import { Link } from "react-router-dom";
import { useTheme } from "@/components/theme-provider.tsx";
import { Moon, Sun } from "lucide-react";
import CitySearch from "./CitySearch";

const Header = () => {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <header
            className={`sticky top-0 w-full bg-background/90 border-b backdrop-blur py-2 supports-[backdrop-filter]:bg-background/6 z-50`}>
            <div className={'container mx-auto flex h-16 items-center justify-between px-4'}>
                <Link to={"/"}>
                    <img src={isDark ? "/logo.png" : "/logo2.png"} alt="Logo SunDrizzle" className={`h-14`} />
                </Link>

                <div className="flex items-center gap-4 md:pr-0 sm:pr-12">
                {/*{search}*/}
                    <CitySearch />

                    <div className={`flex items-center cursor-pointer transition-transform duration-500 ${isDark ? "rotate-180" : "rotate-0"}`}>
                        {/*{theme toggle}*/}
                        <div onClick={() => isDark ? setTheme("light") : setTheme("dark")}>
                            {isDark ? <Sun className="h-6 w-6 text-yellow-500 rotate-0 transition-all" /> :
                                <Moon className="h-6 w-6 text-blue-500 rotate-0 transition-all" />}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
export default Header
