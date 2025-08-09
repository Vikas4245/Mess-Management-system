import Header from "./Header";
import Footer from "./Footer";

const ContactUs = () => {
  return (
    <div id="contactus">
      <div className="content-header">
        <h1>Contact Us</h1>
        <p>
          If you have any questions, concerns, or feedback, we’d love to hear
          from you!
        </p>
      </div>

      <div className="container">
        <form
          action="mailto:your-email@example.com"
          method="post"
          enctype="text/plain"
        >
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="6"
            required
          ></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>

      <div className="cta-div">
        <h2>Reach Us for Any Inquiry</h2>
        <p>
          Our team is ready to assist you with any questions about our services
          or to help you with any issues.
        </p>
      </div>
    </div>
  );
};

export default ContactUs;
