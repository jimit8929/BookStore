import { footerStyles as s } from "../assets/dummystyles.js";
import { Link } from "react-router-dom";
import logo from "../assets/logoicon.png";
import { quickLinks, socialLinks } from "../assets/dummydata.js";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className={s.footer}>
      <div className={s.container}>
        <div className={s.grid}>
          <div className={s.logoBlock}>
            <Link to="/" className={s.logoLink}>
              <img src={logo} alt="logo" className={s.logoImg} />
              <h1 className={s.logoText}>BOOKSTORE</h1>
            </Link>

            <p className={s.aboutText}>
              Your Gateway to Literary adventures. Discover, explore, and
              immerse yourself in the world of books.
            </p>

            <div className={s.socialWrap}>
              {socialLinks.map(({ Icon, url }, i) => (
                <a
                  href={url}
                  key={i}
                  target="_blank"
                  className={s.socialButton}
                >
                  <Icon className={s.socialIcon} />
                </a>
              ))}
            </div>
          </div>

          <div className={s.quickLinksBlock}>
            <h3 className={s.quickLinksTitle}>Quick Links</h3>
            <ul className={s.quickLinksList}>
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.url} className={s.quickLinkItem}>
                    <span className={s.quickLinkItem}> {link.title} </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={s.newsletterBlock}>
            <h3 className={s.newsletterTitle}>Stay Updated</h3>
            <p className={s.newsletterText}>
              Subscribe to our newsletter for the latest releases and exclusive
              offers.
            </p>

            <form className={s.formWrap}>
              <input
                type="email"
                placeholder="Enter your Email"
                className={s.input}
              />

              <button className={s.button} type="submit">
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className={s.contactBlock}>
            <h3 className={s.contactTitle}>Contact Us</h3>
            <div className={s.contactList}>
              <div className={s.contactItem}>
                <MapPin className={s.contactIcon} />
                <span>123 Literary Lane, BookVille, BK 12345</span>
              </div>

              <div className={s.contactRow}>
                <Phone className={s.contactIconInline} />
                <span>+91 7777777777</span>
              </div>

              <div className={s.contactRow}>
                <Mail className={s.contactIconInline} />
                <span>contact@Bookstore.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className={s.copyrightWrap}>
          <p className={s.copyrightText}>
            &copy; {new Date().getFullYear()} BookStore.{"  "}All rights
            reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
