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

/** European Portuguese. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_PT: TranslationStrings = {
    commands: {
        paste: 'Colar',
        pasteRaw: 'Colar sem processamento',
        cleanSelection: 'Limpar a seleção',
        cleanTerminal: 'Limpar a saída do terminal',
        commasInside: 'Colocar vírgulas dentro das aspas',
        commasOutside: 'Colocar vírgulas fora das aspas',
        toggleCleanup: 'Alternar a limpeza automática'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        cleanupOn: 'processamento automático ativado',
        cleanupOff: 'processamento automático desativado',
        selectTextFirst: 'selecione texto primeiro',
        nothingToClean: 'nada para limpar',
        clipboardFailed: 'não foi possível ler a área de transferência',
        titleFailed: 'não foi possível obter o título.',
        fetchingTitle: 'a obter o título...',
        imagesFailed: {
            one: 'não foi possível guardar {count} imagem',
            other: 'não foi possível guardar {count} imagens'
        },
        imagesFailedLinkKept: '{images}, a ligação original foi mantida',
        imagesFailedNothingPasted: '{images}, por isso nada foi colado'
    },

    settings: {
        exampleFallback: '{description} Exemplo: {example}',
        plainFallback: '{description} {example}',

        start: {
            heading: 'Sobre',
            whatsNewName: 'Novidades do Better Paste {version}',
            whatsNewDesc: 'O que mudou nas versões mais recentes.',
            whatsNewAliases: ['notas de versão', 'alterações', 'registo de alterações', 'versão', 'atualização', 'histórico'],
            whatsNewButton: 'Ver as novidades',
            supportName: 'Apoiar o desenvolvimento',
            supportDesc: 'Se o Better Paste lhe é útil, considere apoiar o seu desenvolvimento.',
            supportAliases: ['patrocinar', 'donativo', 'café', 'github'],
            sponsorButton: '❤️ Patrocinar',
            coffeeButton: '☕️ Ofereça-me um café',
            pluginsName: 'Veja os meus outros plugins',
            pluginsAliases: ['plugins', 'extensões', 'notebook navigator', 'pixel perfect image', 'autor'],
            notebookNavigatorDesc: 'Um explorador de ficheiros e calendário melhores',
            pixelPerfectImageDesc: 'Redimensionamento exato de imagens e mais'
        },

        behavior: {
            autoCleanName: 'Limpar todas as colagens',
            autoCleanDesc:
                'Aplica as regras a cada colagem. Se estiver desativado, as regras só se aplicam através dos comandos do Better Paste. Uma nota isolada pode ficar de fora com a propriedade "{property}: false", ou ser incluída com "{property}: true".',
            autoCleanAliases: ['automático', 'ativar', 'desativar', 'nota', 'excluir', 'propriedade', 'frontmatter', 'exceção'],
            notePropertyName: 'Propriedade da nota',
            notePropertyDesc: 'Propriedade que ativa ou desativa o Better Paste numa única nota.',
            notePropertyAliases: ['nota', 'propriedade', 'frontmatter', 'excluir', 'desativar', 'ativar', 'bp']
        },

        images: {
            heading: 'Imagens',
            savingName: 'Guardar no cofre as imagens coladas',
            savingDesc:
                'Guarda as imagens coladas na sua pasta de anexos e liga ao ficheiro local em vez do endereço web. Abrange o "Copiar imagem" do Safari, as imagens dentro de conteúdo web copiado e os endereços de imagem colados. Por predefinição, o nome do ficheiro vem do endereço:',
            savingAliases: [
                'descarregar',
                'anexo',
                'safari',
                'captura de ecrã',
                'imagem',
                'pasta',
                'nome do ficheiro',
                'largura',
                'tamanho'
            ],
            sizeChoiceName: 'Aplicar tamanho ao colar',
            sizeChoiceDesc:
                'Adiciona uma largura a cada imagem guardada, como ![[photo.jpg|400]]. A propriedade de largura da nota tem prioridade.',
            sizeChoiceAliases: ['tamanho', 'largura', 'tamanho da imagem', 'redimensionar', 'incorporar', '400'],
            sizeOptionsName: 'Opções de tamanho',
            sizeOptionsDesc: 'As larguras oferecidas acima e no diálogo ao colar, separadas por vírgulas.',
            classChoiceName: 'Aplicar classe CSS ao colar',
            classChoiceDesc:
                'Adiciona uma classe a cada imagem guardada, como ![[photo.jpg#invert]]. Temas e fragmentos CSS decidem o que uma classe faz.',
            classChoiceAliases: ['css', 'classe', 'fragmento', 'invert', 'tema', 'filtro', 'incorporar'],
            classOptionsName: 'Opções de classe',
            classOptionsDesc: 'As classes oferecidas acima e no diálogo ao colar, separadas por vírgulas.',
            choiceNone: 'Não fazer nada',
            choiceAsk: 'Perguntar em cada colagem',
            nameFormatName: 'Nomes de ficheiro',
            nameFormatDesc: 'Como são nomeadas as imagens guardadas.',
            nameFormatSource: 'Nome a partir da origem',
            nameFormatCustom: 'Formato próprio',
            customName: 'Formato próprio',
            customDesc: 'Use {{name}} para o nome de origem e formatos de data do Moment como YYYY-MM-DD.',
            customMomentLink: 'Formato Moment',
            customExample: 'Exemplo: {value}',
            customAliases: ['nome', 'ficheiro', 'data', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'Propriedade de largura das imagens',
            sizePropertyDesc:
                'Propriedade do frontmatter que define a largura das imagens coladas numa nota. Com "{property}: 400" na nota, uma imagem colada fica ![[photo.png|400]]. Deixe em branco para não acrescentar largura.',
            sizePropertyAliases: ['tamanho', 'frontmatter', 'propriedade', 'redimensionar']
        },

        links: {
            heading: 'Ligações',
            titlesName: 'Obter o título das ligações coladas',
            titlesDesc:
                'Colar um endereço web isolado insere uma ligação Markdown com o título da página. Se houver texto selecionado, esse texto passa a ser o rótulo e nenhum título é obtido. O endereço simples é mantido quando o título não pode ser obtido.',
            titlesAliases: ['título', 'página', 'site', 'ligação markdown', 'descarregar'],
            cleaningName: 'Limpar as ligações coladas',
            cleaningDesc: 'Remove os parâmetros de rastreio das ligações coladas:',
            cleaningAliases: ['url', 'rastreio', 'utm', 'parâmetros', 'consulta', 'site', 'domínio', 'youtube', 'exceção'],
            removalsName: 'Remoções nas ligações',
            removalsDesc: 'Parâmetros adicionais a remover em todo o lado ou em sites específicos.',
            rulesCount: { one: '{count} entrada', other: '{count} entradas' },
            builtInName: 'Remoções integradas',
            builtInDesc:
                'Atualizado a {date}. Filtros de rastreio globais: {trackingCount}. Regras específicas de cada site: {siteCount}. As ligações assinadas criptograficamente permanecem inalteradas.',
            builtInButton: 'Ver lista',
            listName: 'As suas remoções',
            listDesc:
                'Remova um parâmetro de ligações comuns em qualquer site, introduzindo apenas o seu nome. Por exemplo, «fbclid» remove o parâmetro «fbclid» onde quer que este apareça.\n\nRemova parâmetros apenas num site com «example.com | source, ref». Isto remove «source» e «ref» de example.com e dos seus subdomínios, enquanto todos os outros parâmetros permanecem. Comece uma linha com «!» para desativar as remoções integradas para esse site. As ligações assinadas criptograficamente permanecem sempre inalteradas.',
            listAliases: ['domínio', 'parâmetro', 'filtro', 'remover', 'youtube'],
            listInvalid: 'Regra de remoção inválida: {values}',
            suggestName: 'Sugira as suas remoções',
            suggestDesc: 'Ajude a melhorar as remoções integradas contribuindo com parâmetros a remover.',
            suggestAliases: ['contribuir', 'submeter', 'partilhar', 'enviar', 'filtro'],
            suggestButton: 'Rever e enviar',
            testerName: 'Experimente',
            testerDesc: 'Cole uma ligação para ver o resultado limpo.',
            testerLabel: 'Ligação a limpar',
            testerEmpty: 'A ligação limpa aparece aqui.'
        },

        text: {
            heading: 'Processamento de texto',
            trimName: 'Retirar os espaços em redor',
            trimDesc: 'Remove linhas em branco e espaços do início e do fim do texto colado.',
            trimAliases: ['espaço', 'linha em branco', 'nova linha', 'aparar'],
            invisibleName: 'Caracteres invisíveis',
            invisibleDesc: 'Remove os espaços de largura zero e transforma os espaços inquebráveis em espaços normais.',
            invisibleAliases: ['ia', 'chatgpt', 'claude', 'llm', 'unicode', 'invisível', 'nbsp', 'espaço'],
            invisibleExampleStart: 'O',
            invisibleExampleMiddle: 'resultado',
            invisibleExampleEnd: ' ficou bom.',
            invisibleExampleAfter: 'O resultado ficou bom.',
            quotesName: 'Aspas',
            quotesDesc: 'Converte as aspas curvas e os apóstrofos em aspas direitas.',
            quotesAliases: ['aspas', 'aspas curvas', 'aspas direitas', 'apóstrofo', 'pontuação', 'tipografia', 'ia'],
            quotesExample: '“Bem”, disse ela.',
            dashesName: 'Travessões',
            dashesDesc: 'Converte as meias-riscas e os travessões em hífenes.',
            dashesAliases: ['travessão', 'meia-risca', 'hífen', 'pontuação', 'tipografia', 'ia'],
            dashesExample: 'O resultado — contra todas as expectativas — ficou bom.'
        }
    },

    imageModal: {
        title: 'Opções de imagem',
        sizeName: 'Tamanho',
        className: 'Classe CSS',
        none: 'Não fazer nada',
        apply: 'Aplicar',
        cancel: 'Cancelar'
    },

    welcome: {
        title: 'Bem-vindo ao Better Paste',
        intro: [
            'Copie imagens do Safari diretamente para o cofre, cole ligações sem parâmetros de rastreio, corrija linhas partidas na saída do terminal e limpe texto de IA. Basta colar, o Better Paste trata do resto.',
            'Uma dica antes de começar: atribua **Colar sem processamento** a `Cmd+Shift+V` (`Ctrl+Shift+V` no Windows) para poder colar sempre exatamente o que está na área de transferência.',
            'Cada regra tem o seu próprio interruptor em Definições, Better Paste, e a propriedade `{property}: false` desativa o plugin nessa nota.'
        ],
        startButton: 'Começar'
    },

    overlap: {
        title: 'Better Paste: plugins que se sobrepõem',
        thanks: 'Obrigado por instalar e usar o Better Paste!',
        intro: {
            one: 'Neste momento tem {count} plugin instalado que faz mais ou menos o mesmo, por isso desative ou desinstale:',
            other: 'Neste momento tem {count} plugins instalados que fazem mais ou menos o mesmo, por isso desative ou desinstale:'
        },
        outro: 'Desative em Definições > Plugins não oficiais.',
        dontRemind: 'Não voltar a mostrar esta mensagem',
        button: 'Entendido'
    },

    whatsNew: {
        title: 'Novidades do Better Paste',
        scrollLabel: 'Notas de versão',
        releaseHeading: 'Versão {version} ({date})',
        categoryNew: 'Novo',
        categoryImproved: 'Melhorado',
        categoryChanged: 'Alterado',
        categoryFixed: 'Corrigido',
        support: 'Se o Better Paste lhe é útil, considere apoiar o seu desenvolvimento.',
        coffeeButton: '☕️ Ofereça-me um café',
        thanksButton: 'Obrigado!'
    }
};
