import { aboutStyles as s } from "../assets/dummystyles.js";
import { apbranches, apstats, apteamMembers } from "../assets/dummydata.js";
import AboutUsImage from "../assets/AboutUsImage.png";
import { Clock, Facebook, Instagram, MapPin, Twitter } from "lucide-react";

const About = () => {
  return (
    <div className={s.container}>
      <section className={s.section}>
        <div className={s.innerContainer}>
          <div className={s.headingWrapper}>
            <div className="relative inline-block">
              <h1 className={s.heading}>
                Crafting Literary <br /> Futures
              </h1>

              <div className={s.underline} />

              <p className={s.subText}>
                Pioneering the next Chapter in global storytelling. We bridge
                imagination with innovation curated literary experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={s.statsSection}>
        <div className={s.innerContainer}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {apstats.map((stat, index) => (
              <div className={s.statCard} key={index}>
                <div className={s.statIconWrapper}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className={s.statValue}>{stat.value}</h3>
                <p className={s.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={s.aboutSection}>
        <div className={s.innerContainer}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className={s.aboutImageWrapper}>
              <img src={AboutUsImage} alt="about" className={s.aboutImage} />

              <div className={s.aboutOverlay} />

              <div className={s.aboutCaption}>
                <h3 className={s.aboutTitle}>Since 2025</h3>
                <p className={s.aboutSubtitle}>Pioneering Digital Literature</p>
              </div>
            </div>

            <div className={s.aboutTextSection}>
              <div className={s.aboutHeadingSection}>
                <h2 className={s.aboutHeading}>Redefining Storytelling</h2>
                <p className={s.aboutParagraph}>
                  We've transformed traditional publishing into a dynamic
                  digital ecosystem...
                </p>
              </div>

              <div className={s.aboutBoxGrid}>
                <div className={s.aboutBox}>
                  <h4 className={s.aboutBoxHeading}>Our Vision</h4>
                  <p className={s.aboutBoxText}>Create a global network...</p>
                </div>

                <div className={s.aboutBox}>
                  <h4 className={s.aboutBoxHeading}>Our Mission</h4>
                  <p className={s.aboutBoxText}>
                    Empower creators and inspire readers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={s.teamSection}>
        <div className={s.innerContainer}>
          <div className="text-center mb-20">
            <h2 className={s.sectionTitle}>Meet your Literary Guides</h2>
            <div className={s.sectionUnderline} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {apteamMembers.map((member) => (
              <div className={s.teamCard} key={member}>
                <div className={s.teamImageWrapper}>
                  <img
                    src={member.image}
                    alt={member.name}
                    className={s.teamImage}
                  />
                  <div className={s.teamOverlay}></div>
                </div>

                <h3 className={s.teamName}>{member.name}</h3>
                <p className={s.teamPosition}>{member.position}</p>
                <div className="flex justify-center space-x-4">
                  {[Facebook, Twitter, Instagram].map((Icon, i) => (
                    <button key={i} className={s.socialIcon}>
                      <Icon className="h-6 w-6" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={s.branchSection}>
        <div className={s.innerContainer}>
          <div className="text-center mb-20">
            <h2 className={s.sectionTitle}>Our Literary Sentuaries</h2>
            <div className={s.sectionUnderline} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {apbranches.map((branch, index) => (
              <div className={s.branchCard} key={index}>
                <div className={s.branchImageWrapper}>
                  <img
                    src={branch.image}
                    alt={branch.location}
                    className={s.branchImage}
                  />
                  <div className={s.branchOverlay}></div>
                </div>

                <div className={s.branchInfoWrapper}>
                  <div className={s.branchLocationWrapper}>
                    <MapPin className="h-6 w-6 text-teal-300" />
                    <h3 className={s.branchLocation}>{branch.location}</h3>
                  </div>

                  <div className={s.branchHours}>
                    <Clock className="h-6 w-6 text-teal-300" />
                    <h3 className={s.branchHours}>{branch.hours}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
