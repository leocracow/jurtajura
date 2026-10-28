/* Jurta Jura — interakcje (czysty JS, bez zależności) */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Teksty interfejsu zależne od języka strony (<html lang="...">) */
  var LANG = (document.documentElement.lang || "pl").toLowerCase().slice(0, 2);
  var STRINGS = {
    pl: {
      openMenu: "Otwórz menu",
      closeMenu: "Zamknij menu",
      formError: "Uzupełnij imię, poprawny e-mail i treść wiadomości.",
      formSent: "Otwieramy Twój program pocztowy… Jeśli się nie uruchomił, napisz na kontakt@jurtajura.pl",
      subject: "Zapytanie ze strony — ",
      fName: "Imię",
      fEmail: "E-mail",
      fPhone: "Telefon",
      lightboxLabel: "Podgląd zdjęcia",
      close: "Zamknij",
      prev: "Poprzednie zdjęcie",
      next: "Następne zdjęcie",
      reviewOf: function (i, n) { return "Opinia " + i + " z " + n; },
      ckTitle: "Korzystamy z plików cookie",
      ckText: "Używamy plików niezbędnych do działania strony, a za Twoją zgodą także analitycznych i marketingowych, by wiedzieć, jak korzystacie z serwisu.",
      ckAll: "Akceptuję wszystkie",
      ckNec: "Tylko niezbędne",
      ckPolicy: "Polityka prywatności",
      ckLabel: "Zgoda na pliki cookie"
    },
    en: {
      openMenu: "Open menu",
      closeMenu: "Close menu",
      formError: "Please enter your name, a valid email address and a message.",
      formSent: "Opening your email app… If nothing happens, write to kontakt@jurtajura.pl",
      subject: "Website enquiry — ",
      fName: "Name",
      fEmail: "Email",
      fPhone: "Phone",
      lightboxLabel: "Photo preview",
      close: "Close",
      prev: "Previous photo",
      next: "Next photo",
      reviewOf: function (i, n) { return "Review " + i + " of " + n; },
      ckTitle: "We use cookies",
      ckText: "We use essential cookies to run the site, and — with your consent — analytics and marketing cookies to understand how the site is used.",
      ckAll: "Accept all",
      ckNec: "Essential only",
      ckPolicy: "Privacy policy",
      ckLabel: "Cookie consent"
    },
    de: {
      openMenu: "Menü öffnen",
      closeMenu: "Menü schließen",
      formError: "Bitte gib deinen Namen, eine gültige E-Mail-Adresse und eine Nachricht ein.",
      formSent: "Wir öffnen dein E-Mail-Programm… Falls nichts passiert, schreib an kontakt@jurtajura.pl",
      subject: "Anfrage über die Website — ",
      fName: "Name",
      fEmail: "E-Mail",
      fPhone: "Telefon",
      lightboxLabel: "Fotovorschau",
      close: "Schließen",
      prev: "Vorheriges Foto",
      next: "Nächstes Foto",
      reviewOf: function (i, n) { return "Bewertung " + i + " von " + n; },
      ckTitle: "Wir verwenden Cookies",
      ckText: "Wir nutzen notwendige Cookies für den Betrieb der Seite und — mit deiner Zustimmung — Analyse- und Marketing-Cookies, um zu verstehen, wie die Seite genutzt wird.",
      ckAll: "Alle akzeptieren",
      ckNec: "Nur notwendige",
      ckPolicy: "Datenschutzerklärung",
      ckLabel: "Cookie-Einwilligung"
    },
    uk: {
      openMenu: "Відкрити меню",
      closeMenu: "Закрити меню",
      formError: "Вкажи ім’я, правильну адресу e-mail і текст повідомлення.",
      formSent: "Відкриваємо твою поштову програму… Якщо нічого не сталося, напиши на kontakt@jurtajura.pl",
      subject: "Запит із сайту — ",
      fName: "Ім’я",
      fEmail: "E-mail",
      fPhone: "Телефон",
      lightboxLabel: "Перегляд фото",
      close: "Закрити",
      prev: "Попереднє фото",
      next: "Наступне фото",
      reviewOf: function (i, n) { return "Відгук " + i + " з " + n; },
      ckTitle: "Ми використовуємо файли cookie",
      ckText: "Ми використовуємо файли cookie, необхідні для роботи сайту, а за твоєї згоди — також аналітичні та маркетингові, щоб розуміти, як люди користуються сайтом.",
      ckAll: "Прийняти всі",
      ckNec: "Лише необхідні",
      ckPolicy: "Політика конфіденційності",
      ckLabel: "Згода на файли cookie"
    }
  };
  var T = STRINGS[LANG] || STRINGS.pl;

  /* ------------------------------------------------------------------
     Baner zgód — sterowanie GTM przez Google Consent Mode v2
     ------------------------------------------------------------------ */
  (function () {
    var KLUCZ = "jj-consent";
    var EN_PAGE = document.documentElement.lang.toLowerCase().indexOf("en") === 0;
    var polityka = EN_PAGE
      ? "https://jurtajura.pl/polityka-prywatnosci/"
      : "https://jurtajura.pl/polityka-prywatnosci/";

    function zapisz(all) {
      try {
        localStorage.setItem(KLUCZ, JSON.stringify({ all: all, ts: Date.now() }));
      } catch (e) {}
      var s = all ? "granted" : "denied";
      // gtag zdefiniowany w <head> przed GTM
      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          ad_storage: s,
          ad_user_data: s,
          ad_personalization: s,
          analytics_storage: s,
          functionality_storage: s,
          personalization_storage: s
        });
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "consent_update",
        consent_state: all ? "all" : "necessary"
      });
    }

    var banner = null;

    function zbuduj() {
      if (banner) return banner;
      banner = document.createElement("div");
      banner.className = "cookie-banner";
      banner.setAttribute("role", "dialog");
      banner.setAttribute("aria-live", "polite");
      banner.setAttribute("aria-label", T.ckLabel);
      banner.innerHTML =
        '<div class="cookie-body">' +
        '<p class="cookie-title">' + T.ckTitle + "</p>" +
        '<p class="cookie-text">' + T.ckText +
        ' <a href="' + polityka + '" rel="noopener" target="_blank">' + T.ckPolicy + "</a>.</p>" +
        "</div>" +
        '<div class="cookie-actions">' +
        '<button type="button" class="btn btn-outline cookie-nec">' + T.ckNec + "</button>" +
        '<button type="button" class="btn btn-solid cookie-all">' + T.ckAll + "</button>" +
        "</div>";
      document.body.appendChild(banner);

      banner.querySelector(".cookie-all").addEventListener("click", function () {
        zapisz(true);
        ukryj();
      });
      banner.querySelector(".cookie-nec").addEventListener("click", function () {
        zapisz(false);
        ukryj();
      });
      return banner;
    }

    function pokaz() {
      zbuduj();
      requestAnimationFrame(function () {
        banner.classList.add("is-shown");
      });
    }

    function ukryj() {
      if (!banner) return;
      banner.classList.remove("is-shown");
      setTimeout(function () {
        if (banner) banner.setAttribute("hidden", "");
      }, 400);
    }

    var zapisane = null;
    try {
      zapisane = localStorage.getItem(KLUCZ);
    } catch (e) {}

    if (!zapisane) setTimeout(pokaz, 900);

    // ponowne otwarcie z linku w stopce
    document.querySelectorAll("[data-cookie-settings]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        zbuduj().removeAttribute("hidden");
        pokaz();
      });
    });
  })();

  /* ------------------------------------------------------------------
     Strona podziękowania — zdarzenie purchase do GTM
     Parametry czyta z adresu, np.:
     /dziekujemy/?sid={CHECKOUT_SESSION_ID}&pkg=voucher800&value=800
     UWAGA: parametr nazywa się "sid", bo zapora hostingu (mod_security)
     odrzuca każdy URL zawierający nazwę "session_id" kodem 403.
     ------------------------------------------------------------------ */
  if (document.body.hasAttribute("data-purchase")) {
    (function () {
      var q = new URLSearchParams(location.search);
      var id = q.get("sid") || q.get("session_id") || q.get("transaction_id") || "";
      var wartosc = parseFloat(q.get("value"));
      var pakiet = q.get("pkg") || "voucher";

      // ochrona przed podwójnym liczeniem po odświeżeniu strony
      var klucz = "jj-purchase-" + (id || "brak-id");
      try {
        if (sessionStorage.getItem(klucz)) return;
        sessionStorage.setItem(klucz, "1");
      } catch (e) {}

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "purchase",
        ecommerce: {
          transaction_id: id || undefined,
          currency: "PLN",
          value: isNaN(wartosc) ? undefined : wartosc,
          items: [{ item_name: pakiet, price: isNaN(wartosc) ? undefined : wartosc, quantity: 1 }]
        }
      });
    })();
  }

  /* ------------------------------------------------------------------
     Płatność online — zdarzenie begin_checkout do GTM
     ------------------------------------------------------------------ */
  document.querySelectorAll("[data-checkout]").forEach(function (link) {
    link.addEventListener("click", function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "begin_checkout",
        currency: "PLN",
        value: parseFloat(link.getAttribute("data-price")) || undefined,
        items: [{ item_name: link.getAttribute("data-checkout") }]
      });
    });
  });

  /* ------------------------------------------------------------------
     Header: tło po przewinięciu
     ------------------------------------------------------------------ */
  var header = document.querySelector("[data-header]");

  function onScrollHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  if (header) {
    onScrollHeader();
    window.addEventListener("scroll", onScrollHeader, { passive: true });
  }

  /* ------------------------------------------------------------------
     Nawigacja mobilna
     ------------------------------------------------------------------ */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  function closeNav() {
    document.body.classList.remove("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", T.openMenu);
    }
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? T.closeMenu : T.openMenu);
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ------------------------------------------------------------------
     Reveal on scroll (z delikatnym stopniowaniem w grupach)
     ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length && "IntersectionObserver" in window && !reducedMotion) {
    document.querySelectorAll("[data-stagger]").forEach(function (group) {
      var children = group.querySelectorAll(".reveal");
      children.forEach(function (el, i) {
        el.style.transitionDelay = Math.min(i * 90, 450) + "ms";
      });
    });

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          /* Element wyższy niż ok. 10× okno (np. długi artykuł) nigdy nie osiągnie 10% widoczności —
             pokazujemy go od pierwszego piksela, inaczej zostałby przezroczysty. */
          var okno = entry.rootBounds ? entry.rootBounds.height : window.innerHeight;
          var zaWysoki = entry.boundingClientRect.height * 0.1 > okno;
          if (entry.intersectionRatio >= 0.1 || zaWysoki) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: [0, 0.1] }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ------------------------------------------------------------------
     FAQ — akordeon
     ------------------------------------------------------------------ */
  document.querySelectorAll("[data-faq] .faq-question").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var isOpen = item.classList.contains("is-open");

      var container = btn.closest("[data-faq]");
      container.querySelectorAll(".faq-item.is-open").forEach(function (openItem) {
        openItem.classList.remove("is-open");
        openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ------------------------------------------------------------------
     Hero slider — przenikanie kadrów z efektem Kena Burnsa
     ------------------------------------------------------------------ */
  var heroSlider = document.querySelector("[data-hero-slider]");

  if (heroSlider) {
    var slides = Array.prototype.slice.call(heroSlider.querySelectorAll(".hero-slide"));

    if (slides.length > 1 && !reducedMotion) {
      var currentSlide = 0;
      var SLIDE_TIME = 7000;
      var heroTimer = null;

      function showSlide(index) {
        slides[currentSlide].classList.remove("is-active");
        currentSlide = (index + slides.length) % slides.length;
        var next = slides[currentSlide];
        // reset transformacji, żeby Ken Burns zaczynał od nowa przy każdym pokazaniu
        var img = next.querySelector("img");
        img.style.transition = "none";
        void img.offsetWidth;
        img.style.transition = "";
        next.classList.add("is-active");
      }

      function startHero() {
        if (heroTimer) return;
        heroTimer = setInterval(function () {
          showSlide(currentSlide + 1);
        }, SLIDE_TIME);
      }

      function stopHero() {
        clearInterval(heroTimer);
        heroTimer = null;
      }

      // Nie przewijaj, gdy hero jest poza ekranem albo karta nieaktywna
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) startHero();
          else stopHero();
        }).observe(heroSlider);
      } else {
        startHero();
      }

      document.addEventListener("visibilitychange", function () {
        if (document.hidden) stopHero();
        else if (heroSlider.getBoundingClientRect().bottom > 0) startHero();
      });
    }
  }

  /* ------------------------------------------------------------------
     Formularz kontaktowy — walidacja + wysyłka przez klienta poczty
     ------------------------------------------------------------------ */
  var contactForm = document.querySelector("[data-contact-form]");

  if (contactForm) {
    var status = contactForm.querySelector("[data-form-status]");

    var setError = function (field, on) {
      field.closest(".field").classList.toggle("has-error", on);
    };

    contactForm.addEventListener("input", function (e) {
      if (e.target.closest(".field.has-error")) setError(e.target, false);
    });

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = contactForm.name;
      var email = contactForm.email;
      var phone = contactForm.phone;
      var message = contactForm.message;
      var valid = true;

      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

      [
        [name, name.value.trim().length > 1],
        [email, emailOk],
        [message, message.value.trim().length > 2]
      ].forEach(function (pair) {
        var ok = pair[1];
        setError(pair[0], !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        status.textContent = T.formError;
        status.className = "form-status is-error";
        var firstError = contactForm.querySelector(".field.has-error input, .field.has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      var body =
        T.fName + ": " + name.value.trim() + "\n" +
        T.fEmail + ": " + email.value.trim() + "\n" +
        T.fPhone + ": " + (phone.value.trim() || "—") + "\n\n" +
        message.value.trim();

      var mailto =
        "mailto:kontakt@jurtajura.pl" +
        "?subject=" + encodeURIComponent(T.subject + name.value.trim()) +
        "&body=" + encodeURIComponent(body);

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "generate_lead", form_name: "contact" });
      window.location.href = mailto;

      status.textContent = T.formSent;
      status.className = "form-status is-success";
      contactForm.reset();
    });
  }

  /* ------------------------------------------------------------------
     Slider opinii (scroll-snap + kropki + auto-przewijanie)
     ------------------------------------------------------------------ */
  document.querySelectorAll("[data-slider]").forEach(function (slider) {
    var track = slider.querySelector("[data-slider-track]");
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = slider.querySelector("[data-slider-dots]");
    var prevBtn = slider.querySelector("[data-slider-prev]");
    var nextBtn = slider.querySelector("[data-slider-next]");
    if (!track || slides.length < 2) return;

    var current = 0;
    var autoTimer = null;

    var dots = slides.map(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "slider-dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", T.reviewOf(i + 1, slides.length));
      dot.addEventListener("click", function () {
        goTo(i);
        restartAuto();
      });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function goTo(index) {
      var target = (index + slides.length) % slides.length;
      track.scrollTo({ left: slides[target].offsetLeft - track.offsetLeft, behavior: reducedMotion ? "auto" : "smooth" });
    }

    function setActive(index) {
      if (index === current) return;
      current = index;
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    var scrollRaf = null;
    track.addEventListener(
      "scroll",
      function () {
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(function () {
          scrollRaf = null;
          setActive(Math.round(track.scrollLeft / track.clientWidth));
        });
      },
      { passive: true }
    );

    prevBtn.addEventListener("click", function () {
      goTo(current - 1);
      restartAuto();
    });
    nextBtn.addEventListener("click", function () {
      goTo(current + 1);
      restartAuto();
    });

    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(current - 1);
        restartAuto();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(current + 1);
        restartAuto();
      }
    });

    function stopAuto() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function startAuto() {
      if (reducedMotion || autoTimer) return;
      autoTimer = setInterval(function () {
        goTo(current + 1);
      }, 6500);
    }

    function restartAuto() {
      stopAuto();
      startAuto();
    }

    slider.addEventListener("mouseenter", stopAuto);
    slider.addEventListener("mouseleave", startAuto);
    slider.addEventListener("focusin", stopAuto);
    slider.addEventListener("focusout", startAuto);
    track.addEventListener("touchstart", stopAuto, { passive: true });
    track.addEventListener("touchend", restartAuto, { passive: true });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) startAuto();
        else stopAuto();
      }).observe(slider);
    } else {
      startAuto();
    }
  });

  /* ------------------------------------------------------------------
     Lightbox galerii
     ------------------------------------------------------------------ */
  // lightbox obsługuje galerie oraz pojedyncze zdjęcia oznaczone [data-zoom] (np. mapa)
  var galleryItems = Array.prototype.slice.call(
    document.querySelectorAll("[data-gallery] .gallery-item, [data-zoom]")
  );

  if (galleryItems.length) {
    var lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", T.lightboxLabel);
    lightbox.innerHTML =
      '<button class="lb-btn lb-close" aria-label="' + T.close + '">✕</button>' +
      '<button class="lb-btn lb-prev" aria-label="' + T.prev + '">←</button>' +
      '<button class="lb-btn lb-next" aria-label="' + T.next + '">→</button>' +
      "<figure><img src='' alt=''><figcaption></figcaption></figure>";
    document.body.appendChild(lightbox);

    var lbImg = lightbox.querySelector("img");
    var lbCaption = lightbox.querySelector("figcaption");
    var current = 0;
    var lastFocused = null;

    function showSlide(index) {
      current = (index + galleryItems.length) % galleryItems.length;
      var item = galleryItems[current];
      var thumb = item.querySelector("img");
      lbImg.src = item.getAttribute("data-full") || thumb.src;
      lbImg.alt = thumb.alt;
      lbCaption.textContent = thumb.alt;
    }

    function openLightbox(index) {
      lastFocused = document.activeElement;
      showSlide(index);
      lightbox.classList.add("is-active");
      document.body.style.overflow = "hidden";
      lightbox.querySelector(".lb-close").focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("is-active");
      document.body.style.overflow = "";
      lbImg.src = "";
      if (lastFocused) lastFocused.focus();
    }

    galleryItems.forEach(function (item, i) {
      item.addEventListener("click", function () {
        openLightbox(i);
      });
    });

    lightbox.querySelector(".lb-close").addEventListener("click", closeLightbox);
    lightbox.querySelector(".lb-prev").addEventListener("click", function () {
      showSlide(current - 1);
    });
    lightbox.querySelector(".lb-next").addEventListener("click", function () {
      showSlide(current + 1);
    });

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.tagName === "FIGURE") closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-active")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showSlide(current - 1);
      if (e.key === "ArrowRight") showSlide(current + 1);
    });

    var touchStartX = 0;
    lightbox.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.changedTouches[0].clientX;
      },
      { passive: true }
    );
    lightbox.addEventListener(
      "touchend",
      function (e) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) showSlide(dx > 0 ? current - 1 : current + 1);
      },
      { passive: true }
    );
  }
})();

