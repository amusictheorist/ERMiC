import React from "react";

const AboutPage = () => {
  return (
    <div className="px-4 py-8 sm:px-8 lg:px-16 xl:px-24 max-w-7xl mx-auto text-center">
      <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
        About ERMiC
      </h1>
      <div className="font-serif text-sm sm:text-base md:text-lg text-gray-700 text-left space-y-6 max-w-3xl mx-auto">
        <p>
          The <em>European Refugee Musicians in Canada</em> (ERMiC) online biographical dictionary explores the lives and legacies of musical artists who arrived in Canada between 1937 and 1950 as refugees from Nazi-occupied Europe. Though fewer than 120 musicians were admitted during this period—due to Canada's restrictive immigration policies and widespread antisemitism, as documented in the book None Is Too Many by Irving Abella and Harold Troper—those who did arrive made lasting contributions to Canadian cultural life. Many were Jewish musicians fleeing persecution, while others left Europe for political or moral reasons. Despite the formidable barriers they faced, many of these individuals built influential careers in Canada, often extending well into the 21st century.
        </p>
        <p>
          Most of these musicians arrived after 1948, when immigration laws began to ease under Prime Minister Mackenzie King. Their paths to Canada were diverse: some came directly from Europe, but most arrived via Britain, the United States, Shanghai, or Palestine. Many arrived from Britain as interned “enemy aliens”, later choosing to remain in Canada after their release. Their backgrounds varied widely—some had elite European training, while others developed their skills after settling in Canada. Collectively, they enriched Canada’s musical life through composition, performance, education, scholarship, patronage, and administration. While many remain little known, their stories offer a compelling lens through which to understand both the trauma of exile and the transformative power of cultural exchange. This dictionary aims to illuminate their individual journeys and to contribute to a broader historical narrative of music in Canada.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;