const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-12">
      <div className="container px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-display text-lg font-bold text-gradient-gold tracking-wider">
          SF TECHNOLOGY
        </div>
        <p className="text-xs text-muted-foreground">
          © 2026 SF Technology. Бүх эрх хуулиар хамгаалагдсан.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-xs text-muted-foreground hover:text-primary transition-colors font-display tracking-wider">
            Facebook
          </a>
          <a
            href="#"
            className="text-xs text-muted-foreground hover:text-primary transition-colors font-display tracking-wider">
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
