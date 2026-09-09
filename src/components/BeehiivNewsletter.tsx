import { useCallback, useEffect, useRef, useState } from "react";

const BEEHIIV_FORM_ID = "ac8b9c5b-b9e5-4ae2-b4e9-7c0750aa897b";
const BEEHIIV_LOADER = "https://subscribe-forms.beehiiv.com/v3/loader.js";
const POPUP_DELAY_MS = 2000;

const SUCCESS_KEYWORDS = ["thank you", "merci", "subscribed", "you're in", "check your email", "confirm your email"];

function hasFormContent(container: HTMLElement) {
  return container.querySelector("iframe, form, input, button") !== null;
}

function looksLikeSuccess(container: HTMLElement) {
  const text = container.textContent?.toLowerCase() ?? "";
  return SUCCESS_KEYWORDS.some((keyword) => text.includes(keyword));
}

export default function BeehiivNewsletter() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTrigger, setShowTrigger] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const formDetectedRef = useRef(false);
  const autoOpenedRef = useRef(false);
  const delayReadyRef = useRef(false);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    setShowTrigger(true);
  }, []);

  const openPopup = useCallback(() => {
    setIsOpen(true);
  }, []);

  const tryAutoOpen = useCallback(() => {
    if (autoOpenedRef.current || !delayReadyRef.current || !formReady) return;
    autoOpenedRef.current = true;
    setIsOpen(true);
  }, [formReady]);

  useEffect(() => {
    const container = formRef.current;
    if (!container || scriptLoadedRef.current) return;

    const preloadLink = document.createElement("link");
    preloadLink.rel = "preload";
    preloadLink.as = "script";
    preloadLink.href = BEEHIIV_LOADER;
    document.head.appendChild(preloadLink);

    const script = document.createElement("script");
    script.src = BEEHIIV_LOADER;
    script.async = true;
    script.setAttribute("data-beehiiv-form", BEEHIIV_FORM_ID);
    container.appendChild(script);
    scriptLoadedRef.current = true;

    return () => {
      preloadLink.remove();
    };
  }, []);

  useEffect(() => {
    const container = formRef.current;
    if (!container) return;

    const observer = new MutationObserver(() => {
      if (!formDetectedRef.current && hasFormContent(container)) {
        formDetectedRef.current = true;
        setFormReady(true);
        return;
      }

      if (formDetectedRef.current && isOpen && looksLikeSuccess(container)) {
        closePopup();
      }
    });

    if (hasFormContent(container)) {
      formDetectedRef.current = true;
      setFormReady(true);
    }

    observer.observe(container, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, [closePopup, isOpen]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      delayReadyRef.current = true;
      tryAutoOpen();
    }, POPUP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [tryAutoOpen]);

  useEffect(() => {
    tryAutoOpen();
  }, [formReady, tryAutoOpen]);

  return (
    <>
      <div
        className={isOpen ? "newsletter-overlay newsletter-overlay--open" : "newsletter-overlay newsletter-overlay--preload"}
        onClick={isOpen ? closePopup : undefined}
        aria-hidden={!isOpen}
      >
        <div
          className="newsletter-popup"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal={isOpen}
          aria-label="Inscription à la newsletter"
        >
          {isOpen && (
            <button type="button" className="newsletter-close" onClick={closePopup} aria-label="Fermer">
              ×
            </button>
          )}
          {isOpen && !formReady && <p className="newsletter-loading">Chargement du formulaire…</p>}
          <div className={`beehiiv-form${formReady ? " beehiiv-form--ready" : ""}`} ref={formRef} />
        </div>
      </div>

      {showTrigger && !isOpen && (
        <button type="button" className="newsletter-trigger" onClick={openPopup}>
          S&apos;abonner à ma newsletter
        </button>
      )}
    </>
  );
}
