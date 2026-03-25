'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  AtSign,
  ChevronRight,
  Link as LinkIcon,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  X,
} from 'lucide-react';

// --- CONFIGURACIÓN DE ESTILOS GLOBALES Y FUENTES ---
const globalStyles = `
  :root {
    --nimbus-red: #E3241B;
    --nimbus-blue: #131F2F;
    --nimbus-black: #0A0A0A;
    --nimbus-white: #F8F9FA;
  }

  body {
    font-family: var(--font-inter), ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
    background-color: var(--nimbus-black);
    color: var(--nimbus-white);
    overflow-x: hidden;
  }

  .font-stencil {
    font-family: var(--font-anton), ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  .text-shadow-grunge {
    text-shadow: 4px 4px 0px rgba(0,0,0,0.8);
  }

  .bg-halftone {
    background-image: radial-gradient(circle, #000 2px, transparent 2.5px);
    background-size: 10px 10px;
  }

  .img-grunge {
    filter: grayscale(100%) contrast(130%) brightness(90%);
    mix-blend-mode: multiply;
  }
  
  .img-grunge-light {
    filter: grayscale(100%) contrast(120%);
    transition: filter 250ms ease, opacity 250ms ease;
  }

  /* Servicios: por default la imagen se ve tenue (pero visible). En hover: full color y más clara */
  .service-card .service-img {
    filter: grayscale(100%) contrast(120%) brightness(70%);
    opacity: 0.35;
    transition: filter 250ms ease, opacity 250ms ease, transform 700ms ease;
  }
  .service-card:hover .service-img,
  .service-card:focus-within .service-img,
  .service-card:active .service-img {
    filter: none;
    opacity: 1;
  }

  /* Overlays de servicios: en hover bajamos el oscurecimiento para ver la imagen */
  .service-card .service-halftone {
    opacity: 0.16;
    transition: opacity 250ms ease;
  }
  .service-card:hover .service-halftone,
  .service-card:focus-within .service-halftone,
  .service-card:active .service-halftone {
    opacity: 0.04;
  }
  .service-card .service-gradient {
    /* Oscurece principalmente abajo para que el texto sea legible, sin “matar” la foto arriba */
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.90) 0%,
      rgba(0, 0, 0, 0.55) 35%,
      rgba(0, 0, 0, 0.15) 65%,
      rgba(0, 0, 0, 0) 100%
    );
    transition: background 250ms ease;
  }
  .service-card:hover .service-gradient,
  .service-card:focus-within .service-gradient,
  .service-card:active .service-gradient {
    /* En hover/touch: mucho más claro para que la imagen se vea full-color */
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.55) 0%,
      rgba(0, 0, 0, 0.25) 35%,
      rgba(0, 0, 0, 0.05) 65%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  /* En tarjetas de experiencia, al hover queremos ver la imagen a color, sin filtros */
  .case-card:hover .img-grunge-light {
    filter: none;
  }

  /* En tarjetas de servicios, al hover también queremos verla a color (evitar que se apague/negree) */
  .service-card:hover .img-grunge-light {
    filter: none;
  }

  /* Detalle de servicio (página Servicios): mismo comportamiento que cards (tenue -> full color en hover) */
  .service-detail-card .service-detail-img {
    filter: grayscale(100%) contrast(120%) brightness(70%);
    opacity: 0.55;
    transition: filter 250ms ease, opacity 250ms ease, transform 700ms ease;
  }
  .service-detail-card:hover .service-detail-img,
  .service-detail-card:focus-within .service-detail-img,
  .service-detail-card:active .service-detail-img {
    filter: none;
    opacity: 1;
  }
  .service-detail-card .service-detail-halftone {
    opacity: 0.20;
    transition: opacity 250ms ease;
  }
  .service-detail-card:hover .service-detail-halftone,
  .service-detail-card:focus-within .service-detail-halftone,
  .service-detail-card:active .service-detail-halftone {
    opacity: 0.08;
  }

  .hover-glitch:hover {
    animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
    color: var(--nimbus-red);
  }

  @keyframes glitch {
    0% { transform: translate(0) }
    20% { transform: translate(-2px, 2px) }
    40% { transform: translate(-2px, -2px) }
    60% { transform: translate(2px, 2px) }
    80% { transform: translate(2px, -2px) }
    100% { transform: translate(0) }
  }

  /* Animación del Carrusel Infinito */
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .carousel-track {
    display: flex;
    width: max-content;
    animation: marquee 35s linear infinite;
  }
  .carousel-track:hover {
    animation-play-state: paused;
  }

  /* Animaciones de Scroll (Scroll Reveal)
     Nota: evitamos transition: all para prevenir efectos bruscos/layout-jank.
  */
  .reveal-up,
  .reveal-down,
  .reveal-left,
  .reveal-right,
  .reveal-scale {
    opacity: 0;
    will-change: transform, opacity;
    transition-property: transform, opacity;
    transition-duration: 700ms;
    transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }

  .reveal-up { transform: translateY(32px); }
  .reveal-down { transform: translateY(-32px); }
  .reveal-left { transform: translateX(-32px); }
  .reveal-right { transform: translateX(32px); }
  .reveal-scale { transform: scale(0.92); }

  .reveal-active {
    opacity: 1 !important;
    transform: translate3d(0,0,0) scale(1) !important;
  }

  /* Respeta preferencias de accesibilidad */
  @media (prefers-reduced-motion: reduce) {
    .reveal-up,
    .reveal-down,
    .reveal-left,
    .reveal-right,
    .reveal-scale {
      transition: none !important;
      transform: none !important;
      opacity: 1 !important;
    }
    .hover-glitch:hover {
      animation: none !important;
    }
    .carousel-track {
      animation: none !important;
    }
  }

  /* Retrasos escalonados */
  .delay-100 { transition-delay: 100ms; }
  .delay-200 { transition-delay: 200ms; }
  .delay-300 { transition-delay: 300ms; }
  .delay-400 { transition-delay: 400ms; }
  .delay-500 { transition-delay: 500ms; }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: var(--nimbus-black);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--nimbus-red);
  }
`;

