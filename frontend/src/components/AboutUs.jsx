import Header from './Header';
import Footer from './Footer';

const AboutUs = () => {
  return (
    <div>
      <Header />

      <section id="aboutus">
        <div className="content-header">
          <h1>About Us</h1>
          <p>Welcome to our Mess Management System, where we prioritize quality, nutrition, and convenience.</p>
        </div>

        <div className="additional-info">
          <div className="info-left">
            <h2>Our Mission</h2>
            <p>Our mission is to provide nutritious, delicious, and hygienic meals to students and professionals, ensuring a seamless dining experience.</p>
          </div>

          <div className="info-right">
            <h2>What We Offer</h2>
            <ul>
              <li>Nutritious and balanced meals</li>
              <li>Flexible meal plans</li>
              <li>Online meal booking system</li>
              <li>Affordable pricing</li>
              <li>Timely delivery</li>
            </ul>
          </div>
        </div>

        <div className="cta-section">
          <h2>Join Us Today!</h2>
          <p>Be part of our mess management system and enjoy fresh, nutritious meals at your convenience.</p>
          <button className="cta-button">Get Enrolled</button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
