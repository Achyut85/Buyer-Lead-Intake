import Header from "../components/Header"
import BuyerFilters from "../components/BuyerFilters"
import Navbar from "../components/Navbar"
export default function Buyers(){
    return (
        <div className=" g:border-x px-6 py-4 border-gray-300 max-w-7xl w-full">
            <Navbar/>
            <Header />
            <BuyerFilters/>
        </div>
    )
}
