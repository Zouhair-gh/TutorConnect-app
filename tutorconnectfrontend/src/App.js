import logo from './logo.svg';
import './App.css';

import Header from "./Website/components/Header";
import Hero from "./Website/components/Hero";
import About from "./Website/components/About";
import Services from "./Website/components/Services";
import Faqs from "./Website/components/Faqs";
import Testimonials from "./Website/components/Testimonials";
import Footer from "./Website/components/Footer";

function App() {
  return (
      <>
          <Header />
          <Hero />
          <About/>
          <Services/>
          <Faqs/>
          <Footer/>


      </>

  );
}

export default App;
