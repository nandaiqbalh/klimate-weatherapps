import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "@/components/Layout.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import KlimateDashboard from "@/pages/KlimateDashboard.tsx";
import CityPages from "@/pages/CityPages.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";


// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: false,
        resetOnWindowFocus: true
    }
});

function App() {


    return (
        <>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <ThemeProvider>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<KlimateDashboard/>}/>
                                <Route path="/city/:cityName" element={<CityPages/>}/>
                            </Routes>
                        </Layout>
                    </ThemeProvider>
                </BrowserRouter>
                <ReactQueryDevtools initialIsOpen={false}/>
            </QueryClientProvider>
        </>
    )
}

export default App
