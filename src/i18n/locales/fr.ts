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

/** French. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_FR: TranslationStrings = {
    commands: {
        paste: 'Coller',
        pasteRaw: 'Coller sans traitement',
        cleanSelection: 'Nettoyer la sélection',
        toggleCleanup: 'Activer ou désactiver le nettoyage automatique'
    },

    notices: {
        prefix: 'Better Paste : {message}',
        separator: ', ',
        cleanupOn: 'traitement automatique activé',
        cleanupOff: 'traitement automatique désactivé',
        selectTextFirst: 'sélectionnez d’abord du texte',
        nothingToClean: 'rien à nettoyer',
        clipboardFailed: 'impossible de lire le presse-papiers',
        titleFailed: 'impossible de récupérer le titre.',
        fetchingTitle: 'récupération du titre{dots}',
        imagesFailed: {
            one: '{count} image n’a pas pu être enregistrée',
            other: '{count} images n’ont pas pu être enregistrées'
        },
        imagesFailedLinkKept: '{images}, le lien d’origine a été conservé',
        imagesFailedNothingPasted: '{images}, donc rien n’a été collé. Le presse-papiers le contient toujours.',
        aiTextCleaned: 'texte d’IA nettoyé',
        terminalCleaned: 'sortie de terminal nettoyée',
        textProcessed: 'style du texte ajusté',
        urlsCleaned: { one: '{count} URL nettoyée', other: '{count} URL nettoyées' },
        imagesSaved: { one: '{count} image enregistrée', other: '{count} images enregistrées' }
    },

    settings: {
        exampleFallback: '{description} Exemple : {example}',
        plainFallback: '{description} {example}',

        start: {
            whatsNewName: 'Nouveautés de Better Paste {version}',
            whatsNewDesc: 'Ce qui a changé dans les versions les plus récentes.',
            whatsNewAliases: ['notes de version', 'changements', 'journal des modifications', 'version', 'mise à jour', 'historique'],
            whatsNewButton: 'Voir les nouveautés',
            supportName: 'Soutenir le développement',
            supportDesc: 'Si Better Paste vous est utile, envisagez de soutenir son développement.',
            supportAliases: ['parrainer', 'don', 'café', 'github'],
            sponsorButton: '❤️ Parrainer',
            coffeeButton: '☕️ Offrez-moi un café'
        },

        behavior: {
            heading: 'Comportement',
            autoCleanName: 'Nettoyer chaque collage',
            autoCleanDesc:
                'Applique les règles à chaque collage. Désactivez cette option pour n’utiliser que les commandes. Une note peut s’en exclure avec la propriété "better-paste: false".',
            autoCleanAliases: ['automatique', 'activer', 'désactiver', 'note', 'exclure', 'propriété', 'frontmatter', 'exception'],
            showNoticesName: 'Afficher une notification quand un collage est modifié',
            showNoticesDesc:
                'Un résumé sur une ligne de ce qui a été nettoyé. Les échecs sont toujours signalés, quelle que soit cette option.',
            showNoticesAliases: ['notification', 'résumé', 'message', 'avis', 'silencieux']
        },

        images: {
            heading: 'Images',
            savingName: 'Enregistrer les images collées dans le coffre',
            savingDesc:
                'Enregistre les images collées sous forme de fichiers locaux plutôt que de laisser des liens externes. Cela vaut pour « Copier l’image » de Safari, les images contenues dans du contenu web copié et les adresses d’image isolées. Les images sont enregistrées dans le dossier de pièces jointes de votre coffre. Avec « Nom d’après la source » :',
            savingAliases: [
                'télécharger',
                'pièce jointe',
                'safari',
                'capture d’écran',
                'image',
                'dossier',
                'nom de fichier',
                'largeur',
                'taille'
            ],
            pageName: 'Traitement des images',
            pageDesc: 'Noms de fichiers et largeur d’image par note.',
            nameFormatName: 'Noms de fichiers',
            nameFormatDesc: 'Choisissez comment nommer les fichiers image enregistrés.',
            nameFormatSource: 'Nom d’après la source',
            nameFormatCustom: 'Format personnalisé',
            customName: 'Format personnalisé',
            customDesc: 'Utilisez {{name}} pour le nom de la source et les formats de date Moment comme YYYY-MM-DD.',
            customMomentLink: 'Format Moment',
            customExample: 'Exemple : {value}',
            customAliases: ['nom', 'fichier', 'date', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'Propriété de largeur d’image',
            sizePropertyDesc:
                'La propriété du frontmatter qui définit la largeur des images collées dans une note. Une note utilisant cette propriété prend en charge les captures d’écran à la place d’Obsidian. Laissez vide pour désactiver.',
            sizePropertyAliases: ['taille', 'frontmatter', 'propriété', 'redimensionner']
        },

        links: {
            heading: 'Liens',
            titlesName: 'Récupérer le titre des liens collés',
            titlesDesc:
                'Lorsque le presse-papiers ne contient qu’une adresse web qui n’est pas une image, son titre de page est récupéré et un lien Markdown est collé. Tout autre texte sélectionné devient le libellé sans aucune requête. Si le titre ne peut pas être récupéré, l’adresse d’origine est conservée.',
            titlesAliases: ['titre', 'page', 'site web', 'lien markdown', 'télécharger'],
            cleaningName: 'Nettoyer les liens collés',
            cleaningDesc: 'Supprime les paramètres de suivi des liens collés. La partie barrée est supprimée :',
            cleaningAliases: ['url', 'suivi', 'utm', 'paramètres', 'requête', 'site', 'domaine', 'youtube', 'exception'],
            stripName: 'Quels paramètres supprimer',
            stripDesc:
                'Choisissez de supprimer tous les paramètres de requête ou seulement les paramètres de suivi connus. Les règles de site peuvent conserver des paramètres dans les deux modes.',
            stripAliases: ['utm', 'suivi', 'requête', 'paramètres'],
            stripAll: 'Tous les paramètres, sauf si une règle de site les conserve',
            stripTracking: 'Uniquement les paramètres de suivi connus',
            rulesName: 'Règles de conservation des paramètres',
            rulesDesc: 'Règles de site pour conserver certains paramètres de requête dans les deux modes de suppression.',
            rulesCount: { one: '{count} site', other: '{count} sites' },
            listName: 'Vos règles de site',
            listDesc:
                '{sites} sont déjà pris en charge et restent à jour avec le module. Ajoutez ici vos propres règles de site, une par ligne. « example.com » conserve tous les paramètres de ce site, « example.com: a, b » n’en conserve que deux, et « !example.com » supprime une règle livrée avec le module. En mode « Uniquement les paramètres de suivi connus », une règle ne récupère que les paramètres de suivi correspondants, car les autres sont déjà conservés. Les sous-domaines sont reconnus automatiquement.',
            listShippedCount: { one: '{count} site courant', other: '{count} sites courants' },
            listAliases: ['domaine', 'exception', 'liste blanche', 'youtube'],
            listInvalid: 'Ce n’est pas un nom de site : {values}',
            testerName: 'Essayer',
            testerDesc: 'Collez un lien pour voir ce que ces règles conserveraient.',
            testerLabel: 'Lien à nettoyer',
            testerEmpty: 'Le lien nettoyé apparaît ici.'
        },

        terminal: {
            heading: 'Texte de terminal',
            cleanupName: 'Nettoyer la sortie de terminal',
            cleanupDesc:
                'Rassemble les lignes coupées de la sortie de terminal et supprime l’indentation. Les codes de couleur sont retirés. Les blocs de code, les tableaux et les éléments de liste ne sont pas touchés.',
            cleanupAliases: ['retour à la ligne', 'rassembler', 'ansi', 'console', 'shell', 'indentation', 'puce', 'liste', 'markdown'],
            pageName: 'Traitement du texte de terminal',
            pageDesc: 'Conditions de rassemblement et caractères de puce.',
            rejoinName: 'Quand rassembler une ligne coupée',
            rejoinDesc: 'La condition requise pour traiter une ligne comme la suite de la précédente.',
            rejoinAliases: ['indentation', 'retour à la ligne', 'agressif', 'sûr', 'git log'],
            rejoinIndented: 'Seulement si la ligne suivante est indentée',
            rejoinAny: 'Dès que la ligne du dessus semble pleine',
            rejoinNever: 'Ne jamais rassembler, seulement retirer les codes et l’indentation',
            bulletsName: 'Caractères de puce',
            bulletsDesc:
                'Détermine si les caractères de puce (comme •) de la sortie de terminal sont conservés ou convertis en éléments de liste Markdown.',
            bulletsAliases: ['liste', 'markdown', 'tiret'],
            bulletsMarkdown: 'Convertir en éléments de liste Markdown',
            bulletsPreserve: 'Les laisser tels quels',
            testerName: 'Essayer',
            testerDesc: 'Collez une sortie de terminal pour voir comment elle serait nettoyée.',
            testerLabel: 'Texte de terminal à nettoyer',
            testerEmpty: 'Le texte nettoyé apparaît ici.',
            testerSample: [
                '• L’étape supplémentaire se limite au gestionnaire Entrée de la liste, donc la modification principale reste simple. En parcourant les flux voisins, j’ai trouvé',
                '  deux points de friction probables à vérifier : la sélection peut sauter après le rafraîchissement.'
            ]
        },

        text: {
            heading: 'Traitement du texte',
            trimName: 'Supprimer les espaces autour',
            trimDesc: 'Supprime les lignes vides et les espaces au début et à la fin du texte collé.',
            trimAliases: ['espace', 'ligne vide', 'saut de ligne', 'rogner'],
            commasName: 'Virgules et guillemets',
            commasDesc: 'Choisissez où placer une virgule à côté d’un guillemet double fermant.',
            commasAliases: ['virgule', 'guillemet', 'citation', 'ponctuation', 'style'],
            commasNone: 'Aucun changement',
            commasInside: 'Virgule à l’intérieur des guillemets',
            commasOutside: 'Virgule à l’extérieur des guillemets',
            commasExampleSource: 'Il a dit "terminé," puis il est parti.',
            commasExampleOutside: 'Il a dit "terminé", puis il est parti.',
            invisibleName: 'Nettoyage IA : caractères invisibles',
            invisibleDesc: 'Supprime les espaces de largeur nulle et transforme les espaces insécables en espaces normaux.',
            invisibleAliases: [
                'ia',
                'chatgpt',
                'claude',
                'llm',
                'tiret',
                'tiret cadratin',
                'tiret demi-cadratin',
                'trait d’union',
                'unicode',
                'invisible',
                'nbsp',
                'typographie',
                'ponctuation',
                'espace'
            ],
            invisibleExampleStart: 'Le',
            invisibleExampleMiddle: 'résultat',
            invisibleExampleEnd: ' était bon.',
            invisibleExampleAfter: 'Le résultat était bon.',
            punctuationName: 'Nettoyage IA : tirets et guillemets',
            punctuationDesc: 'Convertit les tirets longs en traits d’union et les guillemets courbes en guillemets droits.',
            punctuationAliases: [
                'tiret cadratin',
                'tiret demi-cadratin',
                'trait d’union',
                'guillemet',
                'guillemets courbes',
                'apostrophe',
                'ponctuation',
                'typographie'
            ],
            punctuationExampleBefore: '“Le résultat — contre toute attente — était parfait.”',
            punctuationExampleAfter: '"Le résultat - contre toute attente - était parfait."'
        }
    },

    welcome: {
        title: 'Bienvenue dans Better Paste',
        intro: [
            'Better Paste modifie le contenu du presse-papiers au moment où il est collé dans une note.',
            'Il enregistre les images liées comme pièces jointes du coffre, supprime les paramètres de suivi des liens, rassemble les lignes coupées de la sortie de terminal et remplace les guillemets courbes et les caractères invisibles par leurs équivalents simples.',
            'Chaque règle peut être désactivée séparément.',
            'Une note peut s’exclure entièrement avec la propriété "better-paste: false". Les réglages se trouvent dans Paramètres, Better Paste.'
        ],
        startButton: 'Commencer'
    },

    whatsNew: {
        title: 'Nouveautés de Better Paste',
        scrollLabel: 'Notes de version',
        releaseHeading: 'Version {version} ({date})',
        categoryNew: 'Nouveau',
        categoryImproved: 'Amélioré',
        categoryChanged: 'Modifié',
        categoryFixed: 'Corrigé',
        support: 'Si Better Paste vous est utile, envisagez de soutenir son développement.',
        coffeeButton: '☕️ Offrez-moi un café',
        thanksButton: 'Merci !'
    }
};
