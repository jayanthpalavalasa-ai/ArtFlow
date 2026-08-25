function Portfolio() {
  return (
    <main className="page-shell">
      <div className="max-w-5xl mx-auto">
        <p className="kicker mb-4">Selected Works</p>
        <h1 className="page-title">
          A collection of
          <br />
          hand-drawn work.
        </h1>
        <p className="lede mt-5">
          A glimpse into the artist's work, from detailed portraits
          to expressive graphite drawings.
        </p>

        <div className="mt-10 flex justify-center">
          <img
            src="/images/portfolio-1.jpg"
            alt="Selected pencil artwork by Eswar Tallapudi"
            className="artwork max-w-md max-h-[420px] object-contain"
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <img src="/images/portfolio-2.jpg" alt="Selected pencil artwork" className="artwork" />
          <img src="/images/portfolio-3.jpg" alt="Selected pencil artwork" className="artwork" />
          <img src="/images/portfolio-4.jpg" alt="Selected pencil artwork" className="artwork" />
          <img src="/images/portfolio-5.jpg" alt="Selected pencil artwork" className="artwork" />
        </div>

        <div className="mt-10 text-center">
          <a href="/commission" className="btn">
            Commission Pencil Artwork
          </a>
        </div>

        <section id="blood-art" className="mt-24">
          <p className="kicker mb-4 text-mark">Blood Art</p>
          <h2 className="section-title text-mark">
            Art that
            <br />
            leaves a mark.
          </h2>
          <p className="lede mt-5">
            An unconventional form of handcrafted art for those
            who want to turn something personal into something
            unforgettable.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3">
            <div className="col-span-2 overflow-hidden">
              <img src="/images/blood-1.jpg" alt="Blood artwork" className="artwork object-cover" />
            </div>
            <img src="/images/blood-2.jpg" alt="Blood artwork" className="artwork object-cover" />
            <img src="/images/blood-3.jpg" alt="Blood artwork" className="artwork object-cover" />
            <div className="col-span-2 overflow-hidden">
              <img src="/images/blood-4.jpg" alt="Blood artwork" className="artwork object-cover" />
            </div>
          </div>

          <div className="mt-10 text-center">
            <a href="/commission" className="btn">
              Commission Blood Art
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Portfolio;
