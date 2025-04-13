import {PropsWithChildren} from "react";
import Header from "@/components/Header.tsx";

const Layout = ({children}: PropsWithChildren) => {
    return (
        <div className={`bg-gradient-to-br from-background to-muted`}>
            <Header/>
            <main className={`min-h-screen container mx-auto px-4 py-8`}>
                <div>{children}</div>
            </main>

            <footer className={'border-t backdrop-blur py-8 supports-[backdrop-filter]:bg-background/60'}>
                <div className={'container mx-auto px-4 text-center text-gray-400'}>
                    Made with ❤️ by Nanda | <span className="text-sm text-muted-foreground font-light"><a target="_blank" href="https://github.com/piyush-eon/tanstack-query-weather-app">Reference</a></span>
                </div>
            </footer>
        </div>
    )
}
export default Layout
