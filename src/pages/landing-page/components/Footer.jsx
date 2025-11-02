export function Footer() {
  return (
    <footer className="border-t bg-white border-border/40 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/generated-image%20%281%29%20%281%29-Photoroom-oGINi2MHzxnWabVUBKhqC6yv7Cfmmp.png"
                alt="Spectra"
                width={140}
                height={46}
                className="h-9 w-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Real-time analytics for the physical world.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Use Cases
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Spectra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