/* ======================================================================
   Pomiar zdarzeń (GTM → GA4) i leniwe ładowanie widżetu rezerwacji IdoBooking
   ====================================================================== */
(function () {
  "use strict";

  var dl = (window.dataLayer = window.dataLayer || []);

  function miejsce(el) {
    var s = el.closest("section[id], header, footer, .sticky-cta");
    if (!s) return "strona";
    return s.id || (s.className ? String(s.className).split(" ")[0] : s.tagName.toLowerCase());
  }

  /* Zdarzenia konwersji: telefon, e-mail, klik „Zarezerwuj”, wyszukanie terminu, przejście do płatności Stripe */
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    var btn = t.closest("#iai_book_form button");
    if (btn) {
      var od = document.getElementById("iai_booking_date_from");
      var doo = document.getElementById("iai_booking_date_to");
      dl.push({
        event: "booking_widget_search",
        booking_date_from: od ? od.value : "",
        booking_date_to: doo ? doo.value : "",
        link_location: miejsce(btn)
      });
      return;
    }

    var a = t.closest("a");
    if (!a) return;
    var href = a.getAttribute("href") || "";

    if (href.indexOf("tel:") === 0) {
      dl.push({ event: "phone_click", phone_number: href.slice(4), link_location: miejsce(a) });
    } else if (href.indexOf("mailto:") === 0) {
      dl.push({ event: "email_click", link_location: miejsce(a) });
    } else if (href.indexOf("buy.stripe.com") !== -1 && !a.hasAttribute("data-checkout")) {
      var karta = a.closest(".amount");
      var kw = karta && karta.querySelector(".amount-value strong");
      var cena = kw ? parseFloat(kw.textContent.replace(/[^\d]/g, "")) : NaN;
      dl.push({
        event: "begin_checkout",
        currency: "PLN",
        value: isNaN(cena) ? undefined : cena,
        items: [{ item_name: isNaN(cena) ? "voucher" : "voucher-" + cena }],
        link_location: miejsce(a)
      });
    } else if (/#(rezerwuj|rezerwacja|booking|buchung|sprawdz-termin)$/.test(href) ||
               a.classList.contains("btn-book") || a.classList.contains("btn-header")) {
      dl.push({
        event: "reserve_click",
        link_text: (a.textContent || "").trim().slice(0, 40),
        link_location: miejsce(a)
      });
    }
  }, true);

  /* Widżet dat IdoBooking na podstronach — ładowany dopiero, gdy sekcja zbliża się do ekranu */
  var KLIENT = 59954, WERSJA = "1785306414", HOST = "https://client59954.idobooking.com";
  var KALENDARZ = {
    en: {
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      days: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    },
    de: {
      months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
      days: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
    },
    uk: {
      months: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
      days: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
    }
  };

  function wczytaj(src, po) {
    var s = document.createElement("script");
    s.src = src;
    s.onload = po;
    document.head.appendChild(s);
  }

  function uruchom(box) {
    if (box.getAttribute("data-ido-started")) return;
    box.setAttribute("data-ido-started", "1");
    wczytaj(HOST + "/widget/script/loadScriptsForOwnPage?" + WERSJA, function () {
      wczytaj(HOST + "/template/widget/js/widget_booking.js?" + WERSJA, function () {
        if (typeof window.iai_booking_search !== "function") return;
        var kal = KALENDARZ[box.getAttribute("data-ido-locale")] || {};
        var cfg = {
          clientId: KLIENT,
          lang: parseInt(box.getAttribute("data-ido-lang"), 10) || 1,
          mainColor: "#2b2315",
          button: box.getAttribute("data-ido-button") || "Zarezerwuj"
        };
        if (kal.months) cfg.months = kal.months;
        if (kal.days) cfg.days = kal.days;
        window.iai_booking_search(cfg);
        var od = document.getElementById("iai_booking_date_from");
        var doo = document.getElementById("iai_booking_date_to");
        if (od) od.placeholder = box.getAttribute("data-ido-from") || "";
        if (doo) doo.placeholder = box.getAttribute("data-ido-to") || "";
      });
    });
  }

  var pola = document.querySelectorAll("[data-ido]");
  if (pola.length) {
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function (wpisy) {
        wpisy.forEach(function (w) {
          if (w.isIntersecting) {
            obs.unobserve(w.target);
            uruchom(w.target);
          }
        });
      }, { rootMargin: "600px 0px" });
      pola.forEach(function (p) { obs.observe(p); });
    } else {
      pola.forEach(uruchom);
    }
  }
})();
