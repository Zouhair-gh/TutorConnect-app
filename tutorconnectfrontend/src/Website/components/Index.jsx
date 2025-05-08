import Header from "./Header";
import Hero from "./Hero";
import About from "./About";
import Services from "./Services";
import Faqs from "./Faqs";
import Testimonials from "./Testimonials";
import Footer from "./Footer";
import SubscriptionForm from "../SubscriptionForm";

const Index = () => {
    return (
        <>
            <Header />
            <Hero />
            <About />
            <Services />
            <SubscriptionForm />
            <Testimonials />
            <Footer />
        </>
    );
};

export default Index;
