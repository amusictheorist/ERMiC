import React from "react";
import sshrcFipFullColorEng from '../../assets/sshrcFipFullColorEng.jpg';
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="px-4 py-8 sm:px-8 lg:px-16 xl:px-24 max-w-7xl mx-auto text-center">
      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-center mt-12 mb-10">
        About The ERMiC Project
      </h1>
      <div className="font-serif text-base sm:text-lg md:text-xl text-gray-700 text-left space-y-6 max-w-3xl mx-auto leading-relaxed">
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold mt-12 mb-4 text-gray-800">
          Refugee Musicians in Canada
        </h2>
        <p>
          The <em>European Refugee Musicians in Canada</em> (ERMiC) online biographical dictionary explores the lives and legacies of musical artists who arrived in Canada between 1937 and 1950 as refugees from Nazi-occupied Europe. Though fewer than 120 musicians were admitted during this period—due to Canada's restrictive immigration policies and widespread antisemitism, as documented in the book <strong>None Is Too Many</strong> by Irving Abella and Harold Troper—those who did arrive made lasting contributions to Canadian cultural life. Many were Jewish musicians fleeing persecution, while others left Europe for political or moral reasons. Despite the formidable barriers they faced, many of these individuals built influential careers in Canada, often extending well into the 21st century.
        </p>
        <p>
          Most of these musicians arrived after 1948, when immigration laws began to ease under Prime Minister Mackenzie King. Their paths to Canada were diverse: some came directly from Europe, but most arrived via Britain, the United States, Shanghai, or Palestine. Many arrived from Britain as interned “enemy aliens”, later choosing to remain in Canada after their release. Their backgrounds varied widely—some had elite European training, while others developed their skills after settling in Canada. Collectively, they enriched Canada’s musical life through composition, performance, education, scholarship, patronage, and administration. While many remain little known, their stories offer a compelling lens through which to understand both the trauma of exile and the transformative power of cultural exchange. This dictionary aims to illuminate their individual journeys and to contribute to a broader historical narrative of music in Canada.
        </p>

        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold mt-12 mb-4 text-gray-800">
          Navigating the Site
        </h2>
        <p>
          Each musician in the ERMiC database has a dedicated page featuring a biographical entry, along with available creative works, scholarly writings, media contributions, and a bibliography for further reading. Where applicable, internal links and biographical cross-references connect related musicians, allowing for a freer exploration of the entries.
        </p>
        <p>
          The search bar, available throughout the site, supports filtered searches by name, occupation, titles of works or writings, and ERMiC biography authors. Selecting a result brings you directly to the relevant musician’s page or to a list of matching entries. You can also run broad keyword searches—try entering something like <em>"music"</em> to see what turns up!
        </p>
        <p>
          Prefer to browse? The <Link to="/browse" className="text-blue-600">Browse</Link> page displays the full list of ERMiC musicians and lets you sort them by criteria such as place of birth, place of death, or date of birth.
        </p>

        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold mt-12 mb-4 text-gray-800">
          Contact Us
        </h2>
        <p>
          The ERMiC project is ongoing, and we continue to refine and expand the content. If you have questions about the project or would like to contribute additional information about any of the featured musicians, we warmly invite you to get in touch via our <Link to="/contact" className="text-blue-600">Contact</Link> page.
        </p>
      </div>

      {/* SSHRC acknowledgement */}
      <div className="mt-16 bg-gray-100 rounded-lg px-6 py-4 shadow-sm text-sm text-gray-700 text-center max-w-xl mx-auto">
        <img
          src={sshrcFipFullColorEng}
          alt="SSHRC logo"
          className="mx-auto h-16 object-contain"
        />
        <p className="mb-4">
          <span className="font-semibold">European Refugee Musicians in Canada</span> draws on research supported by the Social Sciences and Humanities Research Council.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;