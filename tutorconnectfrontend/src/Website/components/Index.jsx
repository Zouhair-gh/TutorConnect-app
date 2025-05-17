import Header from "./Header";
import Hero from "./Hero";
import About from "./About";
import Services from "./Services";
import Footer from "./Footer";
import SubscriptionForm from "../SubscriptionForm";
import '../styles/landing.css';
const Index = () => {
    return (
        <>
            <Header />
            <Hero />
            <About />
            <Services />
            <SubscriptionForm />
            <Footer />
        </>
    );
};

export default Index;
