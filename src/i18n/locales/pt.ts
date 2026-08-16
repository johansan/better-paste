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
                'Aplica as regras a cada colagem. Se estiver desativado, as regras só se aplicam através dos comandos do Better Paste. Uma nota isolada pode ficar de fora com a propriedade "bp: false", ou ser incluída com "bp: true".',
            autoCleanAliases: ['automático', 'ativar', 'desativar', 'nota', 'excluir', 'propriedade', 'frontmatter', 'exceção']
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
            customAliases: ['nome', 'ficheiro', 'data', 'moment', 'YYYY', '{{name}}']
        },

        frontmatter: {
            heading: 'Frontmatter',
            notePropertyName: 'Propriedade da nota',
            notePropertyDesc:
                'Propriedade que ativa ou desativa o Better Paste numa única nota. Com "bp: false" a nota fica intacta, e com "bp: true" é limpa mesmo com "Limpar todas as colagens" desativado. Deixe em branco para ignorar a propriedade.',
            notePropertyAliases: ['nota', 'propriedade', 'frontmatter', 'excluir', 'desativar', 'ativar', 'bp'],
            sizePropertyName: 'Propriedade de largura das imagens',
            sizePropertyDesc:
                'Propriedade do frontmatter que define a largura das imagens coladas numa nota. Com "image-width: 400" na nota, uma imagem colada fica ![[photo.png|400]]. Deixe em branco para não acrescentar largura.',
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
            stripName: 'Que parâmetros remover',
            stripDesc: 'Os parâmetros de rastreio são nomes como utm_source, fbclid e gclid.',
            stripAliases: ['utm', 'rastreio', 'consulta', 'parâmetros'],
            stripAll: 'Todos os parâmetros, salvo se uma regra de site os mantiver',
            stripTracking: 'Apenas os parâmetros de rastreio conhecidos',
            rulesName: 'Regras de site',
            rulesDesc: 'Parâmetros a manter em sites específicos.',
            rulesCount: { one: '{count} site', other: '{count} sites' },
            listName: 'As suas regras de site',
            listDesc:
                '{sites} já são cobertos pela extensão. Acrescente aqui as suas próprias regras, uma por linha. "example.com" mantém todos os parâmetros desse site, "example.com: a, b" mantém apenas esses dois e "!example.com" remove uma regra incluída na extensão. Os subdomínios são reconhecidos automaticamente.',
            listShippedCount: { one: '{count} site comum', other: '{count} sites comuns' },
            listAliases: ['domínio', 'exceção', 'lista branca', 'youtube'],
            listInvalid: 'Não é um nome de site: {values}',
            testerName: 'Experimente',
            testerDesc: 'Cole uma ligação para ver o que as regras mantêm.',
            testerLabel: 'Ligação a limpar',
            testerEmpty: 'A ligação limpa aparece aqui.'
        },

        terminal: {
            heading: 'Texto do terminal',
            cleanupName: 'Limpar a saída do terminal',
            cleanupDesc:
                'Volta a juntar as linhas que o terminal partiu e remove os códigos de cor e a indentação inicial. Blocos de código, tabelas e listas ficam intactos.',
            cleanupAliases: ['quebra de linha', 'juntar', 'ansi', 'consola', 'shell', 'indentação', 'marca', 'lista', 'markdown'],
            pageName: 'Tratamento do texto do terminal',
            pageDesc: 'Junção de linhas e caracteres de marcador.',
            rejoinName: 'Quando voltar a juntar uma linha partida',
            rejoinDesc: 'Uma linha só é juntada à de cima quando essa linha parece cheia.',
            rejoinAliases: ['indentação', 'quebra de linha', 'agressivo', 'seguro', 'git log'],
            rejoinIndented: 'Apenas quando a linha está indentada',
            rejoinAny: 'Esteja indentada ou não',
            rejoinNever: 'Nunca, apenas retirar códigos e indentação',
            bulletsName: 'Caracteres de marcador',
            bulletsDesc: 'O que fazer com os caracteres de marcador como • na saída do terminal.',
            bulletsAliases: ['lista', 'markdown', 'travessão'],
            bulletsMarkdown: 'Converter em itens de lista Markdown',
            bulletsPreserve: 'Deixar como estão',
            testerName: 'Experimente',
            testerDesc: 'Cole saída do terminal para ver como fica limpa.',
            testerLabel: 'Texto do terminal a limpar',
            testerEmpty: 'O texto limpo aparece aqui.',
            testerSample: [
                '• O passo adicional está isolado no tratamento do Enter da lista, por isso a alteração principal é simples. Ao percorrer fluxos vizinhos encontrei',
                '  dois pontos de atrito prováveis que vale a pena validar: a seleção pode saltar após a atualização.'
            ]
        },

        text: {
            heading: 'Processamento de texto',
            trimName: 'Retirar os espaços em redor',
            trimDesc: 'Remove linhas em branco e espaços do início e do fim do texto colado.',
            trimAliases: ['espaço', 'linha em branco', 'nova linha', 'aparar'],
            commasName: 'Vírgulas',
            commasDesc: 'Onde fica a vírgula junto a uma aspa dupla de fecho.',
            commasAliases: ['vírgula', 'aspas', 'citação', 'pontuação', 'estilo'],
            commasNone: 'Sem alteração',
            commasInside: 'Vírgula dentro das aspas',
            commasOutside: 'Vírgula fora das aspas',
            commasExampleSource: 'Chamou-lhe "concluído," depois saiu.',
            commasExampleOutside: 'Chamou-lhe "concluído", depois saiu.',
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
            'Cada regra tem o seu próprio interruptor em Definições, Better Paste, e a propriedade `bp: false` desativa o plugin nessa nota.'
        ],
        startButton: 'Começar'
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
