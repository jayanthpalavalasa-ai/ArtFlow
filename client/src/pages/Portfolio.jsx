import Navbar from '../components/Navbar';

function Portfolio() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <Navbar />

      {/* Portfolio */}
      <section className="px-6 pt-28 pb-16 bg-[#0B0B0B]">
        <div className="max-w-5xl mx-auto">

          <p className="text-sm tracking-[0.3em] uppercase text-[#B8B3AA] mb-4">
            Selected Works
          </p>

          <h1 className="text-4xl md:text-5xl font-serif text-white">
            A collection of
            <br />
            hand-drawn work.
          </h1>

          <p className="mt-5 max-w-xl text-[#B8B3AA] leading-relaxed">
            A glimpse into the artist's work, from detailed portraits
            to expressive graphite drawings.
          </p>

          {/* Featured Pencil Artwork */}
          <div className="mt-10 flex justify-center">
            <img
              src="/images/portfolio-1.jpg"
              alt="Selected pencil artwork by Eswar Tallapudi"
              className="w-full max-w-md max-h-[420px] object-contain rounded-2xl"
            />
          </div>

          {/* Pencil Gallery */}
          <div className="mt-4 grid grid-cols-2 gap-4">

            <img
              src="/images/portfolio-2.jpg"
              alt="Selected pencil artwork"
              className="w-full h-auto rounded-2xl"
            />

            <img
              src="/images/portfolio-3.jpg"
              alt="Selected pencil artwork"
              className="w-full h-auto rounded-2xl"
            />

            <img
              src="/images/portfolio-4.jpg"
              alt="Selected pencil artwork"
              className="w-full h-auto rounded-2xl"
            />

            <img
              src="/images/portfolio-5.jpg"
              alt="Selected pencil artwork"
              className="w-full h-auto rounded-2xl"
            />

          </div>

          {/* Pencil Commission */}
          <div className="mt-10 text-center">
            <a
              href="/commission"
              className="inline-flex items-center justify-center border border-white/20 px-6 py-3 rounded-full text-center text-white hover:bg-white/10 transition"
            >
              Commission Pencil Artwork →
            </a>
          </div>

          {/* Blood Art */}
          <section
            id="blood-art"
            className="mt-24"
          >
            <p className="text-sm tracking-[0.3em] uppercase text-[#A83A3A] mb-4">
              Blood Art
            </p>

            <h2 className="text-5xl md:text-6xl font-serif text-[#A83A3A] leading-tight">
              Art that
              <br />
              leaves a mark.
            </h2>

            <p className="mt-6 max-w-xl text-[#B8B3AA] leading-relaxed">
              An unconventional form of handcrafted art for those
              who want to turn something personal into something
              unforgettable.
            </p>

            {/* Blood Art Gallery */}
            <div className="mt-10 grid grid-cols-2 gap-4">

              <div className="col-span-2 overflow-hidden rounded-2xl">
                <img
                  src="/images/blood-1.jpg"
                  alt="Blood artwork"
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="overflow-hidden rounded-2xl">
                <img
                  src="/images/blood-2.jpg"
                  alt="Blood artwork"
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="overflow-hidden rounded-2xl">
                <img
                  src="/images/blood-3.jpg"
                  alt="Blood artwork"
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="col-span-2 overflow-hidden rounded-2xl">
                <img
                  src="/images/blood-4.jpg"
                  alt="Blood artwork"
                  className="w-full h-auto object-cover"
                />
              </div>

            </div>

            {/* Blood Art Commission */}
            <div className="mt-10 text-center">
              <a
                href="/commission"
                className="inline-flex items-center justify-center border border-white/20 px-6 py-3 rounded-full text-center text-white hover:bg-white/10 transition"
              >
                Commission Blood Art →
              </a>
            </div>

          </section>

        </div>
      </section>
    </div>
  );
}

export default Portfolio;