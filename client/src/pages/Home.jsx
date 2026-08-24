import Navbar from '../components/Navbar';

function Home() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="min-h-screen flex items-center px-6 pt-28 pb-16">
        <div className="w-full max-w-6xl mx-auto">

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Hero Text */}
            <div>

              <p className="text-sm tracking-[0.3em] uppercase text-[#B8B3AA] mb-6">
                Eswar Tallapudi's Art
              </p>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-tight text-white">
                Think different,
                <br />
                Do something.
              </h1>

              <p className="mt-6 max-w-xl text-[#B8B3AA] text-base md:text-lg leading-relaxed">
                Turn your most meaningful photographs into
                handcrafted artwork, drawn with patience,
                detail and character.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">

                <a
                  href="/commission"
                  className="border border-white/20 px-6 py-3 rounded-full text-center text-white hover:bg-white/10 transition"
                >
                  Commission Your Own Artwork →
                </a>

                <a
                  href="/portfolio"
                  className="border border-white/20 px-6 py-3 rounded-full text-center text-white hover:bg-white/10 transition"
                >
                  Explore Portfolio
                </a>

              </div>

            </div>


            {/* Hero Artwork */}
            <div className="flex flex-col items-center">

              <img
                src="/images/hero-artwork.jpg"
                alt="Handcrafted artwork by Eswar Tallapudi"
                className="w-full max-w-sm lg:max-w-md max-h-[520px] object-contain rounded-2xl"
              />

              <div className="mt-5 text-center">

                <h2 className="text-lg font-medium text-white">
                  Eswar Tallapudi
                </h2>

                <p className="mt-1 text-sm text-[#B8B3AA]">
                  Pencil Artist & Portrait Creator
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ================= INTRODUCTION ================= */}
      <section className="px-6 py-20">
        <div className="w-full max-w-6xl mx-auto">

          <div className="max-w-3xl">

            <p className="text-sm tracking-[0.3em] uppercase text-[#B8B3AA] mb-4">
              The Artist
            </p>

            <h2 className="text-4xl md:text-5xl font-serif leading-tight">
              More than a photograph.
              <br />
              Something made by hand.
            </h2>

            <p className="mt-6 text-[#B8B3AA] leading-relaxed">
              Every commissioned piece begins with a photograph
              and becomes something entirely different through
              patience, observation and hand-drawn detail.
            </p>

          </div>

        </div>
      </section>


   {/* ================= FEATURED WORKS ================= */}
