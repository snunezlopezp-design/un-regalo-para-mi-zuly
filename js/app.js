const CANCION = {
  enlace: 'https://www.youtube-nocookie.com/embed/b09HHmPvliw',
  titulo: 'i think about you all the time - Deftones',
  inicio: '1:46',          
  fin: '2:13'           
};

const DURACION = 500;

let vistaActual = document.getElementById('vista-1');
let cambiando = false;

function irA(id) {
  const nueva = document.getElementById(id);
  if (!nueva || nueva === vistaActual || cambiando) return;

  cambiando = true;
  const anterior = vistaActual;
  anterior.classList.add('opacity-0', 'translate-y-3'); 

  setTimeout(() => {
    anterior.classList.add('hidden');
    if (anterior.id === 'vista-6') quitarVideo();

    nueva.classList.remove('hidden');
    window.scrollTo(0, 0);
    if (nueva.id === 'vista-6') ponerVideo();

    void nueva.offsetWidth;
    nueva.classList.remove('opacity-0', 'translate-y-3');

    vistaActual = nueva;
    cambiando = false;

    const titulo = nueva.querySelector('h1, h2');
    if (titulo) {
      titulo.setAttribute('tabindex', '-1');
      titulo.focus({ preventScroll: true });
    }
  }, DURACION);
}

document.addEventListener('click', (evento) => {
  const boton = evento.target.closest('[data-ir]');
  if (!boton) return;
  if (boton.hasAttribute('data-corazones')) lluviaDeCorazones();
  irA(boton.dataset.ir);
});

const reproductor = document.getElementById('reproductor');

const coincidencia = CANCION.enlace.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/)([\w-]{11})/);
const idVideo = coincidencia ? coincidencia[1] : null;

function aSegundos(tiempo) {
  return tiempo.split(':').reduce((total, parte) => total * 60 + Number(parte), 0);
}

document.getElementById('titulo-cancion').textContent = CANCION.titulo;
document.getElementById('btn-secreto').textContent = `mensaje secreto: ${CANCION.inicio} - ${CANCION.fin}`;

function enlaceYouTube(segundo = 0) {
  return `https://www.youtube.com/watch?v=${idVideo}&t=${segundo}s`;
}

function ponerVideo() {
  const tarjeta = document.createElement('a');
  tarjeta.href = enlaceYouTube();
  tarjeta.target = '_blank';
  tarjeta.rel = 'noopener';
  tarjeta.className = 'relative block h-full w-full overflow-hidden rounded-xl';
  tarjeta.innerHTML = `
    <img src="https://img.youtube.com/vi/${idVideo}/hqdefault.jpg" alt="Portada de la canción" class="h-full w-full object-cover">
    <span class="absolute inset-0 flex items-center justify-center bg-black/40 font-title text-4xl font-bold text-white">▶ Escuchar en YouTube</span>`;
  reproductor.replaceChildren(tarjeta);
}

function quitarVideo() {
  reproductor.replaceChildren();
}

const fotos = Array.from(document.querySelectorAll('.foto'));
const visor = document.getElementById('visor');
const visorFoto = document.getElementById('visor-foto');
const visorPie = document.getElementById('visor-pie');
let indiceFoto = 0;

function crearRespaldo(ruta) {
  const caja = document.createElement('span');
  caja.className = 'flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-rose-100 to-paper text-wine';
  caja.innerHTML = '<span class="text-3xl">♥</span><span class="text-xs"></span>';
  caja.lastElementChild.textContent = ruta.replace('img/', '');
  return caja;
}

fotos.forEach((boton, indice) => {
  const { src, pie } = boton.dataset;
  boton.setAttribute('aria-label', `Ampliar foto: ${pie}`);
  boton.appendChild(crearRespaldo(src));

  const imagen = new Image();
  imagen.alt = pie;
  imagen.className = 'h-full w-full object-cover';
  imagen.onload = () => boton.replaceChildren(imagen);
  imagen.src = src;

  boton.addEventListener('click', () => {
    mostrarFoto(indice);
    visor.showModal();
  });
});

function mostrarFoto(indice) {
  indiceFoto = (indice + fotos.length) % fotos.length;
  const boton = fotos[indiceFoto];
  const contenido = boton.firstElementChild.cloneNode(true);
  if (contenido.tagName === 'IMG') contenido.className = 'h-full w-full object-contain';
  visorFoto.replaceChildren(contenido);
  visorPie.textContent = boton.dataset.pie;
}

document.getElementById('visor-anterior').addEventListener('click', () => mostrarFoto(indiceFoto - 1));
document.getElementById('visor-siguiente').addEventListener('click', () => mostrarFoto(indiceFoto + 1));
visor.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') mostrarFoto(indiceFoto - 1);
  if (e.key === 'ArrowRight') mostrarFoto(indiceFoto + 1);
});

const secreto = document.getElementById('secreto');

document.getElementById('btn-secreto').addEventListener('click', () => secreto.showModal());

document.getElementById('btn-fragmento').addEventListener('click', () => {
  secreto.close();
  window.open(enlaceYouTube(aSegundos(CANCION.inicio)), '_blank', 'noopener');
});

document.querySelectorAll('dialog').forEach((modal) => {
  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-cerrar]')) return modal.close();
    if (e.target !== modal) return;
    const r = modal.getBoundingClientRect();
    const fuera = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    if (fuera) modal.close();
  });
});

function lluviaDeCorazones(cantidad = 25) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colores = ['#9B1B25', '#E0525F', '#F29CAD'];

  for (let i = 0; i < cantidad; i++) {
    const corazon = document.createElement('span');
    corazon.textContent = '♥';
    corazon.className = 'corazon-caida';
    corazon.setAttribute('aria-hidden', 'true');
    corazon.style.left = `${Math.random() * 95}vw`;
    corazon.style.color = colores[i % colores.length];
    corazon.style.fontSize = `${14 + Math.random() * 22}px`;
    corazon.style.animationDuration = `${2 + Math.random() * 2}s`;
    corazon.style.animationDelay = `${Math.random() * 0.8}s`;
    corazon.style.transform = 'translateY(-10vh)';
    corazon.addEventListener('animationend', () => corazon.remove());
    document.body.appendChild(corazon);
  }
}