// --- RUTAS DE ARCHIVOS (ASSETS Y PLACEHOLDERS) ---
const ASSETS = {
  logos: {
    principal: '/assets/logos/nimbus-logo.webp',
  },
  manchas: {
    roja1: '/assets/manchas-grunge/mancha-roja-01.png',
    roja2: '/assets/manchas-grunge/mancha-roja-02.png',
    roja3: '/assets/manchas-grunge/mancha-roja-03.png',
    azul1: '/assets/manchas-grunge/mancha-azul-01.png',
    negra1: '/assets/manchas-grunge/mancha-negra-01.png',
    negra2: '/assets/manchas-grunge/mancha-negra-02.png',
    decorativa: '/assets/manchas-grunge/mancha-decorativa.png',
  },
  papeles: {
    bordeSuperior: '/assets/papeles-cortados/borde-superior.webp',
    bordeInferior: '/assets/papeles-cortados/borde-inferior.webp',
    pedazo1: '/assets/papeles-cortados/pedazo-01.webp',
  },
  periodicos: {
    texturaFondo: '/assets/recortes-periodicos/textura-01.webp',
    texturaOscura: '/assets/recortes-periodicos/textura-02.webp',
    recorteSuelto: '/assets/recortes-periodicos/recorte-suelto.webp',
  },
  fotos: {
    marketing: '/assets/fotos/marketing.png',
    pr: '/assets/fotos/pr.png',
    eventos: '/assets/fotos/eventos.png',
    stands: '/assets/fotos/stands.png',
    medios: '/assets/fotos/medios.png',
    proyecto1: '/assets/fotos/proyecto-1.png',
    proyecto2: '/assets/fotos/proyecto-2.jpg',
    proyecto3: '/assets/fotos/proyecto-3.jpg',
    proyecto4: '/assets/fotos/proyecto-4.jpg',
  },
  clientes: [
    '/assets/clientes/cliente-01.png',
    '/assets/clientes/cliente-02.png',
    '/assets/clientes/cliente-03.png',
    '/assets/clientes/cliente-04.png',
    '/assets/clientes/cliente-05.png',
    '/assets/clientes/cliente-06.png',
    '/assets/clientes/cliente-07.png',
    '/assets/clientes/cliente-08.png',
    '/assets/clientes/cliente-09.png',
    '/assets/clientes/cliente-10.png',
    '/assets/clientes/cliente-11.png',
    '/assets/clientes/cliente-12.png',
    '/assets/clientes/cliente-13.png',
    '/assets/clientes/cliente-14.png',
    '/assets/clientes/cliente-15.png',
    '/assets/clientes/cliente-16.png',
  ],
  placeholders: {
    servicios: {
      marketing: '/assets/placeholders/servicios/marketing.svg',
      pr: '/assets/placeholders/servicios/pr.svg',
      eventos: '/assets/placeholders/servicios/eventos.svg',
      stands: '/assets/placeholders/servicios/stands.svg',
      medios: '/assets/placeholders/servicios/medios.svg',
    },
  },
};

// --- COMPONENTES UI REUTILIZABLES ---
function SectionTitle({
  title,
  subtitle,
  align = 'left',
  redWordIndex = -1,
}: {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  redWordIndex?: number;
}) {
  const words = title.split(' ');
  return (
    <div className={`mb-12 relative z-10 ${align === 'center' ? 'text-center' : 'text-left'} reveal-up`}>
      <h2 className="text-5xl md:text-7xl font-stencil text-white leading-none">
        {words.map((word, i) => (
          <span key={i} className={i === redWordIndex ? 'text-[color:var(--nimbus-red)]' : ''}>
            {word}{' '}
          </span>
        ))}
      </h2>
      {subtitle && (
        <p className="text-xl md:text-2xl text-gray-400 font-semibold mt-4 max-w-2xl reveal-up delay-100">{subtitle}</p>
      )}
    </div>
  );
}

function ButtonPrimary({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white uppercase tracking-wider bg-[color:var(--nimbus-red)] overflow-hidden transition-all hover:scale-105 ${className}`}
      type="button"
    >
      <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
    </button>
  );
}

function ButtonOutline({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white uppercase tracking-wider border-2 border-white hover:bg-white hover:text-black transition-all ${className}`}
      type="button"
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}

