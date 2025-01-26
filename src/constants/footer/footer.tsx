import { AiFillYoutube, AiOutlineInstagram } from 'react-icons/ai';
import { BiLogoFacebook } from 'react-icons/bi';
import { BsPinterest } from 'react-icons/bs';
import { RiTwitterXLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import './footer.scss';

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-upside">
        <div className="column">
          <h3>Contact us</h3>
          <ul>
            <Link to="/contact-us" className="li">Contact Information</Link>
            <Link to="/help-center" className="li">Help Center</Link>
            <Link to="/live-chat" className="li">Live Chat</Link>
            <Link to="/faqs" className="li">FAQs</Link>
          </ul>
        </div>
        <div className="column">
          <h3>Resources</h3>
          <ul>
            <Link to="/flights" className="li">Flights</Link>
            <Link to="/hotels" className="li">Hotels</Link>
            <Link to="/car-rentals" className="li">Car Rentals</Link>
            <Link to="/travel-insurance" className="li">Travel Insurance</Link>
          </ul>
        </div>
        <div className="column">
          <h3>Our Company</h3>
          <ul>
            <Link to="/about-us" className="li">About</Link>
            <Link to="/press" className="li">Press</Link>
            <Link to="/careers" className="li">Careers</Link>
            <Link to="/investors" className="li">Investors</Link>
          </ul>
        </div>
        <div className="column">
          <h3>Other Tour Brands</h3>
          <ul>
            <Link to="/go-ahead-tours" className="li">Go Ahead Tours</Link>
            <Link to="/city-tours" className="li">City Tours</Link>
            <Link to="/grand-circle-cruise-line" className="li">Grand Circle Cruise Line</Link>
            <Link to="/gap-year" className="li">Gap Year</Link>
            <Link to="/ultimate-break" className="li">Ultimate Break</Link>
          </ul>
        </div>
      </div>

      <div className="footer-middle-side">
        <div className="inner-footer-middle-side">
          <div className="social-media-icons">
            <Link to="https://facebook.com" className="icon">
              <BiLogoFacebook size={25} />
            </Link>
            <Link to="https://twitter.com" className="icon">
              <RiTwitterXLine size={25} />
            </Link>
            <Link to="https://instagram.com" className="icon">
              <AiOutlineInstagram size={25} />
            </Link>
            <Link to="https://pinterest.com" className="icon">
              <BsPinterest size={25} />
            </Link>
            <Link to="https://youtube.com" className="icon">
              <AiFillYoutube size={25} />
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-downside">
        <div className="inner-footer-downside">
          <div className="footer-downside-left">
            <p>© 2023 Tour, Inc. All rights reserved.</p>
          </div>
          <div className="footer-downside-right">
            <Link to="/terms-and-conditions" className="p">Terms & Conditions</Link> |
            <Link to="/privacy-policy" className="p">Privacy Policy</Link> |
            <Link to="/site-map" className="p">Site Map</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
