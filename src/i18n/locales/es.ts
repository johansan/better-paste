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
        pasteRaw: 'Pegar como texto sin formato',
        cleanSelection: 'Limpiar la selección',
        cleanTerminal: 'Limpiar la salida de terminal',
        cleanPdf: 'Limpiar texto de PDF',
        runSnippet: 'Ejecutar fragmento',
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
        fetchingTitles: 'obteniendo los títulos...',
        titlesFailed: {
            one: 'no se pudo obtener {count} título',
            other: 'no se pudieron obtener {count} títulos'
        },
        imagesFailed: {
            one: 'no se pudo guardar {count} imagen',
            other: 'no se pudieron guardar {count} imágenes'
        },
        imagesFailedLinkKept: '{images}, se conservó el enlace original',
        imagesFailedNothingPasted: '{images}, así que no se pegó nada',
        snippetsCopied: 'fragmentos copiados',
        snippetsCopyFailed: 'no se pudieron copiar los fragmentos'
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
            showReleaseNotesName: 'Mostrar las novedades tras una actualización',
            showReleaseNotesDesc: 'Abre el diálogo de novedades una vez tras cada actualización.',
            showReleaseNotesAliases: ['notas de la versión', 'novedades', 'actualización', 'diálogo', 'popup', 'aviso'],
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
                'Aplica las reglas en cada pegado. Si se desactiva, las reglas solo se aplican mediante los comandos de Better Paste. Una nota concreta puede quedar excluida con la propiedad "{property}: false", o incluida con "{property}: true".',
            autoCleanAliases: ['automático', 'activar', 'desactivar', 'nota', 'excluir', 'propiedad', 'frontmatter', 'excepción'],
            notePropertyName: 'Propiedad de la nota',
            notePropertyDesc: 'Propiedad que activa o desactiva Better Paste en una sola nota.',
            notePropertyAliases: ['nota', 'propiedad', 'frontmatter', 'excluir', 'desactivar', 'activar', 'bp']
        },

        images: {
            heading: 'Adjuntos',
            fileModeName: 'Archivos pegados',
            fileModeDesc:
                'Elige qué pasa cuando pegas archivos desde tu dispositivo, como PDF y capturas de pantalla. "No hacer nada" deja lo pegado en manos de Obsidian, vista previa incluida. "Enlazar sin vista previa" elimina el signo de exclamación.',
            fileModeChoiceOff: 'No hacer nada',
            fileModeChoiceLink: 'Enlazar sin vista previa',
            fileModeAliases: [
                'archivo',
                'adjunto',
                'vista previa',
                'incrustar',
                'enlace',
                'pdf',
                'captura de pantalla',
                'signo de exclamación'
            ],
            savingName: 'Imágenes de la web',
            savingDesc:
                'Elige qué pasa cuando pegas enlaces a imágenes de la web. "No hacer nada" deja lo pegado tal cual, "Enlazar con vista previa" muestra la imagen directamente desde la web y "Descargar con vista previa" guarda una copia en tu bóveda.',
            savingDownloadDesc: 'Por defecto, el nombre del archivo procede de la dirección:',
            savingChoiceOff: 'No hacer nada',
            savingChoiceLink: 'Enlazar con vista previa',
            savingChoiceDownload: 'Descargar con vista previa',
            savingAliases: [
                'descargar',
                'enlazar',
                'incrustar',
                'vista previa',
                'url',
                'web',
                'adjunto',
                'safari',
                'local',
                'imagen',
                'carpeta'
            ],
            sizeStyleName: 'Tamaño y estilo',
            sizeStyleDesc: 'Añade un ancho o una clase CSS a las imágenes pegadas, de forma automática o mediante un selector.',
            sizeStyleAliases: ['tamaño', 'ancho', 'css', 'clase', 'estilo', 'redimensionar', 'invert'],
            summarySize: 'Tamaño: {value}',
            summaryStyle: 'Estilo: {value}',
            summaryAsk: 'Preguntar',
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
            customDesc:
                'Usa {{name}} para el nombre de origen, {{noteName}} para el nombre de la nota, {{property:xyz}} para una propiedad del frontmatter, {{counter}} o {{counter:2}} para un número creciente y formatos de fecha de Moment como YYYY-MM-DD.',
            customScreenshotDesc:
                'Una captura de pantalla no tiene nombre de origen, así que su {{name}} se convierte en "Pasted image" con marca de tiempo, como en Obsidian.',
            namingInfoTitle: 'Cuándo se aplica el formato de nombre de archivo',
            namingInfoLead: '¡Importante! Better Paste no puede hacer lo siguiente:',
            namingInfoExplorer: 'Renombrar un archivo que copias en el Finder o el Explorador y pegas',
            namingInfoDrag: 'Renombrar un archivo que arrastras a una nota',
            namingInfoMobile: 'Procesar lo pegado con el comando Pegar de Obsidian en el móvil. Usa "{command}" en su lugar.',
            customMomentLink: 'Formato de Moment',
            customExample: 'Ejemplo: {value}',
            customExampleNote: 'Mi nota',
            customAliases: [
                'nombre',
                'archivo',
                'fecha',
                'moment',
                'YYYY',
                '{{name}}',
                'contador',
                'propiedad',
                'nombre de nota',
                'captura',
                'renombrar',
                'portapapeles',
                'paste image rename'
            ],
            sizePropertyName: 'Propiedad de ancho de imagen',
            sizePropertyDesc:
                'Propiedad del frontmatter que fija el ancho de las imágenes pegadas en una nota. Con "{property}: 400" en la nota, una imagen pegada queda como ![[photo.png|400]]. Déjala en blanco para no añadir ancho.',
            sizePropertyAliases: ['tamaño', 'frontmatter', 'propiedad', 'redimensionar']
        },

        links: {
            heading: 'Enlaces',
            titlesName: 'Obtener el título de los enlaces pegados',
            titlesDesc:
                'Al pegar una dirección web sola se inserta un enlace de Markdown con el título de la página. Al pegar una URL de Obsidian se inserta un enlace con el nombre de la nota. Si hay texto seleccionado, ese texto pasa a ser la etiqueta y no se obtiene ningún título. Si el título no se puede obtener, se conserva la dirección tal cual.',
            titlesAliases: ['título', 'página', 'sitio web', 'enlace markdown', 'descargar'],
            cleaningName: 'Limpiar los enlaces pegados',
            cleaningDesc: 'Elimina los parámetros de seguimiento de los enlaces pegados:',
            cleaningAliases: ['url', 'seguimiento', 'utm', 'parámetros', 'consulta', 'sitio', 'dominio', 'youtube', 'excepción'],
            removalsName: 'Eliminaciones en los enlaces',
            removalsDesc: 'Parámetros adicionales para eliminar en todas partes o en sitios web específicos.',
            rulesCount: { one: '{count} entrada', other: '{count} entradas' },
            builtInName: 'Eliminaciones integradas',
            builtInDesc:
                'Actualizado el {date}. Filtros de seguimiento globales: {trackingCount}. Reglas específicas de cada sitio web: {siteCount}. Los enlaces firmados criptográficamente permanecen sin cambios.',
            builtInButton: 'Ver lista',
            listName: 'Tus eliminaciones',
            listDesc:
                'Elimina un parámetro de los enlaces normales en cualquier sitio web introduciendo solo su nombre. Por ejemplo, «fbclid» elimina el parámetro «fbclid» dondequiera que aparezca.\n\nElimina parámetros solo en un sitio web con «example.com | source, ref». Esto elimina «source» y «ref» de example.com y sus subdominios, mientras que se conservan todos los demás parámetros. Empieza una línea con «!» para desactivar las eliminaciones integradas para ese sitio web. Los enlaces firmados criptográficamente siempre permanecen sin cambios.',
            listAliases: ['dominio', 'parámetro', 'filtro', 'eliminar', 'youtube'],
            listInvalid: 'Regla de eliminación no válida: {values}',
            suggestName: 'Sugiere tus eliminaciones',
            suggestDesc: 'Ayuda a mejorar las eliminaciones integradas aportando parámetros que eliminar.',
            suggestAliases: ['colabora', 'enviar', 'compartir', 'mandar', 'filtro'],
            suggestButton: 'Revisar y enviar',
            testerName: 'Pruébalo',
            testerDesc: 'Pega un enlace para ver el resultado limpio.',
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
        },

        structure: {
            heading: 'Estructura',
            listNestingName: 'Mantener el anidamiento de listas al pegar',
            listNestingDesc:
                'Pega una lista copiada con su jerarquía intacta, con la sangría ajustada al elemento de lista sobre el que pegas.',
            listNestingAliases: ['lista', 'anidada', 'sangría', 'jerarquía', 'esquema', 'viñetas', 'casilla', 'árbol'],
            quoteContinuationName: 'Continuar citas en bloque al pegar',
            quoteContinuationDesc:
                'Pega texto de varias líneas en una línea citada y cita cada línea, para que todo el contenido pegado permanezca dentro de la cita en bloque o del destacado.',
            quoteContinuationAliases: ['cita', 'cita en bloque', 'destacado', 'advertencia', 'párrafo']
        },

        custom: {
            heading: 'Procesamiento personalizado',
            pipelineName: 'Aplicar fragmentos personalizados de expresiones regulares al texto',
            pastedText: 'Texto pegado',
            note: 'Nota',
            wikiButton: 'Ver wiki',
            regexButton: 'Abrir probador de expresiones regulares',
            snippetsName: 'Fragmentos de texto',
            snippetsDesc: 'Se aplican a todo el texto pegado después de las reglas integradas. Activa los que deban ejecutarse al pegar.',
            urlSnippetsName: 'Fragmentos de enlace',
            urlSnippetsDesc:
                'Se aplican a cada enlace pegado después de obtener el título de la página. Las reglas solo ven el enlace de Markdown final, y el destino se mantiene sin cambios.',
            enabledSnippetsCount: { one: '{count} fragmento activado', other: '{count} fragmentos activados' },
            snippetRulesCount: { one: '{count} regla', other: '{count} reglas' },
            invalidRulesCount: { one: '{count} línea no válida', other: '{count} líneas no válidas' },
            unnamedSnippet: 'Fragmento sin nombre',
            emptyState: 'Todavía no has creado ningún fragmento.',
            addSnippet: 'Añadir fragmento',
            editButton: 'Editar fragmento',
            exportName: 'Exportar fragmentos',
            exportDesc: 'Copia todos los fragmentos en el formato de intercambio de la wiki.',
            exportButton: 'Copiar fragmentos',
            importName: 'Importar fragmentos',
            importDesc: 'Añade fragmentos desde el formato de intercambio de la wiki.',
            previewName: 'Pruébalo',
            previewDesc: 'Escribe un texto de ejemplo para ver el resultado de todos los fragmentos activados.',
            modalPreviewDesc: 'Escribe un texto de ejemplo para ver el resultado de este fragmento.',
            previewInputLabel: 'Texto de ejemplo',
            previewEmpty: 'El texto procesado aparece aquí.',
            urlPreviewDesc: 'Pega un enlace de Markdown para ver el resultado de todos los fragmentos de enlace activados.',
            urlModalPreviewDesc: 'Pega un enlace de Markdown para ver el resultado de este fragmento.',
            urlPreviewLabel: 'Enlace con título de ejemplo',
            urlPreviewEmpty: 'El enlace procesado aparece aquí.',
            nameName: 'Nombre',
            rulesName: 'Reglas',
            rulesDesc: 'Introduce un reemplazo con expresión regular de JavaScript por línea.',
            wikiPasteHint: 'Copia un fragmento listo de la wiki y pégalo directamente en el campo de reglas.',
            invalidLine: 'Línea {line}: {value}',
            saveButton: 'Guardar',
            recognizedSnippetsCount: { one: '{count} fragmento reconocido', other: '{count} fragmentos reconocidos' },
            recognizedRulesCount: { one: '{count} regla reconocida', other: '{count} reglas reconocidas' },
            unparseableName: 'Líneas no reconocidas',
            importFallbackName: 'Fragmento importado',
            defaultSnippetBoldHeadings: 'Quitar negrita de los encabezados',
            defaultSnippetBlankLines: 'Combinar líneas en blanco',
            defaultSnippetSiteSuffixes: 'Quitar nombres de sitios web de los títulos'
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

    pdfModal: {
        furniture: 'Quitar números de página',
        singleParagraph: 'Unir todo en un solo párrafo',
        description:
            'Las líneas cortadas se vuelven a unir, las palabras divididas con guion se reparan, las ligaduras se convierten en letras normales y los espacios sobrantes se eliminan.',
        preview: 'Vista previa'
    },

    welcome: {
        title: 'Te damos la bienvenida a Better Paste',
        intro: [
            'Copia imágenes de Safari directamente a tu bóveda, pega enlaces sin parámetros de seguimiento, arregla la salida de terminal con líneas partidas y limpia el texto de IA. Solo pega, y Better Paste se encarga del resto.',
            'Un consejo antes de empezar: asigna **Pegar sin procesar** a `Cmd+Shift+V` (`Ctrl+Shift+V` en Windows) para poder pegar siempre exactamente lo que hay en el portapapeles.',
            'Cada regla tiene su propio interruptor en Ajustes, Better Paste, y la propiedad `{property}: false` desactiva el plugin en esa nota.'
        ],
        startButton: 'Empezar'
    },

    overlap: {
        title: 'Better Paste: plugins que se solapan',
        thanks: '¡Gracias por instalar y usar Better Paste!',
        intro: {
            one: 'Ahora mismo tienes {count} plugin instalado que hace más o menos lo mismo que Better Paste, así que desactiva o desinstala:',
            other: 'Ahora mismo tienes {count} plugins instalados que hacen más o menos lo mismo que Better Paste, así que desactiva o desinstala:'
        },
        outro: 'Se desactivan en Ajustes > Complementos comunitarios.',
        dontRemind: 'No volver a mostrar este mensaje',
        button: 'Entendido'
    },

    whatsNew: {
        title: 'Novedades de Better Paste',
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
