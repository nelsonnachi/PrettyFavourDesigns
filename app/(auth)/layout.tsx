import React from "react";

const AuthLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#faf7f1]">
      {/* ======================================================
          DECORATIVE BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-36 -top-36 size-[360px] rounded-full border border-[#e85d22]/10 sm:-left-32 sm:-top-32 sm:size-[420px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 size-[260px] rounded-full bg-[#e85d22]/[0.04] sm:-left-20 sm:-top-20 sm:size-[300px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-44 -right-44 size-[440px] rounded-full border border-[#211b17]/[0.06] sm:-bottom-40 sm:-right-40 sm:size-[520px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 size-[300px] rounded-full bg-[#eee6da]/60 sm:-bottom-20 sm:-right-20 sm:size-[360px]"
      />

      {/* ======================================================
          TOP BRAND
      ====================================================== */}

      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-[1440px] justify-center px-5 py-6 sm:px-8 sm:py-7">
          <div className="text-center">
            <div className="font-serif text-[23px] font-semibold tracking-[0.12em] text-[#211b17] sm:text-[24px]">
              SHOPPFD
            </div>

            <div className="mt-1 text-[8px] font-medium uppercase tracking-[0.28em] text-[#756a60]">
              Bags · Aesthetics
            </div>
          </div>
        </div>
      </header>

      {/* ======================================================
          AUTH CONTENT
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pb-10 pt-32 sm:px-8 sm:pb-12 sm:pt-36">
        <div className="w-full max-w-[430px]">
          {/* ==================================================
              INTRO
          ================================================== */}

          <div className="mb-7 text-center sm:mb-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#e85d22] sm:tracking-[0.28em]">
              Welcome to SHOPPFD
            </p>

            <h1 className="mt-3 font-serif text-[2.25rem] font-medium leading-tight tracking-[-0.04em] text-[#211b17] sm:text-5xl">
              Your space.
            </h1>

            <p className="mx-auto mt-3 max-w-[340px] text-sm leading-6 text-[#756a60] sm:max-w-sm">
              Sign in to continue shopping, manage your orders,
              and keep your favourite pieces close.
            </p>
          </div>

          {/* ==================================================
              CLERK CARD
          ================================================== */}

          <div className="w-full overflow-hidden border border-[#e6ddd1] bg-[#fffdf9] p-3 shadow-[0_20px_60px_rgba(33,27,23,0.06)] sm:p-5">
            {children}
          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <p className="mt-6 text-center text-[9px] uppercase tracking-[0.14em] text-[#9a8f85] sm:mt-7 sm:tracking-[0.16em]">
            Crafted with care · SHOPPFD
          </p>
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;