function Home({ setView }: { setView: (id: string) => void }) {
  return (
    <div>
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-[color:var(--nimbus-blue)]">
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-luminosity pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ASSETS.periodicos.texturaFondo}
            alt=""
            className="w-full h-full object-cover object-center transform scale-110"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ASSETS.manchas.roja1}
          alt=""
          className="absolute z-0 right-[-10%] top-[20%] w-[60%] opacity-80 pointer-events-none mix-blend-screen reveal-scale delay-300"
          loading="lazy"
          decoding="async"
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-stencil text-white leading-[0.85] mb-6 text-shadow-grunge reveal-left">
              ESTRATEGIA.<br />
              COMUNICACIÓN.<br />
              <span className="text-[color:var(--nimbus-red)] relative inline-block reveal-left delay-100">
                EXPERIENCIAS.
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ASSETS.manchas.roja2}
                  alt=""
                  className="absolute -top-4 -left-10 w-32 h-32 opacity-50 mix-blend-multiply pointer-events-none"
                  loading="lazy"
                  decoding="async"
                />
              </span>
            </h1>
            <p className="text-xl md:text-3xl text-gray-300 font-semibold max-w-2xl mb-10 border-l-4 border-[color:var(--nimbus-red)] pl-4 reveal-up delay-200">
              Agencia especializada en marketing, relaciones públicas, producción de eventos y posicionamiento estratégico.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 reveal-up delay-300">
              <ButtonPrimary onClick={() => setView('servicios')}>
                Conocer Servicios <ArrowRight size={20} />
              </ButtonPrimary>
              <ButtonOutline onClick={() => window.open('https://wa.me/525535239662', '_blank')}>
                Contactar por WhatsApp
              </ButtonOutline>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[-2px] left-0 w-full z-20 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ASSETS.papeles.bordeInferior}
            alt=""
            className="w-full h-16 md:h-32 object-cover object-top opacity-100"
            style={{ filter: 'brightness(0.04)' }}
            loading="lazy"
            decoding="async"
          />
        </div>
      </section>

      <section className="py-24 bg-[color:var(--nimbus-black)] relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ASSETS.manchas.negra1} alt="" className="absolute top-0 left-0 w-1/3 opacity-20 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: 'ESTRATEGIA',
                desc: 'Construcción de narrativa, análisis de entorno y planeación de campañas.',
                img: ASSETS.manchas.decorativa,
                className: 'reveal-left',
              },
              {
                title: 'PRODUCCIÓN',
                desc: 'Creación de contenido, activaciones, eventos y materiales visuales.',
                img: ASSETS.manchas.negra2,
                className: 'reveal-up delay-100',
              },
              {
                title: 'AMPLIFICACIÓN',
                desc: 'Relaciones públicas, medios, campañas y posicionamiento.',
                img: ASSETS.manchas.azul1,
                className: 'reveal-right delay-200',
              },
            ].map((p) => (
              <div key={p.title} className={`group relative ${p.className}`}>
                <div className="absolute inset-0 bg-[color:var(--nimbus-red)] translate-x-3 translate-y-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative bg-[color:var(--nimbus-blue)] border border-gray-800 p-8 h-full transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1">
                  <h3 className="text-3xl font-stencil mb-4 text-[color:var(--nimbus-red)]">{p.title}</h3>
                  <p className="text-gray-400 text-lg">{p.desc}</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt="" className="absolute bottom-4 right-4 w-16 opacity-30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-black overflow-hidden border-t border-b border-gray-900 relative">
        <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none"></div>
        <div className="container mx-auto px-6 mb-8 relative z-10 text-center reveal-up">
          <h3 className="font-stencil text-xl text-gray-500 tracking-[0.2em]">MARCAS QUE CONFÍAN EN NIMBUS</h3>
        </div>

        <div className="relative w-full overflow-hidden flex z-10 group">
          <div className="carousel-track">
            {ASSETS.clientes.concat(ASSETS.clientes).map((logo, index) => (
              <div
                key={`logo-${index}`}
                className="w-[280px] flex-shrink-0 px-8 grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  alt={`Cliente ${index + 1}`}
                  className="w-full h-auto opacity-50 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[color:var(--nimbus-blue)] relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ASSETS.periodicos.texturaOscura}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay pointer-events-none"
        />
        <div className="container mx-auto px-6 relative z-10">
          <SectionTitle title="NUESTROS SERVICIOS" subtitle="Capacidad estratégica y ejecución de alto nivel." redWordIndex={1} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Marketing Digital', img: ASSETS.fotos.marketing, ph: ASSETS.placeholders.servicios.marketing, delay: '' },
              { name: 'Relaciones Públicas', img: ASSETS.fotos.pr, ph: ASSETS.placeholders.servicios.pr, delay: 'delay-100' },
              { name: 'Eventos', img: ASSETS.fotos.eventos, ph: ASSETS.placeholders.servicios.eventos, delay: 'delay-200' },
              { name: 'Stands', img: ASSETS.fotos.stands, ph: ASSETS.placeholders.servicios.stands, delay: 'delay-300' },
              { name: 'Medios y Exteriores', img: ASSETS.fotos.medios, ph: ASSETS.placeholders.servicios.medios, delay: 'delay-400' },
            ].map((service) => (
              <div
                key={service.name}
                className={`service-card relative h-80 bg-black group overflow-hidden cursor-pointer border border-gray-800 reveal-scale ${service.delay}`}
                onClick={() => setView('servicios')}
              >
                <div className="service-halftone absolute inset-0 bg-halftone z-10"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.img}
                  alt={service.name}
                  className="service-img absolute inset-0 w-full h-full object-cover img-grunge-light group-hover:scale-105 duration-700"
                />

                {/* Placeholder deshabilitado: solo usar si faltan imágenes reales */}

                <div className="service-gradient absolute inset-0 flex flex-col justify-end p-8 z-30">
                  <h3 className="text-4xl md:text-5xl font-stencil text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {service.name}
                  </h3>
                  <span className="text-[color:var(--nimbus-red)] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                    VER MÁS <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider removido: generaba una raya gris/oscura debajo del grid en algunos viewports */}
      </section>

      <section className="py-24 bg-black relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ASSETS.papeles.pedazo1}
          alt=""
          className="absolute top-10 right-10 w-32 opacity-10 pointer-events-none reveal-right"
        />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <SectionTitle title="NUESTRO PROCESO" align="center" redWordIndex={1} />
          <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-4 md:gap-0 mt-16">
            {['DIAGNÓSTICO', 'ESTRATEGIA', 'PRODUCCIÓN', 'ACTIVACIÓN', 'OPTIMIZACIÓN'].map((step, idx) => (
              <React.Fragment key={step}>
                <div className="relative bg-[color:var(--nimbus-blue)] border-2 border-[color:var(--nimbus-red)] w-full md:w-48 h-32 flex items-center justify-center group hover:bg-[color:var(--nimbus-red)] transition-colors reveal-up">
                  <span className="absolute top-2 left-2 font-stencil text-4xl md:text-6xl text-gray-800/50 group-hover:text-black/60 transition-colors pointer-events-none select-none">
                    0{idx + 1}
                  </span>
                  <span className="font-stencil text-2xl text-white z-10 relative">{step}</span>
                </div>
                {idx < 4 && (
                  <div className="hidden md:flex items-center justify-center px-2 text-[color:var(--nimbus-red)] reveal-scale">
                    <ArrowRight size={32} />
                  </div>
                )}
                {idx < 4 && (
                  <div className="md:hidden flex items-center justify-center py-2 text-[color:var(--nimbus-red)]">
                    <ChevronRight size={32} className="rotate-90" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-16 reveal-up delay-500">
            <ButtonOutline onClick={() => setView('metodologia')}>Conocer Metodología Completa</ButtonOutline>
          </div>
        </div>
      </section>

      <section className="py-32 relative bg-[color:var(--nimbus-red)] overflow-hidden text-center flex flex-col items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ASSETS.manchas.roja3}
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover mix-blend-multiply opacity-50 pointer-events-none"
        />
        <div className="relative z-10 px-6">
          <h2 className="text-5xl md:text-8xl font-stencil text-white mb-8 text-shadow-grunge reveal-down">
            CONSTRUYAMOS TU PRÓXIMA ESTRATEGIA.
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center reveal-up delay-200">
            <ButtonOutline
              className="bg-black border-black hover:bg-transparent hover:border-black hover:text-black"
              onClick={() => setView('contacto')}
            >
              Contactar Ahora
            </ButtonOutline>
            <button
              onClick={() => window.open('https://wa.me/525535239662', '_blank')}
              className="flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-white hover:text-black transition-colors underline decoration-2 underline-offset-8"
              type="button"
            >
              <MessageCircle size={24} /> Iniciar chat en WhatsApp
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Servicios({ setView }: { setView: (id: string) => void }) {
  const servicesList = [
    {
      id: 'digital',
      title: 'MARKETING DIGITAL',
      intro: 'Estrategia digital enfocada en posicionamiento y generación de resultados.',
      items: ['Estrategia digital', 'Gestión de redes sociales', 'Producción de contenido', 'Publicidad digital', 'Analítica y optimización'],
      mancha: ASSETS.manchas.roja1,
      foto: ASSETS.fotos.marketing,
      placeholder: ASSETS.placeholders.servicios.marketing,
    },
    {
      id: 'pr',
      title: 'RELACIONES PÚBLICAS',
      intro: 'Gestión de narrativa pública y posicionamiento mediático.',
      items: ['Relación con medios', 'Gestión de entrevistas', 'Construcción de narrativa', 'Manejo de reputación', 'Posicionamiento de voceros'],
      mancha: ASSETS.manchas.negra1,
      foto: ASSETS.fotos.pr,
      placeholder: ASSETS.placeholders.servicios.pr,
    },
    {
      id: 'eventos',
      title: 'EVENTOS',
      intro: 'Producción de experiencias que generan impacto y posicionamiento.',
      items: ['Conceptualización', 'Producción integral', 'Eventos corporativos', 'Activaciones de marca', 'Eventos institucionales'],
      mancha: ASSETS.manchas.azul1,
      foto: ASSETS.fotos.eventos,
      placeholder: ASSETS.placeholders.servicios.eventos,
    },
    {
      id: 'stands',
      title: 'STANDS',
      intro: 'Diseño y producción de espacios para exposiciones y ferias.',
      items: ['Diseño conceptual', 'Producción', 'Montaje', 'Experiencias interactivas', 'Ferias y exposiciones'],
      mancha: ASSETS.manchas.roja2,
      foto: ASSETS.fotos.stands,
      placeholder: ASSETS.placeholders.servicios.stands,
    },
    {
      id: 'medios',
      title: 'MEDIOS Y EXTERIORES',
      intro: 'Planeación estratégica y presencia en medios masivos y digitales.',
      items: ['Planeación de medios', 'Compra de medios', 'Publicidad exterior', 'Campañas OOH', 'Medios digitales'],
      mancha: ASSETS.manchas.negra2,
      foto: ASSETS.fotos.medios,
      placeholder: ASSETS.placeholders.servicios.medios,
    },
  ];

  return (
    <div className="pt-24 bg-black min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <SectionTitle
          title="NUESTROS SERVICIOS"
          subtitle="Nimbus integra estrategia, comunicación, producción y amplificación para construir campañas completas."
          redWordIndex={0}
        />

        <div className="space-y-24 mt-16">
          {servicesList.map((srv, index) => (
            <div
              key={srv.id}
              className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center relative`}
            >
              <div
                className={`service-detail-card w-full md:w-1/2 relative min-h-[400px] bg-[color:var(--nimbus-blue)] flex items-center justify-center overflow-hidden border border-gray-800 ${
                  index % 2 !== 0 ? 'reveal-right' : 'reveal-left'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={srv.foto}
                  alt={srv.title}
                  className="service-detail-img absolute inset-0 w-full h-full object-cover img-grunge-light mix-blend-normal"
                  loading="lazy"
                  decoding="async"
                />
                <div className="service-detail-halftone absolute inset-0 bg-halftone"></div>

                {/* Placeholder deshabilitado (evita doble texto/marco en SVG). */}

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={srv.mancha}
                  alt=""
                  className="absolute w-3/4 opacity-55 md:opacity-80 mix-blend-screen"
                  loading="lazy"
                  decoding="async"
                />
                <h3 className="relative z-10 px-4 text-center text-3xl sm:text-5xl md:text-7xl font-stencil text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-600 opacity-50 transform -rotate-6 whitespace-normal leading-tight max-w-[95%]">
                  {srv.title}
                </h3>
                <div className="absolute top-4 left-4 font-stencil text-[color:var(--nimbus-red)] text-2xl px-2 py-1 bg-black/50 backdrop-blur-sm">
                  0{index + 1}
                </div>
              </div>

              <div className={`w-full md:w-1/2 ${index % 2 !== 0 ? 'reveal-left' : 'reveal-right'}`}>
                <h2 className="text-4xl md:text-5xl font-stencil mb-6 text-white">{srv.title}</h2>
                <p className="text-xl text-gray-400 mb-8 font-semibold border-l-4 border-[color:var(--nimbus-red)] pl-4">{srv.intro}</p>
                <ul className="space-y-4">
                  {srv.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-lg text-gray-200 reveal-up">
                      <span className="w-2 h-2 bg-[color:var(--nimbus-red)] rounded-full"></span> {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 reveal-up delay-400">
                  <ButtonPrimary onClick={() => setView('contacto')}>Solicitar Servicio</ButtonPrimary>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Metodologia() {
  return (
    <div className="pt-24 bg-[color:var(--nimbus-blue)] min-h-screen relative overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ASSETS.periodicos.texturaFondo}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-5 mix-blend-luminosity pointer-events-none"
      />
      <div className="container mx-auto px-6 py-12 relative z-10">
        <SectionTitle title="METODOLOGÍA NIMBUS" subtitle="El proceso detrás de las campañas de alto impacto." redWordIndex={1} />

        <div className="relative mt-20 max-w-4xl mx-auto">
          <div className="absolute left-[28px] top-0 bottom-0 w-1 bg-gray-800 reveal-scale"></div>

          {[
            { title: 'DIAGNÓSTICO', desc: 'Análisis de entorno, competencia y definición clara de objetivos.' },
            { title: 'ESTRATEGIA', desc: 'Diseño del plan de comunicación y selección de canales.' },
            { title: 'PRODUCCIÓN', desc: 'Creación de contenido, materiales gráficos y audiovisuales.' },
            { title: 'ACTIVACIÓN', desc: 'Implementación de campañas, lanzamiento y eventos en vivo.' },
            { title: 'OPTIMIZACIÓN', desc: 'Monitoreo en tiempo real, análisis de datos y ajuste estratégico.' },
          ].map((step, i) => (
            <div key={step.title} className="relative pl-20 mb-16 group reveal-right delay-100">
              <div className="absolute left-0 top-1 w-16 h-16 bg-black border-4 border-[color:var(--nimbus-red)] rounded-full flex items-center justify-center font-stencil text-2xl z-10 group-hover:bg-[color:var(--nimbus-red)] transition-colors reveal-scale">
                {i + 1}
              </div>
              <h3 className="text-4xl font-stencil text-white mb-2 group-hover:text-[color:var(--nimbus-red)] transition-colors">{step.title}</h3>
              <p className="text-xl text-gray-400">{step.desc}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ASSETS.manchas.roja1}
                alt=""
                className="absolute -top-10 -left-10 w-32 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type ProjectCase = {
  id: string;
  title: string;
  subtitle?: string;
  cover: string;
  what?: string;
  challenges?: string[];
  solutions?: string[];
  results?: string[];
};

function SectionPlaceholder({
  title,
  bgClass = 'bg-black',
  viewName,
  onOpenProject,
}: {
  title: string;
  bgClass?: string;
  viewName: string;
  onOpenProject?: (p: ProjectCase) => void;
}) {
  const [projects, setProjects] = useState<ProjectCase[] | null>(null);

  useEffect(() => {
    if (viewName !== 'experiencia') return;
    fetch('/content/projects/projects.json')
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]));
  }, [viewName]);

  return (
    <div className={`pt-32 pb-24 min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden ${bgClass}`}>
      <div className="absolute inset-0 bg-halftone opacity-20"></div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ASSETS.manchas.roja1}
        alt=""
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl opacity-10 mix-blend-screen pointer-events-none reveal-scale"
      />
      <div className="relative z-10 text-center px-6 w-full max-w-6xl mx-auto">
        <h1
          className={`text-6xl md:text-8xl font-stencil mb-6 uppercase tracking-wider reveal-down ${
            viewName === 'nosotros' ? 'text-white' : 'text-[color:var(--nimbus-red)]'
          }`}
        >
          {title}
        </h1>

        {viewName === 'nosotros' && (
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mb-10 reveal-up delay-100 leading-relaxed">
            En Nimbus llevamos 15 años creando estrategias que conectan marcas con personas a través de ideas sólidas, ejecución precisa y visión comercial.
            Somos expertos en medios ATL, campañas BTL, marketing, relaciones públicas, producción y activaciones que generan presencia, recordación e impacto real.
            Diseñamos soluciones integrales para cada proyecto, desde la planeación hasta la implementación, combinando creatividad, experiencia y un enfoque estratégico que responde a las necesidades de cada cliente.
          </p>
        )}

        {viewName !== 'nosotros' && (
          <p className="text-2xl text-gray-300 max-w-2xl mx-auto mb-10 reveal-up delay-100">
            Sección en desarrollo. Explorando la estética visual y narrativa de Nimbus para el área de {title.toLowerCase()}.
          </p>
        )}
        <div className="w-24 h-1 bg-[color:var(--nimbus-red)] mx-auto reveal-scale delay-200"></div>

        {viewName === 'experiencia' && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {(projects ?? [
              {
                id: 'proyecto-1',
                title: 'PROYECTO CORPORATIVO 1',
                subtitle: 'Eventos, Producción Audiovisual, PR',
                cover: ASSETS.fotos.proyecto1,
              },
              {
                id: 'proyecto-2',
                title: 'PROYECTO CORPORATIVO 2',
                subtitle: 'Eventos, Producción Audiovisual, PR',
                cover: ASSETS.fotos.proyecto2,
              },
              {
                id: 'proyecto-3',
                title: 'PROYECTO CORPORATIVO 3',
                subtitle: 'Eventos, Producción Audiovisual, PR',
                cover: ASSETS.fotos.proyecto3,
              },
              {
                id: 'proyecto-4',
                title: 'PROYECTO CORPORATIVO 4',
                subtitle: 'Eventos, Producción Audiovisual, PR',
                cover: ASSETS.fotos.proyecto4,
              },
            ]).map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onOpenProject?.(p)}
                className="case-card text-left bg-[color:var(--nimbus-blue)] p-6 border border-gray-800 hover:border-[color:var(--nimbus-red)] transition-colors group reveal-up"
              >
                <div className="h-64 bg-gray-900 mb-6 relative overflow-hidden flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.cover}
                    alt={p.title}
                    className="absolute inset-0 w-full h-full object-cover img-grunge-light group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Sin texturas/halftone en esta tarjeta; solo la foto */}
                </div>
                <h3 className="font-stencil text-3xl mb-2 text-white">{p.title || `PROYECTO ${idx + 1}`}</h3>
                <p className="text-gray-400 text-sm mb-4">{p.subtitle || 'Eventos, Producción Audiovisual, PR'}</p>
                <span className="text-[color:var(--nimbus-red)] font-bold text-sm uppercase tracking-wider hover:underline cursor-pointer flex items-center gap-1">
                  Ver Caso <ArrowRight size={14} />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Contacto() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError(null);

    try {
      const payload = { name, company, contact, message, source: 'contacto' };
      const res = await fetch('/api/email-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) throw new Error(data?.error || 'No se pudo enviar');

      setStatus('sent');
      setName('');
      setCompany('');
      setContact('');
      setMessage('');
    } catch (e: unknown) {
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Error');
    }
  }

  return (
    <div className="pt-24 bg-[color:var(--nimbus-blue)] min-h-screen relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ASSETS.manchas.negra1}
        alt=""
        className="absolute top-0 right-0 w-1/2 opacity-30 pointer-events-none mix-blend-screen reveal-left"
      />
      <div className="container mx-auto px-6 py-12 relative z-10">
        <SectionTitle title="CONTACTO" subtitle="Inicia la conversación. Construyamos impacto." redWordIndex={0} />

        <div className="flex flex-col md:flex-row gap-16 mt-16">
          <div className="w-full md:w-1/2 reveal-left delay-100">
            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Nombre Completo</label>
                <input
                  type="text"
                  className="w-full bg-black border border-gray-800 p-4 text-white focus:outline-none focus:border-[color:var(--nimbus-red)] transition-colors"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Empresa</label>
                <input
                  type="text"
                  className="w-full bg-black border border-gray-800 p-4 text-white focus:outline-none focus:border-[color:var(--nimbus-red)] transition-colors"
                  placeholder="Nombre de la empresa"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Número o correo de contacto</label>
                <input
                  type="text"
                  className="w-full bg-black border border-gray-800 p-4 text-white focus:outline-none focus:border-[color:var(--nimbus-red)] transition-colors"
                  placeholder="WhatsApp o email"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Mensaje</label>
                <textarea
                  rows={4}
                  className="w-full bg-black border border-gray-800 p-4 text-white focus:outline-none focus:border-[color:var(--nimbus-red)] transition-colors"
                  placeholder="Cuéntanos sobre tu proyecto..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <button
                className={`group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white uppercase tracking-wider bg-[color:var(--nimbus-red)] overflow-hidden transition-all hover:scale-105 w-full ${
                  status === 'sending' ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                type="submit"
                disabled={status === 'sending'}
              >
                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                <span className="relative z-10 flex items-center gap-2">{status === 'sending' ? 'Enviando…' : 'Enviar Mensaje'}</span>
                <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>

              {status === 'sent' && <p className="text-green-300 font-bold">Listo. Te contactamos en breve.</p>}
              {status === 'error' && <p className="text-red-300 font-bold">Error: {error}</p>}

              <p className="text-white/50 text-xs font-bold">
                Al enviar aceptas que te contactemos por WhatsApp/correo para dar seguimiento a tu solicitud.
              </p>
            </form>
          </div>

          <div className="w-full md:w-1/2 space-y-12 reveal-right delay-200">
            <div className="bg-black p-8 border-l-4 border-[color:var(--nimbus-red)] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ASSETS.manchas.roja1}
                alt=""
                className="absolute -right-10 -bottom-10 w-48 opacity-20 pointer-events-none"
              />
              <h3 className="font-stencil text-3xl mb-6 text-white relative z-10">CONTACTO DIRECTO</h3>
              <ul className="space-y-6 relative z-10">
                <li className="flex items-center gap-4 text-lg hover:translate-x-2 transition-transform">
                  <MessageCircle className="text-[color:var(--nimbus-red)]" />
                  <a
                    href="https://wa.me/525535239662"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[color:var(--nimbus-red)] transition-colors"
                  >
                    +52 55 3523 9662 (WhatsApp)
                  </a>
                </li>
                <li className="flex items-center gap-4 text-lg hover:translate-x-2 transition-transform">
                  <Mail className="text-[color:var(--nimbus-red)]" />
                  <a href="mailto:contacto@nimbus.mx" className="hover:text-[color:var(--nimbus-red)] transition-colors">
                    contacto@nimbus.mx
                  </a>
                </li>
                <li className="flex items-start gap-4 text-lg hover:translate-x-2 transition-transform">
                  <MapPin className="text-[color:var(--nimbus-red)] mt-1" />
                  <span>
                    Ciudad de México,
                    <br />
                    México.
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-stencil text-2xl mb-4 text-white">SÍGUENOS</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-12 h-12 bg-[color:var(--nimbus-blue)] border border-gray-700 flex items-center justify-center hover:bg-[color:var(--nimbus-red)] hover:border-[color:var(--nimbus-red)] hover:-translate-y-1 transition-all"
                  aria-label="Instagram"
                >
                  <AtSign />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-[color:var(--nimbus-blue)] border border-gray-700 flex items-center justify-center hover:bg-[color:var(--nimbus-red)] hover:border-[color:var(--nimbus-red)] hover:-translate-y-1 transition-all"
                  aria-label="LinkedIn"
                >
                  <LinkIcon />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-[color:var(--nimbus-blue)] border border-gray-700 flex items-center justify-center hover:bg-[color:var(--nimbus-red)] hover:border-[color:var(--nimbus-red)] hover:-translate-y-1 transition-all"
                  aria-label="Twitter"
                >
                  <X />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [currentView, setCurrentView] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openProject, setOpenProject] = useState<ProjectCase | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('reveal-active');
          });
        },
        { threshold: 0.15 },
      );

      const elements = document.querySelectorAll('.reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale');
      elements.forEach((el) => observer.observe(el));

      return () => elements.forEach((el) => observer.unobserve(el));
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentView]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'servicios', label: 'Servicios' },
    { id: 'metodologia', label: 'Metodología' },
    { id: 'experiencia', label: 'Experiencia' },
    { id: 'nosotros', label: 'Nosotros' },
    { id: 'contacto', label: 'Contacto' },
  ];

  const handleNav = (id: string) => {
    setCurrentView(id);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home setView={handleNav} />;
      case 'servicios':
        return <Servicios setView={handleNav} />;
      case 'metodologia':
        return <Metodologia />;
      case 'contacto':
        return <Contacto />;
      case 'experiencia':
        return <SectionPlaceholder title="Experiencia" viewName="experiencia" onOpenProject={setOpenProject} />;      case 'nosotros':
        return <SectionPlaceholder title="Nosotros" viewName="nosotros" />;
      default:
        return <Home setView={handleNav} />;
    }
  };

  return (
    <>
      <style>{globalStyles}</style>

      {openProject && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Caso de proyecto"
          onClick={() => setOpenProject(null)}
        >
          <div
            className="w-full max-w-3xl bg-[color:var(--nimbus-blue)] border border-gray-800 shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6 p-6 border-b border-gray-800">
              <div>
                <h3 className="font-stencil text-3xl md:text-4xl text-white leading-tight">{openProject.title}</h3>
                {openProject.subtitle && <p className="text-gray-300 mt-2">{openProject.subtitle}</p>}
              </div>
              <button
                type="button"
                className="text-white/70 hover:text-white font-bold"
                onClick={() => setOpenProject(null)}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto">
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative h-56 md:h-full min-h-56 bg-black/30 border border-gray-800 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={openProject.cover}
                    alt={openProject.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="space-y-5">
                  {openProject.what && (
                    <div>
                      <h4 className="font-stencil text-xl text-white mb-2">QUÉ HICIMOS</h4>
                      <p className="text-gray-300 leading-relaxed">{openProject.what}</p>
                    </div>
                  )}

                  {openProject.challenges?.length ? (
                    <div>
                      <h4 className="font-stencil text-xl text-white mb-2">RETOS</h4>
                      <ul className="list-disc pl-5 text-gray-300 space-y-1">
                        {openProject.challenges.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {openProject.solutions?.length ? (
                    <div>
                      <h4 className="font-stencil text-xl text-white mb-2">CÓMO LO SOLUCIONAMOS</h4>
                      <ul className="list-disc pl-5 text-gray-300 space-y-1">
                        {openProject.solutions.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {openProject.results?.length ? (
                    <div>
                      <h4 className="font-stencil text-xl text-white mb-2">RESULTADOS</h4>
                      <ul className="list-disc pl-5 text-gray-300 space-y-1">
                        {openProject.results.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 flex justify-end">
              <ButtonPrimary onClick={() => setOpenProject(null)}>Cerrar</ButtonPrimary>
            </div>
          </div>
        </div>
      )}

      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[color:var(--nimbus-black)]/95 backdrop-blur-sm py-2 shadow-lg shadow-black/50 border-b border-gray-900'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="cursor-pointer relative z-50 flex items-center h-12" onClick={() => handleNav('home')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ASSETS.logos.principal}
              alt="Nimbus"
              className="h-16 md:h-20 object-contain mix-blend-screen hover:scale-105 transition-transform"
              style={{ filter: 'contrast(1.2)' }}
            />
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`font-bold text-sm uppercase tracking-widest transition-colors hover-glitch ${
                  currentView === link.id ? 'text-[color:var(--nimbus-red)]' : 'text-gray-300'
                }`}
                type="button"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <button className="lg:hidden relative z-50 text-white p-2" onClick={() => setIsMenuOpen((v) => !v)} type="button">
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 bg-[color:var(--nimbus-black)] z-40 transition-transform duration-500 ease-in-out flex flex-col justify-center items-center ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ASSETS.manchas.negra1} alt="" className="absolute top-0 right-0 w-64 opacity-20" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ASSETS.manchas.roja1} alt="" className="absolute bottom-0 left-0 w-64 opacity-20" />
        <nav className="flex flex-col gap-6 text-center relative z-10">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className={`font-stencil text-4xl uppercase tracking-wider transition-colors ${
                currentView === link.id ? 'text-[color:var(--nimbus-red)]' : 'text-white'
              }`}
              type="button"
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>

      <main className="min-h-screen pt-0">{renderView()}</main>

      <footer className="bg-[color:var(--nimbus-black)] border-t border-gray-900 pt-16 pb-8 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ASSETS.periodicos.texturaOscura} alt="" className="absolute inset-0 w-full h-full object-cover opacity-5 mix-blend-overlay" />
        <div className="container mx-auto px-6 relative z-10 reveal-up">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ASSETS.logos.principal} alt="Nimbus" className="h-12 object-contain mix-blend-screen mb-6 grayscale hover:grayscale-0 transition-all" />
              <p className="text-gray-500 max-w-sm mb-6">Estrategia, comunicación y experiencias de marca de alto impacto visual y narrativo.</p>
            </div>
            <div>
              <h4 className="font-stencil text-white text-xl mb-4">MAPA DEL SITIO</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => handleNav('servicios')} className="text-gray-400 hover:text-[color:var(--nimbus-red)] transition-colors" type="button">
                    Servicios
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('metodologia')} className="text-gray-400 hover:text-[color:var(--nimbus-red)] transition-colors" type="button">
                    Metodología
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('experiencia')} className="text-gray-400 hover:text-[color:var(--nimbus-red)] transition-colors" type="button">
                    Experiencia
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-stencil text-white text-xl mb-4">CONTACTO</h4>
              <ul className="space-y-2 text-gray-400">
                <li>CDMX, México</li>
                <li>
                  <a href="mailto:contacto@nimbus.mx" className="hover:text-[color:var(--nimbus-red)] transition-colors">
                    contacto@nimbus.mx
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/525535239662" target="_blank" rel="noreferrer" className="hover:text-[color:var(--nimbus-red)] transition-colors">
                    +52 55 3523 9662
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>&copy; 2026 NIMBUS MARKETING Y RP. Todos los derechos reservados.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <span className="hover:text-white cursor-pointer transition-colors">Aviso de Privacidad</span>
              <span className="hover:text-white cursor-pointer transition-colors">Términos</span>
            </div>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/525535239662"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg shadow-black/50 hover:scale-110 hover:bg-[#1ebe57] transition-all flex items-center justify-center group"
      >
        <MessageCircle size={32} />
        <span className="absolute right-full mr-4 bg-black text-white px-3 py-1 rounded text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-800 pointer-events-none">
          ¿En qué te ayudamos?
        </span>
      </a>
    </>
  );
}