<section className="px-6 py-20">
  <div className="w-full max-w-5xl mx-auto">

    <p className="text-sm tracking-[0.3em] uppercase text-[#B8B3AA] mb-4">
      Featured Works
    </p>

    <h2 className="text-4xl md:text-5xl font-serif">
      A glimpse of the work.
    </h2>

    <p className="mt-5 max-w-xl text-[#B8B3AA] leading-relaxed">
      A small selection of Eswar's work. Explore the full
      collection in the portfolio.
    </p>


    {/* ================= PENCIL ART ================= */}
    <div className="mt-10">

      <p className="text-xs tracking-[0.25em] uppercase text-[#6F8499] mb-4">
        Graphite
      </p>

      <div className="grid md:grid-cols-3 gap-5 items-start">

        {/* Featured Pencil */}
        <div className="md:col-span-2 overflow-hidden rounded-2xl">

          <img
            src="/images/portfolio-1.jpg"
            alt="Featured pencil artwork by Eswar Tallapudi"
            className="w-full h-auto rounded-2xl"
          />

        </div>


        {/* Smaller Pencil Works */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-5">

          <div className="overflow-hidden rounded-2xl">

            <img
              src="/images/portfolio-2.jpg"
              alt="Pencil artwork by Eswar Tallapudi"
              className="w-full h-auto rounded-2xl"
            />

          </div>

          <div className="overflow-hidden rounded-2xl">

            <img
              src="/images/portfolio-3.jpg"
              alt="Pencil artwork by Eswar Tallapudi"
              className="w-full h-auto rounded-2xl"
            />

          </div>

        </div>

      </div>

    </div>


    {/* ================= BLOOD ART ================= */}
    <div className="mt-16">

      <p className="text-xs tracking-[0.25em] uppercase text-[#A83A3A] mb-4">
        Blood Art
      </p>

      <div className="grid md:grid-cols-3 gap-5 items-start">

        {/* Featured Blood Artwork */}
        <div className="md:col-span-2 overflow-hidden rounded-2xl">

          <img
            src="/images/blood-1.jpg"
            alt="Featured blood artwork by Eswar Tallapudi"
            className="w-full h-auto rounded-2xl"
          />

        </div>


        {/* Smaller Blood Works */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-5">

          <div className="overflow-hidden rounded-2xl">

            <img
              src="/images/blood-2.jpg"
              alt="Blood artwork by Eswar Tallapudi"
              className="w-full h-auto rounded-2xl"
            />

          </div>

          <div className="overflow-hidden rounded-2xl">

            <img
              src="/images/blood-3.jpg"
              alt="Blood artwork by Eswar Tallapudi"
              className="w-full h-auto rounded-2xl"
            />

          </div>

        </div>

      </div>

    </div>


    {/* Portfolio CTA */}
    <div className="mt-10 text-center">

      <a
        href="/portfolio"
        className="inline-flex items-center justify-center border border-white/20 px-6 py-3 rounded-full text-white hover:bg-white/10 transition"
      >
        View Full Portfolio →
      </a>

    </div>

  </div>
</section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="px-6 py-1">
        <div className="w-full max-w-6xl mx-auto">

          <div className="max-w-3xl">

            <p className="text-sm tracking-[0.3em] uppercase text-[#B8B3AA] mb-4">
              The Process
            </p>

            <h2 className="text-4xl md:text-5xl font-serif leading-tight">
              From your photograph
              <br />
              to a finished artwork.
            </h2>

            <p className="mt-5 text-[#B8B3AA] leading-relaxed">
              Every commission follows a simple process, keeping
              you informed from the first reference photo to the
              finished piece.
            </p>

          </div>


          {/* Process Steps */}
          <div className="mt-12 grid md:grid-cols-2 gap-x-12 gap-y-10">

            {/* Step 01 */}
            <div className="flex gap-5">

              <span className="text-sm text-[#6F8499] font-mono pt-1">
                01
              </span>

              <div>

                <h3 className="text-xl font-serif text-white">
                  Share your reference
                </h3>

                <p className="mt-2 text-sm text-[#B8B3AA] leading-relaxed">
                  Tell us what you'd like to create and upload
                  your reference photograph through the
                  commission form.
                </p>

              </div>

            </div>


            {/* Step 02 */}
            <div className="flex gap-5">

              <span className="text-sm text-[#6F8499] font-mono pt-1">
                02
              </span>

              <div>

                <h3 className="text-xl font-serif text-white">
                  Review & confirmation
                </h3>

                <p className="mt-2 text-sm text-[#B8B3AA] leading-relaxed">
                  The artwork request is reviewed and the
                  details, pricing and requirements are confirmed.
                </p>

              </div>

            </div>


            {/* Step 03 */}
            <div className="flex gap-5">

              <span className="text-sm text-[#6F8499] font-mono pt-1">
                03
              </span>

              <div>

                <h3 className="text-xl font-serif text-white">
                  The artwork begins
                </h3>

                <p className="mt-2 text-sm text-[#B8B3AA] leading-relaxed">
                  Once the commission is confirmed, Eswar begins
                  creating your artwork by hand.
                </p>

              </div>

            </div>


            {/* Step 04 */}
            <div className="flex gap-5">

              <span className="text-sm text-[#6F8499] font-mono pt-1">
                04
              </span>

              <div>

                <h3 className="text-xl font-serif text-white">
                  Completion & delivery
                </h3>

                <p className="mt-2 text-sm text-[#B8B3AA] leading-relaxed">
                  After the artwork is completed and finalized,
                  it is prepared and shipped to you.
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ================= COMMISSION CTA ================= */}
      <section className="px-6 py-24">
        <div className="w-full max-w-6xl mx-auto text-center">

          <p className="text-sm tracking-[0.3em] uppercase text-[#B8B3AA] mb-4">
            Your idea. Your story.
          </p>

          <h2 className="text-4xl md:text-5xl font-serif leading-tight">
            Turn a photograph
            <br />
            into something lasting.
          </h2>

          <p className="mt-5 mx-auto max-w-xl text-[#B8B3AA] leading-relaxed">
            Have a photograph that means something to you?
            Let Eswar turn it into a handcrafted artwork.
          </p>

          <a
            href="/commission"
            className="inline-flex mt-8 items-center justify-center border border-white/20 px-6 py-3 rounded-full text-white hover:bg-white/10 transition"
          >
            Commission Your Own Artwork →
          </a>

        </div>
      </section>

    </div>
  );
}

export default Home;