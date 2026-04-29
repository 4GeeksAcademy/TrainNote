import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"

export const Layout = () => {
    return (
        <ScrollToTop>
            <div className="bg-registro">
                
                <div className="phone-frame">
                    
                    <div className="mobile-container">
                        <Outlet />
                        <Footer /> 
                    </div>

                </div>

            </div>
            
        </ScrollToTop>
    )
}