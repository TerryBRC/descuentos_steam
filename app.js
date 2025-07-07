document.getElementById('scrapeBtn').addEventListener('click', async () => {
    const juegosDiv = document.getElementById('juegos');
    juegosDiv.innerHTML = '<p>Cargando...</p>';

    // Leer los juegos desde el archivo generado por el scraper PHP
    const url = 'datos.json';

    try {
        const res = await fetch(url);
        const juegos = await res.json();

        // Ordenar de mayor a menor descuento (100% primero)
        juegos.sort((a, b) => {
            // Extraer el número del porcentaje (puede venir como "-100%")
            const descA = Math.abs(parseInt(a.descuento.replace(/[^\d-]/g, '')));
            const descB = Math.abs(parseInt(b.descuento.replace(/[^\d-]/g, '')));
            return descB - descA;
        });

        let cargados = 0;
        const porBloque = 8;

        juegosDiv.innerHTML = '';
        function cargarMas() {
            for (let i = cargados; i < cargados + porBloque && i < juegos.length; i++) {
                const juego = juegos[i];
                const div = document.createElement('div');
                div.className = 'juego';
                div.innerHTML = `
                    <img src="${juego.imagen}" alt="${juego.titulo}">
                    <div class="titulo">${juego.titulo}</div>
                    <div>Precio: <s>${juego.precio_original}</s> <b>${juego.precio_descuento}</b></div>
                    <div class="descuento">${juego.descuento}</div>
                    <a href="${juego.enlace}" target="_blank">Ver en Steam</a>
                `;
                juegosDiv.appendChild(div);
            }
            cargados += porBloque;
            if (cargados >= juegos.length) {
                window.removeEventListener('scroll', scrollHandler);
            }
        }

        function scrollHandler() {
            if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 200)) {
                cargarMas();
            }
        }

        cargarMas();
        window.addEventListener('scroll', scrollHandler);

        if (juegos.length === 0) {
            juegosDiv.innerHTML = '<p>No se encontraron juegos con descuento.</p>';
        }
    } catch (e) {
        juegosDiv.innerHTML = '<p>Error al obtener los datos del archivo local.</p>';
    }
});
