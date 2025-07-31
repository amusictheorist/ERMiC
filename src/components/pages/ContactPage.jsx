import Elliott2020 from '../../assets/Elliott2020.jpg';

const ContactPage = () => {
  return (
    <div className="px-4 sm:px-8 lg:px-16 xl:px-24 max-w-7xl mx-auto">
      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-center mt-12 mb-10">
        Contact
      </h1>

      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col md:flex-row items-center md:justify-center md:space-x-10 max-w-4xl">
          <img
            src={Elliott2020}
            alt="Dr. Robin Elliott"
            className="w-40 h-40 object-cover rounded-full mb-6 md:mb-0 md:self-center shadow"
          />

          <div className="font-serif text-base sm:text-lg md:text-xl text-gray-700 text-left space-y-4 leading-relaxed max-w-xl">
            <p>
              If you have questions, concerns, or additional information to share, please feel free to get in touch with:
            </p>
            <div>
              <p className="font-semibold">
                <a
                  href="https://music.utoronto.ca/person/robin-elliott"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Dr. Robin Elliott
                </a>
              </p>
              <p>Associate Dean, Graduate Education</p>
              <p>Jean A. Chalmers Chair in Canadian Music</p>
              <p>Faculty of Music, University of Toronto</p>
              <p>Professor</p>
              <p>
                <a
                  href="mailto:robin.elliott@utoronto.ca"
                  className="text-blue-600 underline"
                >
                  robin.elliott@utoronto.ca
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
