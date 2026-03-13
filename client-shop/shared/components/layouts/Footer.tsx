export function Footer() {
  return (
    <footer className="border-t border-green-400/10 bg-neutral-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-white font-bold mb-3 text-sm tracking-wider uppercase">For Developers</h4>
          <ul className="space-y-2.5 text-sm text-neutral-400">
            <li><a href="#" className="hover:text-green-400 transition-colors">API Documentation</a></li>
            <li><a href="#" className="hover:text-green-400 transition-colors">Asset Integration Guide</a></li>
            <li><a href="#" className="hover:text-green-400 transition-colors">Licensing & Usage Rights</a></li>
            <li><a href="#" className="hover:text-green-400 transition-colors">SDK & Tools</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3 text-sm tracking-wider uppercase">Resources</h4>
          <ul className="space-y-2.5 text-sm text-neutral-400">
            <li><a href="#" className="hover:text-green-400 transition-colors">Sprite Format Reference</a></li>
            <li><a href="#" className="hover:text-green-400 transition-colors">Export Options</a></li>
            <li><a href="#" className="hover:text-green-400 transition-colors">Game Engine Plugins</a></li>
            <li><a href="#" className="hover:text-green-400 transition-colors">Community Forum</a></li>
          </ul>
        </div>

        <div className="sm:col-span-2 md:col-span-1">
          <h4 className="text-white font-bold mb-3 text-sm tracking-wider uppercase">Pixelism</h4>
          <p className="text-sm text-neutral-400 leading-relaxed mb-4">
            A curated pixel art marketplace built for indie developers and creative studios.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-950/40 border border-green-400/20 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-300 text-xs">Open to contributors</span>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800 px-4 sm:px-6 py-4 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-xs text-neutral-600">© 2025 Pixelism. All rights reserved.</p>
        <div className="flex gap-4 text-xs text-neutral-600">
          <a href="#" className="hover:text-neutral-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-neutral-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-neutral-400 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}