const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const revealItems = document.querySelectorAll(".reveal");
const testimonials = Array.from(document.querySelectorAll(".testimonial"));
const prevTestimonial = document.querySelector("[data-testimonial-prev]");
const nextTestimonial = document.querySelector("[data-testimonial-next]");
const cookieBanner = document.querySelector("[data-cookie-banner]");
const cookieAccept = document.querySelector("[data-cookie-accept]");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

if (window.lucide) {
  window.lucide.createIcons();
}

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 18);
});

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

let testimonialIndex = 0;

function showTestimonial(index) {
  testimonials.forEach((item, itemIndex) => {
    item.classList.toggle("active", itemIndex === index);
  });
}

function moveTestimonial(direction) {
  testimonialIndex = (testimonialIndex + direction + testimonials.length) % testimonials.length;
  showTestimonial(testimonialIndex);
}

prevTestimonial?.addEventListener("click", () => moveTestimonial(-1));
nextTestimonial?.addEventListener("click", () => moveTestimonial(1));
setInterval(() => moveTestimonial(1), 6500);

if (!localStorage.getItem("dc_cookie_consent")) {
  cookieBanner?.classList.add("show");
}

cookieAccept?.addEventListener("click", () => {
  localStorage.setItem("dc_cookie_consent", "accepted");
  cookieBanner?.classList.remove("show");
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const nome = String(formData.get("nome") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const telefone = String(formData.get("telefone") || "").trim();
  const mensagem = String(formData.get("mensagem") || "").trim();

  if (!nome || !email || !telefone || !mensagem) {
    formStatus.textContent = "Preencha todos os campos para enviar sua mensagem.";
    return;
  }

  const text = encodeURIComponent(
    `Olá Dr. Denis, gostaria de agendar uma consulta jurídica.\n\nNome: ${nome}\nE-mail: ${email}\nTelefone: ${telefone}\n\nMensagem:\n${mensagem}`
  );

  formStatus.textContent = "Abrindo o WhatsApp para concluir o envio.";
  window.open(`https://wa.me/5564999452151?text=${text}`, "_blank", "noopener");
});
