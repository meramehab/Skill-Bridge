const Footer = () => {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-signal font-display text-sm font-bold">
              S
            </span>
            <span className="font-display text-sm font-semibold text-ink">SkillBridge</span>
          </div>
          <p className="text-xs text-muted">
            تُأهّل، تُوثّق، ثم تُوظّف — منصة العمل الحر والتأهيل الأكاديمي للطلاب الجامعيين.
          </p>
          <p className="text-xs text-muted">© {new Date().getFullYear()} SkillBridge</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
