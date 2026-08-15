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
        imagesFailedNothingPasted: '{images}, donc rien n’a été collé',
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
            heading: 'À propos',
            whatsNewName: 'Nouveautés de Better Paste {version}',
            whatsNewDesc: 'Ce qui a changé dans les versions les plus récentes.',
            whatsNewAliases: ['notes de version', 'changements', 'journal des modifications', 'version', 'mise à jour', 'historique'],
            whatsNewButton: 'Voir les nouveautés',
            supportName: 'Soutenir le développement',
            supportDesc: 'Si Better Paste vous est utile, envisagez de soutenir son développement.',
            supportAliases: ['parrainer', 'don', 'café', 'github'],
            sponsorButton: '❤️ Parrainer',
            coffeeButton: '☕️ Offrez-moi un café',
            pluginsName: 'Découvrez mes autres plugins',
            pluginsAliases: ['plugins', 'extensions', 'notebook navigator', 'pixel perfect image', 'auteur'],
            notebookNavigatorDesc: 'Un meilleur explorateur de fichiers et calendrier',
            pixelPerfectImageDesc: 'Redimensionnement exact des images et plus'
        },

        behavior: {
            autoCleanName: 'Nettoyer chaque collage',
            autoCleanDesc:
                'Applique les règles à chaque collage. Si cette option est désactivée, les règles ne s’appliquent que via les commandes Better Paste. Une note peut s’en exclure avec la propriété "bp: false", ou s’y inclure avec "bp: true".',
            autoCleanAliases: ['automatique', 'activer', 'désactiver', 'note', 'exclure', 'propriété', 'frontmatter', 'exception'],
            showNoticesName: 'Afficher une notification quand un collage est modifié',
            showNoticesDesc: 'Un résumé sur une ligne de ce qui a changé. Les échecs sont toujours signalés.',
            showNoticesAliases: ['notification', 'résumé', 'message', 'avis', 'silencieux']
        },

        images: {
            heading: 'Images',
            savingName: 'Enregistrer les images collées dans le coffre',
            savingDesc:
                'Enregistre les images collées dans votre dossier de pièces jointes et crée un lien vers le fichier local plutôt que vers l’adresse web. Concerne « Copier l’image » de Safari, les images contenues dans du contenu web copié et les adresses d’image collées. Par défaut, le nom du fichier vient de l’adresse :',
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
            nameFormatName: 'Noms de fichiers',
            nameFormatDesc: 'Comment les images enregistrées sont nommées.',
            nameFormatSource: 'Nom d’après la source',
            nameFormatCustom: 'Format personnalisé',
            customName: 'Format personnalisé',
            customDesc: 'Utilisez {{name}} pour le nom de la source et les formats de date Moment comme YYYY-MM-DD.',
            customMomentLink: 'Format Moment',
            customExample: 'Exemple : {value}',
            customAliases: ['nom', 'fichier', 'date', 'moment', 'YYYY', '{{name}}']
        },

        frontmatter: {
            heading: 'Frontmatter',
            notePropertyName: 'Propriété de note',
            notePropertyDesc:
                'Propriété qui active ou désactive Better Paste pour une seule note. Avec "bp: false" la note reste intacte, et avec "bp: true" elle est nettoyée même si « Nettoyer chaque collage » est désactivé. Laissez vide pour ignorer la propriété.',
            notePropertyAliases: ['note', 'propriété', 'frontmatter', 'exclure', 'désactiver', 'activer', 'bp'],
            sizePropertyName: 'Propriété de largeur d’image',
            sizePropertyDesc:
                'Propriété du frontmatter qui fixe la largeur des images collées dans une note. Avec "bp-image-width: 400" dans la note, une image collée devient ![[photo.png|400]]. Laissez vide pour n’ajouter aucune largeur.',
            sizePropertyAliases: ['taille', 'frontmatter', 'propriété', 'redimensionner']
        },

        links: {
            heading: 'Liens',
            titlesName: 'Récupérer le titre des liens collés',
            titlesDesc:
                'Coller une adresse web seule insère un lien Markdown portant le titre de la page. Si du texte est sélectionné, ce texte devient le libellé et aucun titre n’est récupéré. L’adresse brute est conservée si le titre ne peut pas être récupéré.',
            titlesAliases: ['titre', 'page', 'site web', 'lien markdown', 'télécharger'],
            cleaningName: 'Nettoyer les liens collés',
            cleaningDesc: 'Supprime les paramètres de suivi des liens collés :',
            cleaningAliases: ['url', 'suivi', 'utm', 'paramètres', 'requête', 'site', 'domaine', 'youtube', 'exception'],
            stripName: 'Quels paramètres supprimer',
            stripDesc: 'Les paramètres de suivi sont des noms comme utm_source, fbclid et gclid.',
            stripAliases: ['utm', 'suivi', 'requête', 'paramètres'],
            stripAll: 'Tous les paramètres, sauf si une règle de site les conserve',
            stripTracking: 'Uniquement les paramètres de suivi connus',
            rulesName: 'Règles de site',
            rulesDesc: 'Paramètres à conserver sur certains sites.',
            rulesCount: { one: '{count} site', other: '{count} sites' },
            listName: 'Vos règles de site',
            listDesc:
                '{sites} sont déjà pris en charge par le module. Ajoutez ici vos propres règles, une par ligne. « example.com » conserve tous les paramètres de ce site, « example.com: a, b » n’en conserve que deux, et « !example.com » retire une règle livrée avec le module. Les sous-domaines sont reconnus automatiquement.',
            listShippedCount: { one: '{count} site courant', other: '{count} sites courants' },
            listAliases: ['domaine', 'exception', 'liste blanche', 'youtube'],
            listInvalid: 'Ce n’est pas un nom de site : {values}',
            testerName: 'Essayer',
            testerDesc: 'Collez un lien pour voir ce que les règles conservent.',
            testerLabel: 'Lien à nettoyer',
            testerEmpty: 'Le lien nettoyé apparaît ici.'
        },

        terminal: {
            heading: 'Texte de terminal',
            cleanupName: 'Nettoyer la sortie de terminal',
            cleanupDesc:
                'Rassemble les lignes coupées par le terminal et retire les codes de couleur et l’indentation de début. Les blocs de code, les tableaux et les listes ne sont pas touchés.',
            cleanupAliases: ['retour à la ligne', 'rassembler', 'ansi', 'console', 'shell', 'indentation', 'puce', 'liste', 'markdown'],
            pageName: 'Traitement du texte de terminal',
            pageDesc: 'Rassemblement des lignes et caractères de puce.',
            rejoinName: 'Quand rassembler une ligne coupée',
            rejoinDesc: 'Une ligne n’est rattachée à celle du dessus que si celle-ci semble pleine.',
            rejoinAliases: ['indentation', 'retour à la ligne', 'agressif', 'sûr', 'git log'],
            rejoinIndented: 'Seulement si la ligne est indentée',
            rejoinAny: 'Que la ligne soit indentée ou non',
            rejoinNever: 'Jamais, retirer seulement les codes et l’indentation',
            bulletsName: 'Caractères de puce',
            bulletsDesc: 'Que faire des caractères de puce comme • dans la sortie de terminal.',
            bulletsAliases: ['liste', 'markdown', 'tiret'],
            bulletsMarkdown: 'Convertir en éléments de liste Markdown',
            bulletsPreserve: 'Les laisser tels quels',
            testerName: 'Essayer',
            testerDesc: 'Collez une sortie de terminal pour voir comment elle est nettoyée.',
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
            commasDesc: 'Où placer une virgule à côté d’un guillemet double fermant.',
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
            'Une note peut s’exclure entièrement avec la propriété "bp: false". Les réglages se trouvent dans Paramètres, Better Paste.'
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
