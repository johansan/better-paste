/*
 * Better Paste - Plugin for Obsidian
 * Copyright (c) 2026 Johan Sanneblad
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { TranslationStrings } from '../types';

/** Spanish. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_ES: TranslationStrings = {
    commands: {
        paste: 'Pegar',
        pasteRaw: 'Pegar sin procesar',
        cleanSelection: 'Limpiar la selección',
        toggleCleanup: 'Alternar la limpieza automática'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        separator: ', ',
        cleanupOn: 'procesamiento automático activado',
        cleanupOff: 'procesamiento automático desactivado',
        selectTextFirst: 'selecciona texto primero',
        nothingToClean: 'no hay nada que limpiar',
        clipboardFailed: 'no se pudo leer el portapapeles',
        titleFailed: 'no se pudo obtener el título.',
        fetchingTitle: 'obteniendo el título{dots}',
        imagesFailed: {
            one: 'no se pudo guardar {count} imagen',
            other: 'no se pudieron guardar {count} imágenes'
        },
        imagesFailedLinkKept: '{images}, se conservó el enlace original',
        imagesFailedNothingPasted: '{images}, así que no se pegó nada',
        aiTextCleaned: 'texto de IA depurado',
        terminalCleaned: 'salida de terminal limpiada',
        textProcessed: 'estilo de texto ajustado',
        urlsCleaned: { one: '{count} URL limpiada', other: '{count} URL limpiadas' },
        imagesSaved: { one: '{count} imagen guardada', other: '{count} imágenes guardadas' }
    },

    settings: {
        exampleFallback: '{description} Ejemplo: {example}',
        plainFallback: '{description} {example}',

        start: {
            whatsNewName: 'Novedades de Better Paste {version}',
            whatsNewDesc: 'Qué ha cambiado en las versiones más recientes.',
            whatsNewAliases: ['notas de la versión', 'cambios', 'registro de cambios', 'versión', 'actualización', 'historial'],
            whatsNewButton: 'Ver las novedades',
            supportName: 'Apoyar el desarrollo',
            supportDesc: 'Si Better Paste te resulta útil, considera apoyar su desarrollo.',
            supportAliases: ['patrocinar', 'donar', 'café', 'github'],
            sponsorButton: '❤️ Patrocinar',
            coffeeButton: '☕️ Invítame a un café'
        },

        behavior: {
            heading: 'Comportamiento',
            autoCleanName: 'Limpiar cada pegado',
            autoCleanDesc:
                'Aplica las reglas en cada pegado. Si se desactiva, las reglas solo se aplican mediante los comandos de Better Paste. Una nota concreta puede quedar excluida con la propiedad "better-paste: false".',
            autoCleanAliases: ['automático', 'activar', 'desactivar', 'nota', 'excluir', 'propiedad', 'frontmatter', 'excepción'],
            showNoticesName: 'Mostrar un aviso cuando se modifica un pegado',
            showNoticesDesc: 'Un resumen de una línea de lo que cambió. Los fallos se informan siempre.',
            showNoticesAliases: ['aviso', 'resumen', 'mensaje', 'notificación', 'silencio']
        },

        images: {
            heading: 'Imágenes',
            savingName: 'Guardar en la bóveda las imágenes pegadas',
            savingDesc:
                'Guarda las imágenes pegadas en tu carpeta de adjuntos y enlaza el archivo local en lugar de la dirección web. Abarca "Copiar imagen" de Safari, las imágenes dentro de contenido web copiado y las direcciones de imagen pegadas. Por defecto, el nombre del archivo procede de la dirección:',
            savingAliases: [
                'descargar',
                'adjunto',
                'safari',
                'captura de pantalla',
                'imagen',
                'carpeta',
                'nombre de archivo',
                'ancho',
                'tamaño'
            ],
            pageName: 'Tratamiento de imágenes',
            pageDesc: 'Nombres de archivo y ancho de imagen.',
            nameFormatName: 'Nombres de archivo',
            nameFormatDesc: 'Cómo se nombran las imágenes guardadas.',
            nameFormatSource: 'Nombre del origen',
            nameFormatCustom: 'Formato propio',
            customName: 'Formato propio',
            customDesc: 'Usa {{name}} para el nombre de origen y formatos de fecha de Moment como YYYY-MM-DD.',
            customMomentLink: 'Formato de Moment',
            customExample: 'Ejemplo: {value}',
            customAliases: ['nombre', 'archivo', 'fecha', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'Propiedad de ancho de imagen',
            sizePropertyDesc:
                'Propiedad del frontmatter que fija el ancho de las imágenes pegadas en una nota. Con "image-width: 400" en la nota, una imagen pegada queda como ![[photo.png|400]]. Déjala en blanco para no añadir ancho.',
            sizePropertyAliases: ['tamaño', 'frontmatter', 'propiedad', 'redimensionar']
        },

        links: {
            heading: 'Enlaces',
            titlesName: 'Obtener el título de los enlaces pegados',
            titlesDesc:
                'Al pegar una dirección web sola se inserta un enlace de Markdown con el título de la página. Si hay texto seleccionado, ese texto pasa a ser la etiqueta y no se obtiene ningún título. Si el título no se puede obtener, se conserva la dirección tal cual.',
            titlesAliases: ['título', 'página', 'sitio web', 'enlace markdown', 'descargar'],
            cleaningName: 'Limpiar los enlaces pegados',
            cleaningDesc: 'Elimina los parámetros de seguimiento de los enlaces pegados:',
            cleaningAliases: ['url', 'seguimiento', 'utm', 'parámetros', 'consulta', 'sitio', 'dominio', 'youtube', 'excepción'],
            stripName: 'Qué parámetros eliminar',
            stripDesc: 'Los parámetros de seguimiento son nombres como utm_source, fbclid y gclid.',
            stripAliases: ['utm', 'seguimiento', 'consulta', 'parámetros'],
            stripAll: 'Todos los parámetros, salvo que una regla de sitio los conserve',
            stripTracking: 'Solo los parámetros de seguimiento conocidos',
            rulesName: 'Reglas de sitio',
            rulesDesc: 'Parámetros que se conservan en sitios concretos.',
            rulesCount: { one: '{count} sitio', other: '{count} sitios' },
            listName: 'Tus reglas de sitio',
            listDesc:
                '{sites} ya están cubiertos por el complemento. Añade aquí tus propias reglas, una por línea. "example.com" conserva todos los parámetros de ese sitio, "example.com: a, b" conserva solo esos dos, y "!example.com" quita una regla incluida en el complemento. Los subdominios se reconocen automáticamente.',
            listShippedCount: { one: '{count} sitio habitual', other: '{count} sitios habituales' },
            listAliases: ['dominio', 'excepción', 'lista blanca', 'youtube'],
            listInvalid: 'No es un nombre de sitio: {values}',
            testerName: 'Pruébalo',
            testerDesc: 'Pega un enlace para ver qué conservan las reglas.',
            testerLabel: 'Enlace para limpiar',
            testerEmpty: 'El enlace limpio aparece aquí.'
        },

        terminal: {
            heading: 'Texto de terminal',
            cleanupName: 'Limpiar la salida de terminal',
            cleanupDesc:
                'Vuelve a unir las líneas que la terminal partió y quita los códigos de color y la sangría inicial. Los bloques de código, las tablas y las listas no se tocan.',
            cleanupAliases: ['ajuste', 'unir', 'ansi', 'consola', 'shell', 'sangría', 'viñeta', 'lista', 'markdown'],
            pageName: 'Tratamiento del texto de terminal',
            pageDesc: 'Unión de líneas y caracteres de viñeta.',
            rejoinName: 'Cuándo volver a unir una línea partida',
            rejoinDesc: 'Una línea solo se une a la de arriba cuando esa línea parece llena.',
            rejoinAliases: ['sangría', 'ajuste', 'agresivo', 'seguro', 'git log'],
            rejoinIndented: 'Solo cuando la línea está sangrada',
            rejoinAny: 'Esté sangrada o no',
            rejoinNever: 'Nunca, solo quitar códigos y sangría',
            bulletsName: 'Caracteres de viñeta',
            bulletsDesc: 'Qué hacer con los caracteres de viñeta como • en la salida de terminal.',
            bulletsAliases: ['lista', 'markdown', 'guion'],
            bulletsMarkdown: 'Convertir en elementos de lista de Markdown',
            bulletsPreserve: 'Dejarlos como están',
            testerName: 'Pruébalo',
            testerDesc: 'Pega salida de terminal para ver cómo se limpia.',
            testerLabel: 'Texto de terminal para limpiar',
            testerEmpty: 'El texto limpio aparece aquí.',
            testerSample: [
                '• El paso adicional queda aislado en el gestor de Enter de la lista, así que el cambio principal es sencillo. Al recorrer flujos cercanos encontré',
                '  dos puntos de fricción que conviene comprobar: la selección puede saltar tras la actualización.'
            ]
        },

        text: {
            heading: 'Procesamiento de texto',
            trimName: 'Recortar los espacios de alrededor',
            trimDesc: 'Elimina las líneas en blanco y los espacios del principio y del final del texto pegado.',
            trimAliases: ['espacio', 'línea en blanco', 'salto de línea', 'recortar'],
            commasName: 'Comas y comillas',
            commasDesc: 'Dónde va una coma junto a una comilla doble de cierre.',
            commasAliases: ['coma', 'comilla', 'cita', 'puntuación', 'estilo'],
            commasNone: 'Sin cambios',
            commasInside: 'Coma dentro de las comillas',
            commasOutside: 'Coma fuera de las comillas',
            commasExampleSource: 'Lo llamó "terminado," luego se fue.',
            commasExampleOutside: 'Lo llamó "terminado", luego se fue.',
            invisibleName: 'Limpieza de IA: caracteres invisibles',
            invisibleDesc: 'Elimina los espacios de ancho cero y convierte los espacios duros en espacios normales.',
            invisibleAliases: [
                'ia',
                'chatgpt',
                'claude',
                'llm',
                'raya',
                'guion largo',
                'semirraya',
                'guion',
                'unicode',
                'invisible',
                'nbsp',
                'tipografía',
                'puntuación',
                'espacio'
            ],
            invisibleExampleStart: 'El',
            invisibleExampleMiddle: 'resultado',
            invisibleExampleEnd: ' fue bueno.',
            invisibleExampleAfter: 'El resultado fue bueno.',
            punctuationName: 'Limpieza de IA: rayas y comillas',
            punctuationDesc: 'Convierte las rayas largas en guiones y las comillas tipográficas en comillas rectas.',
            punctuationAliases: [
                'raya',
                'guion largo',
                'semirraya',
                'guion',
                'comillas',
                'comillas tipográficas',
                'apóstrofo',
                'puntuación',
                'tipografía'
            ],
            punctuationExampleBefore: '“El resultado — contra todo pronóstico — fue perfecto.”',
            punctuationExampleAfter: '"El resultado - contra todo pronóstico - fue perfecto."'
        }
    },

    welcome: {
        title: 'Te damos la bienvenida a Better Paste',
        intro: [
            'Better Paste modifica el contenido del portapapeles mientras se pega en una nota.',
            'Guarda como adjuntos en la bóveda las imágenes enlazadas, elimina los parámetros de seguimiento de los enlaces, vuelve a unir las líneas partidas de la salida de terminal y sustituye las comillas tipográficas y los caracteres invisibles por sus equivalentes simples.',
            'Cada regla se puede desactivar por separado.',
            'Una nota concreta puede quedar excluida por completo con la propiedad "better-paste: false". Los ajustes están en Ajustes, Better Paste.'
        ],
        startButton: 'Empezar'
    },

    whatsNew: {
        title: 'Novedades de Better Paste',
        scrollLabel: 'Notas de la versión',
        releaseHeading: 'Versión {version} ({date})',
        categoryNew: 'Nuevo',
        categoryImproved: 'Mejorado',
        categoryChanged: 'Cambiado',
        categoryFixed: 'Corregido',
        support: 'Si Better Paste te resulta útil, considera apoyar su desarrollo.',
        coffeeButton: '☕️ Invítame a un café',
        thanksButton: '¡Gracias!'
    }
};
