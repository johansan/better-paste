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
        imagesFailedNothingPasted: '{images}, así que no se pegó nada. El portapapeles todavía lo tiene.',
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
            supportDesc: 'Si Better Paste te resulta útil, considera apoyar su desarrollo continuo.',
            supportAliases: ['patrocinar', 'donar', 'café', 'github'],
            sponsorButton: '❤️ Patrocinar',
            coffeeButton: '☕️ Invítame a un café'
        },

        behavior: {
            heading: 'Comportamiento',
            autoCleanName: 'Limpiar cada pegado',
            autoCleanDesc:
                'Aplica las reglas en cada pegado. Desactívalo para usar solo los comandos. Una nota concreta puede quedar excluida con la propiedad "better-paste: false".',
            autoCleanAliases: ['automático', 'activar', 'desactivar', 'nota', 'excluir', 'propiedad', 'frontmatter', 'excepción'],
            showNoticesName: 'Mostrar un aviso cuando se modifica un pegado',
            showNoticesDesc: 'Un resumen de una línea de lo que se limpió. Los fallos se informan siempre, sea cual sea este ajuste.',
            showNoticesAliases: ['aviso', 'resumen', 'mensaje', 'notificación', 'silencio']
        },

        images: {
            heading: 'Imágenes',
            savingName: 'Guardar en la bóveda las imágenes pegadas',
            savingDesc:
                'Guarda las imágenes pegadas como archivos locales en lugar de dejar enlaces externos. Incluye "Copiar imagen" de Safari, las imágenes dentro de contenido web copiado y las direcciones de imagen sueltas. Las imágenes se guardan en la carpeta de adjuntos de tu bóveda. Con "Nombre del origen":',
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
            pageDesc: 'Nombres de archivo y ancho de imagen por nota.',
            nameFormatName: 'Nombres de archivo',
            nameFormatDesc: 'Elige cómo se nombran los archivos de imagen guardados.',
            nameFormatSource: 'Nombre del origen',
            nameFormatCustom: 'Formato propio',
            customName: 'Formato propio',
            customDesc: 'Usa {{name}} para el nombre de origen y formatos de fecha de Moment como YYYY-MM-DD.',
            customMomentLink: 'Formato de Moment',
            customExample: 'Ejemplo: {value}',
            customAliases: ['nombre', 'archivo', 'fecha', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'Propiedad de ancho de imagen',
            sizePropertyDesc:
                'La propiedad del frontmatter que define el ancho de las imágenes pegadas en una nota. Una nota que use esta propiedad se encarga de las capturas de pantalla en lugar de Obsidian. Déjala en blanco para desactivarla.',
            sizePropertyAliases: ['tamaño', 'frontmatter', 'propiedad', 'redimensionar']
        },

        links: {
            heading: 'Enlaces',
            titlesName: 'Obtener el título de los enlaces pegados',
            titlesDesc:
                'Cuando el portapapeles contiene solo una dirección web que no es una imagen, se obtiene el título de la página y se pega un enlace de Markdown. Cualquier otro texto seleccionado pasa a ser la etiqueta sin hacer ninguna petición. Si el título no se puede obtener, se conserva la dirección original.',
            titlesAliases: ['título', 'página', 'sitio web', 'enlace markdown', 'descargar'],
            cleaningName: 'Limpiar los enlaces pegados',
            cleaningDesc: 'Elimina los parámetros de seguimiento de los enlaces pegados. La parte tachada se elimina:',
            cleaningAliases: ['url', 'seguimiento', 'utm', 'parámetros', 'consulta', 'sitio', 'dominio', 'youtube', 'excepción'],
            stripName: 'Qué parámetros eliminar',
            stripDesc:
                'Elige si se eliminan todos los parámetros de consulta o solo los de seguimiento conocidos. Las reglas de sitio pueden conservar parámetros en cualquiera de los dos modos.',
            stripAliases: ['utm', 'seguimiento', 'consulta', 'parámetros'],
            stripAll: 'Todos los parámetros, salvo donde una regla de sitio los conserve',
            stripTracking: 'Solo los parámetros de seguimiento conocidos',
            rulesName: 'Reglas para conservar parámetros',
            rulesDesc: 'Reglas de sitio para conservar parámetros de consulta concretos en cualquiera de los modos de eliminación.',
            rulesCount: { one: '{count} sitio', other: '{count} sitios' },
            listName: 'Tus reglas de sitio',
            listDesc:
                '{sites} ya están cubiertos y se mantienen al día con el complemento. Añade aquí tus propias reglas de sitio, una por línea. "example.com" conserva todos los parámetros de ese sitio, "example.com: a, b" conserva solo esos dos, y "!example.com" descarta una regla incluida en el complemento. En el modo "Solo los parámetros de seguimiento conocidos", una regla solo rescata los parámetros de seguimiento que coincidan, porque los demás ya se conservan. Los subdominios se reconocen automáticamente.',
            listShippedCount: { one: '{count} sitio habitual', other: '{count} sitios habituales' },
            listAliases: ['dominio', 'excepción', 'lista blanca', 'youtube'],
            listInvalid: 'No es un nombre de sitio: {values}',
            testerName: 'Pruébalo',
            testerDesc: 'Pega un enlace para ver qué conservarían estas reglas.',
            testerLabel: 'Enlace para limpiar',
            testerEmpty: 'El enlace limpio aparece aquí.'
        },

        terminal: {
            heading: 'Texto de terminal',
            cleanupName: 'Limpiar la salida de terminal',
            cleanupDesc:
                'Vuelve a unir las líneas partidas de la salida de terminal y quita la sangría. Se eliminan los códigos de color. Los bloques de código, las tablas y los elementos de lista no se tocan.',
            cleanupAliases: ['ajuste', 'unir', 'ansi', 'consola', 'shell', 'sangría', 'viñeta', 'lista', 'markdown'],
            pageName: 'Tratamiento del texto de terminal',
            pageDesc: 'Condiciones para volver a unir y caracteres de viñeta.',
            rejoinName: 'Cuándo volver a unir una línea partida',
            rejoinDesc: 'La condición necesaria para tratar una línea como continuación de la anterior.',
            rejoinAliases: ['sangría', 'ajuste', 'agresivo', 'seguro', 'git log'],
            rejoinIndented: 'Solo cuando la línea siguiente está sangrada',
            rejoinAny: 'Siempre que la línea de arriba parezca llena',
            rejoinNever: 'No unir nunca, solo quitar códigos y sangría',
            bulletsName: 'Caracteres de viñeta',
            bulletsDesc:
                'Determina si los caracteres de viñeta (como •) de la salida de terminal se conservan o se convierten en elementos de lista de Markdown.',
            bulletsAliases: ['lista', 'markdown', 'guion'],
            bulletsMarkdown: 'Convertir en elementos de lista de Markdown',
            bulletsPreserve: 'Dejarlos como están',
            testerName: 'Pruébalo',
            testerDesc: 'Pega salida de terminal para ver cómo quedaría limpia.',
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
            commasDesc: 'Elige dónde colocar una coma junto a una comilla doble de cierre.',
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
