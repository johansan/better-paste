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
        cleanTerminal: 'Limpiar la salida de terminal',
        commasInside: 'Colocar comas dentro de las comillas',
        commasOutside: 'Colocar comas fuera de las comillas',
        toggleCleanup: 'Alternar la limpieza automática'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        cleanupOn: 'procesamiento automático activado',
        cleanupOff: 'procesamiento automático desactivado',
        selectTextFirst: 'selecciona texto primero',
        nothingToClean: 'no hay nada que limpiar',
        clipboardFailed: 'no se pudo leer el portapapeles',
        titleFailed: 'no se pudo obtener el título.',
        fetchingTitle: 'obteniendo el título...',
        imagesFailed: {
            one: 'no se pudo guardar {count} imagen',
            other: 'no se pudieron guardar {count} imágenes'
        },
        imagesFailedLinkKept: '{images}, se conservó el enlace original',
        imagesFailedNothingPasted: '{images}, así que no se pegó nada'
    },

    settings: {
        exampleFallback: '{description} Ejemplo: {example}',
        plainFallback: '{description} {example}',

        start: {
            heading: 'Acerca de',
            whatsNewName: 'Novedades de Better Paste {version}',
            whatsNewDesc: 'Qué ha cambiado en las versiones más recientes.',
            whatsNewAliases: ['notas de la versión', 'cambios', 'registro de cambios', 'versión', 'actualización', 'historial'],
            whatsNewButton: 'Ver las novedades',
            supportName: 'Apoyar el desarrollo',
            supportDesc: 'Si Better Paste te resulta útil, considera apoyar su desarrollo.',
            supportAliases: ['patrocinar', 'donar', 'café', 'github'],
            sponsorButton: '❤️ Patrocinar',
            coffeeButton: '☕️ Invítame a un café',
            pluginsName: 'Descubre mis otros plugins',
            pluginsAliases: ['plugins', 'complementos', 'notebook navigator', 'pixel perfect image', 'autor'],
            notebookNavigatorDesc: 'Un explorador de archivos y calendario mejores',
            pixelPerfectImageDesc: 'Cambio de tamaño exacto de imágenes y más'
        },

        behavior: {
            autoCleanName: 'Limpiar cada pegado',
            autoCleanDesc:
                'Aplica las reglas en cada pegado. Si se desactiva, las reglas solo se aplican mediante los comandos de Better Paste. Una nota concreta puede quedar excluida con la propiedad "bp: false", o incluida con "bp: true".',
            autoCleanAliases: ['automático', 'activar', 'desactivar', 'nota', 'excluir', 'propiedad', 'frontmatter', 'excepción']
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
            sizeChoiceName: 'Aplicar tamaño al pegar',
            sizeChoiceDesc:
                'Añade un ancho a cada imagen incrustada que se guarda, como ![[photo.jpg|400]]. La propiedad de ancho de la nota tiene prioridad.',
            sizeChoiceAliases: ['tamaño', 'ancho', 'tamaño de imagen', 'redimensionar', 'incrustar', '400'],
            sizeOptionsName: 'Opciones de tamaño',
            sizeOptionsDesc: 'Los anchos ofrecidos arriba y en el diálogo al pegar, separados por comas.',
            classChoiceName: 'Aplicar clase CSS al pegar',
            classChoiceDesc:
                'Añade una clase a cada imagen incrustada que se guarda, como ![[photo.jpg#invert]]. Los temas y los fragmentos CSS deciden qué hace una clase.',
            classChoiceAliases: ['css', 'clase', 'fragmento', 'invert', 'tema', 'filtro', 'incrustar'],
            classOptionsName: 'Opciones de clase',
            classOptionsDesc: 'Las clases ofrecidas arriba y en el diálogo al pegar, separadas por comas.',
            choiceNone: 'No hacer nada',
            choiceAsk: 'Preguntar en cada pegado',
            nameFormatName: 'Nombres de archivo',
            nameFormatDesc: 'Cómo se nombran las imágenes guardadas.',
            nameFormatSource: 'Nombre del origen',
            nameFormatCustom: 'Formato propio',
            customName: 'Formato propio',
            customDesc: 'Usa {{name}} para el nombre de origen y formatos de fecha de Moment como YYYY-MM-DD.',
            customMomentLink: 'Formato de Moment',
            customExample: 'Ejemplo: {value}',
            customAliases: ['nombre', 'archivo', 'fecha', 'moment', 'YYYY', '{{name}}']
        },

        frontmatter: {
            heading: 'Frontmatter',
            notePropertyName: 'Propiedad de la nota',
            notePropertyDesc:
                'Propiedad que activa o desactiva Better Paste en una sola nota. Con "bp: false" la nota queda intacta, y con "bp: true" se limpia aunque "Limpiar cada pegado" esté desactivado. Déjala en blanco para ignorar la propiedad.',
            notePropertyAliases: ['nota', 'propiedad', 'frontmatter', 'excluir', 'desactivar', 'activar', 'bp'],
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

        text: {
            heading: 'Procesamiento de texto',
            trimName: 'Recortar los espacios de alrededor',
            trimDesc: 'Elimina las líneas en blanco y los espacios del principio y del final del texto pegado.',
            trimAliases: ['espacio', 'línea en blanco', 'salto de línea', 'recortar'],
            invisibleName: 'Caracteres invisibles',
            invisibleDesc: 'Elimina los espacios de ancho cero y convierte los espacios duros en espacios normales.',
            invisibleAliases: ['ia', 'chatgpt', 'claude', 'llm', 'unicode', 'invisible', 'nbsp', 'espacio'],
            invisibleExampleStart: 'El',
            invisibleExampleMiddle: 'resultado',
            invisibleExampleEnd: ' fue bueno.',
            invisibleExampleAfter: 'El resultado fue bueno.',
            quotesName: 'Comillas',
            quotesDesc: 'Convierte las comillas tipográficas y los apóstrofos en comillas rectas.',
            quotesAliases: ['comillas', 'comillas tipográficas', 'comillas rectas', 'apóstrofo', 'puntuación', 'tipografía', 'ia'],
            quotesExample: '“Bien”, dijo.',
            dashesName: 'Guiones y rayas',
            dashesDesc: 'Convierte las semirrayas y las rayas en guiones.',
            dashesAliases: ['raya', 'guion largo', 'semirraya', 'guion', 'puntuación', 'tipografía', 'ia'],
            dashesExample: 'El resultado — contra todo pronóstico — fue bueno.'
        }
    },

    imageModal: {
        title: 'Opciones de imagen',
        sizeName: 'Tamaño',
        className: 'Clase CSS',
        none: 'No hacer nada',
        apply: 'Aplicar',
        cancel: 'Cancelar'
    },

    welcome: {
        title: 'Te damos la bienvenida a Better Paste',
        intro: [
            'Copia imágenes de Safari directamente a tu bóveda, pega enlaces sin parámetros de seguimiento, arregla la salida de terminal con líneas partidas y limpia el texto de IA. Solo pega, y Better Paste se encarga del resto.',
            'Un consejo antes de empezar: asigna **Pegar sin procesar** a `Cmd+Shift+V` (`Ctrl+Shift+V` en Windows) para poder pegar siempre exactamente lo que hay en el portapapeles.',
            'Cada regla tiene su propio interruptor en Ajustes, Better Paste, y la propiedad `bp: false` desactiva el plugin en esa nota.'
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
