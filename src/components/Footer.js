export default function Footer() {
  const socials = [
    {
      name: "Twitter",
      url: "https://twitter.com",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.29 4.29 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.29 3.9 12.16 12.16 0 0 1-8.83-4.48 4.28 4.28 0 0 0 1.32 5.72 4.25 4.25 0 0 1-1.94-.54v.05a4.28 4.28 0 0 0 3.43 4.2c-.47.13-.97.2-1.48.07a4.28 4.28 0 0 0 4 2.97A8.59 8.59 0 0 1 2 19.54a12.12 12.12 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2l-.01-.56A8.7 8.7 0 0 0 24 5.1a8.52 8.52 0 0 1-2.54.7Z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8h4V23h-4V8Zm7.5 0h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.09V23h-4v-6.65c0-1.59-.03-3.64-2.22-3.64-2.22 0-2.56 1.73-2.56 3.52V23h-4V8Z" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      url: "https://github.com",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.93c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.35-1.3-1.71-1.3-1.71-1.06-.73.08-.72.08-.72 1.18.08 1.8 1.21 1.8 1.21 1.04 1.78 2.74 1.26 3.41.96.1-.75.4-1.26.72-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.5.12-3.12 0 0 .98-.31 3.2 1.19.93-.26 1.93-.39 2.92-.39.99 0 1.99.13 2.92.39 2.22-1.5 3.2-1.19 3.2-1.19.64 1.62.24 2.82.12 3.12.75.81 1.2 1.84 1.2 3.1 0 4.43-2.7 5.4-5.27 5.69.41.35.77 1.05.77 2.12v3.14c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M23.5 7.5s-.23-1.62-.94-2.34c-.9-.94-1.92-.95-2.39-1C16.9 3.9 12 3.9 12 3.9h0s-4.9 0-8.17.26c-.47.05-1.49.06-2.39 1C.73 5.88.5 7.5.5 7.5S.27 9.4.27 11.3v1.38c0 1.9.23 3.79.23 3.79s.23 1.62.94 2.34c.9.94 2.09.9 2.62 1 1.9.18 7.94.24 7.94.24s4.9 0 8.17-.26c.47-.05 1.49-.06 2.39-1 .71-.72.94-2.34.94-2.34s.23-1.9.23-3.79V11.3c0-1.9-.23-3.79-.23-3.79ZM9.8 14.8V7.9l6.2 3.45-6.2 3.45Z" />
        </svg>
      ),
    },
  ];
  return (
    <footer className="mt-12 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-6">
          <div className="flex gap-3 order-2 md:order-1">
            {socials.map((s) => (
              <a
                key={s.name}
                className="px-3 py-2 bg-blue-600/40 hover:bg-blue-500/60 rounded-lg text-sm transition transform hover:-translate-y-0.5 flex items-center gap-2"
                href={s.url}
                target="_blank"
                rel="noreferrer"
              >
                <span className="opacity-90">{s.svg}</span>
                <span className="font-medium">{s.name}</span>
              </a>
            ))}
          </div>
          <div className="order-1 md:order-2 text-center">
            <div className="text-2xl font-extrabold tracking-wide drop-shadow-sm">
              Contact Us
            </div>
            <div className="mt-2 text-blue-100 text-sm animate-pulse [animation-duration:3s]">
              We'd love to hear from you
            </div>
          </div>
          <div className="order-3">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-blue-400/30 p-4 shadow-lg hover:shadow-xl transition">
              <div className="text-blue-100 text-sm">Phone</div>
              <div className="text-white font-semibold">7671879587</div>
              <div className="mt-3 text-blue-100 text-sm">Email</div>
              <a
                href="mailto:srujanreddynadipi@gmail.com"
                className="text-white font-semibold hover:underline"
              >
                srujanreddynadipi@gmail.com
              </a>
              <div className="mt-3 text-blue-100 text-sm">Address</div>
              <div className="text-white font-semibold leading-snug">
                Meerpet, Hyderabad
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center border-t border-blue-600/50 pt-4">
          <div className="text-sm text-blue-100">
            © {new Date().getFullYear()} EchoVerse. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}