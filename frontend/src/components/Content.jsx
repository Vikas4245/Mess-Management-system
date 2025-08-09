import food4 from '../assets/images/food4.webp';
import food2 from '../assets/images/food2.webp';
import food3 from '../assets/images/food3.jpg';
import food1 from '../assets/images/food1.webp';
import food5 from '../assets/images/food5.avif';
import food6 from '../assets/images/food6.jpg';
import food7 from '../assets/images/food7.webp';
import food8 from '../assets/images/food8.jpeg';
import '../assets/styles.css';
import FeedbackList from './Feedback/FeedbackList';
import ContactUs from './ContactUs';

const slides = [
  { img: food4, text: 'Satisfy your cravings, everyday.' },
  { img: food2, text: 'A world of flavours, right here.' },
  { img: food3, text: 'Quality food, served with love.' },
  { img: food1, text: 'The perfect blend of taste and affordability.' },
  { img: food5, text: 'The perfect blend of taste and affordability.' },
  { img: food6, text: 'Satisfy your cravings, everyday.' },
  { img: food7, text: 'Quality food, served with love.' },
  { img: food8, text: 'Quality food, served with love.' }
];

import '../assets/styles.css';

const Content = () => {
  return (
    <section id="content">
      <div className="content-header">
        <h1>Welcome to Our Mess Management System</h1>
        <p>Ensuring a seamless dining experience with nutritious and hygienic meals.</p>
      </div>

      <div id="swiper">
        {slides.map((slide, index) => (
          <div className="swiper-part" key={index}>
            <div className="swiper-part-imgdiv">
              <img className="swiper-part-img" src={slide.img} alt={`Slide ${index + 1}`} />
            </div>
            <div className="swiper-part-textdiv">
              <h2 className="swiper-part-text">{slide.text}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <h2>Join Our Mess Today!</h2>
        <p>Enjoy delicious, healthy meals every day with our hassle-free mess management system.</p>
        <button className="cta-button">Get Enrolled</button>
      </div>

      <div>
        <h2>What Students Say!</h2>
        <FeedbackList />
      </div>

      {/* Important Links Section */}
      <div className="important-links-section">
        <h2>Important Links</h2>
        <ul>
          <li><a href="/meal-schedule">View Meal Schedule</a></li>
          <li><a href="/health-guidelines">Health & Safety Guidelines</a></li>
        </ul>
      </div>

      {/* Additional Info Section */}
      <div className="additional-info">
        <div className="info-left">
          <h2>Our Services</h2>
          <ul>
            <li>Nutritious and balanced meals</li>
            <li>Hygienic food preparation</li>
            <li>Flexible meal plans</li>
            <li>Affordable pricing</li>
            <li>Online meal booking system</li>
          </ul>
        </div>

        <div className="info-right">
          <h2>Why Choose Us?</h2>
          <p>We are committed to providing fresh, hygienic, and nutritious meals with a focus on quality. Enjoy the convenience of online meal management for a happy, healthy dining experience.</p>
        </div>
      </div>

      <div>
        <ContactUs />
      </div>

    </section>
  );
};

export default Content;
