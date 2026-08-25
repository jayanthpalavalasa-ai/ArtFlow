function Home() {
  return (
    <main>
      <section className="px-5 sm:px-8 pt-28 pb-20 md:pt-32 md:pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="kicker mb-5">Eswar Tallapudi's Art</p>
            <h1 className="page-title">
              Think different,
              <br />
              Do something.
            </h1>
            <p className="lede mt-6">
              Turn your most meaningful photographs into
              handcrafted artwork, drawn with patience,
              detail and character.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="/commission" className="btn-solid">
                Commission Your Own Artwork
              </a>
              <a href="/portfolio" className="btn">
                Explore Portfolio
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img
              src="/images/hero-artwork.jpg"
              alt="Handcrafted artwork by Eswar Tallapudi"
              className="artwork max-w-sm lg:max-w-md max-h-[480px] object-contain"
            />
            <div className="mt-5 text-center">
              <h2 className="text-[15px] tracking-[0.04em] text-paper">
                Eswar Tallapudi
              </h2>
              <p className="mt-1 text-xs tracking-[0.08em] text-mist">
                Pencil Artist & Portrait Creator
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <p className="kicker mb-4">The Artist</p>
            <h2 className="section-title">
              More than a photograph.
              <br />
              Something made by hand.
            </h2>
            <p className="lede mt-5">
              Every commissioned piece begins with a photograph
              and becomes something entirely different through
              patience, observation and hand-drawn detail.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <p className="kicker mb-4">Featured Works</p>
          <h2 className="section-title">A glimpse of the work.</h2>
          <p className="lede mt-4">
            A small selection of Eswar's work. Explore the full
            collection in the portfolio.
          </p>

          <div className="mt-10">
            <p className="kicker mb-4">Graphite</p>
            <div className="grid md:grid-cols-3 gap-3 items-start">
              <div className="md:col-span-2 overflow-hidden">
                <img
                  src="/images/portfolio-1.jpg"
                  alt="Featured pencil artwork by Eswar Tallapudi"
                  className="artwork"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                <img
                  src="/images/portfolio-2.jpg"
                  alt="Pencil artwork by Eswar Tallapudi"
                  className="artwork"
                />
                <img
                  src="/images/portfolio-3.jpg"
                  alt="Pencil artwork by Eswar Tallapudi"
                  className="artwork"
                />
              </div>
            </div>
          </div>

          <div className="mt-16">
            <p className="kicker mb-4 text-mark">Blood Art</p>
            <div className="grid md:grid-cols-3 gap-3 items-start">
              <div className="md:col-span-2 overflow-hidden">
                <img
                  src="/images/blood-1.jpg"
                  alt="Featured blood artwork by Eswar Tallapudi"
                  className="artwork"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                <img
                  src="/images/blood-2.jpg"
                  alt="Blood artwork by Eswar Tallapudi"
                  className="artwork"
                />
                <img
                  src="/images/blood-3.jpg"
                  alt="Blood artwork by Eswar Tallapudi"
                  className="artwork"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <a href="/portfolio" className="btn">
              View Full Portfolio
            </a>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <p className="kicker mb-4">The Process</p>
            <h2 className="section-title">
              From your photograph
              <br />
              to a finished artwork.
            </h2>
            <p className="lede mt-5">
              Every commission follows a simple process, keeping
              you informed from the first reference photo to the
              finished piece.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-x-14 gap-y-9">
            {[
              {
                n: '01',
                title: 'Share your reference',
                body: "Tell us what you'd like to create and upload your reference photograph through the commission form.",
              },
              {
                n: '02',
                title: 'Review & confirmation',
                body: 'The artwork request is reviewed and the details, pricing and requirements are confirmed.',
              },
              {
                n: '03',
                title: 'The artwork begins',
                body: 'Once the commission is confirmed, Eswar begins creating your artwork by hand.',
              },
              {
                n: '04',
                title: 'Completion & delivery',
                body: 'After the artwork is completed and finalized, it is prepared and shipped to you.',
              },
            ].map((step) => (
              <div key={step.n} className="flex gap-4">
                <span className="pt-0.5 text-[11px] tracking-[0.16em] text-mist">
                  {step.n}
                </span>
                <div>
                  <h3 className="font-display text-lg text-paper">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-paper-mute">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-20 md:py-24">
        <div className="max-w-6xl mx-auto text-center">
          <p className="kicker mb-4">Your idea. Your story.</p>
          <h2 className="section-title">
            Turn a photograph
            <br />
            into something lasting.
          </h2>
          <p className="lede mt-5 mx-auto">
            Have a photograph that means something to you?
            Let Eswar turn it into a handcrafted artwork.
          </p>
          <a href="/commission" className="btn-solid mt-8">
            Commission Your Own Artwork
          </a>
        </div>
      </section>
    </main>
  );
}

export default Home;
