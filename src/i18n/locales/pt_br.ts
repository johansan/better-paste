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

/** Brazilian Portuguese. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_PT_BR: TranslationStrings = {
    commands: {
        paste: 'Colar',
        pasteRaw: 'Colar sem processamento',
        cleanSelection: 'Limpar a seleção',
        toggleCleanup: 'Alternar a limpeza automática'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        separator: ', ',
        cleanupOn: 'processamento automático ativado',
        cleanupOff: 'processamento automático desativado',
        selectTextFirst: 'selecione um texto primeiro',
        nothingToClean: 'nada para limpar',
        clipboardFailed: 'não foi possível ler a área de transferência',
        titleFailed: 'não foi possível obter o título.',
        fetchingTitle: 'obtendo o título{dots}',
        imagesFailed: {
            one: 'não foi possível salvar {count} imagem',
            other: 'não foi possível salvar {count} imagens'
        },
        imagesFailedLinkKept: '{images}, o link original foi mantido',
        imagesFailedNothingPasted: '{images}, então nada foi colado',
        aiTextCleaned: 'texto de IA ajeitado',
        terminalCleaned: 'saída do terminal limpa',
        textProcessed: 'estilo do texto ajustado',
        urlsCleaned: { one: '{count} URL limpo', other: '{count} URLs limpos' },
        imagesSaved: { one: '{count} imagem salva', other: '{count} imagens salvas' }
    },

    settings: {
        exampleFallback: '{description} Exemplo: {example}',
        plainFallback: '{description} {example}',

        start: {
            heading: 'Sobre',
            whatsNewName: 'Novidades do Better Paste {version}',
            whatsNewDesc: 'O que mudou nas versões mais recentes.',
            whatsNewAliases: ['notas de versão', 'mudanças', 'registro de mudanças', 'versão', 'atualização', 'histórico'],
            whatsNewButton: 'Ver as novidades',
            supportName: 'Apoiar o desenvolvimento',
            supportDesc: 'Se o Better Paste é útil para você, considere apoiar seu desenvolvimento.',
            supportAliases: ['patrocinar', 'doação', 'café', 'github'],
            sponsorButton: '❤️ Patrocinar',
            coffeeButton: '☕️ Me pague um café',
            pluginsName: 'Conheça meus outros plugins',
            pluginsAliases: ['plugins', 'extensões', 'notebook navigator', 'pixel perfect image', 'autor'],
            notebookNavigatorDesc: 'Um navegador de arquivos e calendário melhores',
            pixelPerfectImageDesc: 'Redimensionamento exato de imagens e mais'
        },

        behavior: {
            autoCleanName: 'Limpar toda colagem',
            autoCleanDesc:
                'Aplica as regras em toda colagem. Com a opção desativada, as regras só são aplicadas pelos comandos do Better Paste. Uma nota específica pode ficar de fora com a propriedade "bp: false", ou ser incluída com "bp: true".',
            autoCleanAliases: ['automático', 'ativar', 'desativar', 'nota', 'excluir', 'propriedade', 'frontmatter', 'exceção'],
            showNoticesName: 'Mostrar um aviso quando uma colagem for alterada',
            showNoticesDesc: 'Um resumo de uma linha do que mudou. As falhas são sempre informadas.',
            showNoticesAliases: ['aviso', 'resumo', 'mensagem', 'notificação', 'silêncio']
        },

        images: {
            heading: 'Imagens',
            savingName: 'Salvar no cofre as imagens coladas',
            savingDesc:
                'Salva as imagens coladas na sua pasta de anexos e aponta para o arquivo local em vez do endereço da web. Abrange o "Copiar imagem" do Safari, as imagens dentro de conteúdo da web copiado e os endereços de imagem colados. Por padrão, o nome do arquivo vem do endereço:',
            savingAliases: ['baixar', 'anexo', 'safari', 'captura de tela', 'imagem', 'pasta', 'nome do arquivo', 'largura', 'tamanho'],
            nameFormatName: 'Nomes de arquivo',
            nameFormatDesc: 'Como as imagens salvas são nomeadas.',
            nameFormatSource: 'Nome a partir da origem',
            nameFormatCustom: 'Formato personalizado',
            customName: 'Formato personalizado',
            customDesc: 'Use {{name}} para o nome de origem e formatos de data do Moment como YYYY-MM-DD.',
            customMomentLink: 'Formato Moment',
            customExample: 'Exemplo: {value}',
            customAliases: ['nome', 'arquivo', 'data', 'moment', 'YYYY', '{{name}}']
        },

        frontmatter: {
            heading: 'Frontmatter',
            notePropertyName: 'Propriedade da nota',
            notePropertyDesc:
                'Propriedade que ativa ou desativa o Better Paste em uma única nota. Com "bp: false" a nota fica intacta, e com "bp: true" ela é limpa mesmo com "Limpar toda colagem" desativado. Deixe em branco para ignorar a propriedade.',
            notePropertyAliases: ['nota', 'propriedade', 'frontmatter', 'excluir', 'desativar', 'ativar', 'bp'],
            sizePropertyName: 'Propriedade de largura das imagens',
            sizePropertyDesc:
                'Propriedade do frontmatter que define a largura das imagens coladas em uma nota. Com "bp-image-width: 400" na nota, uma imagem colada fica ![[photo.png|400]]. Deixe em branco para não acrescentar largura.',
            sizePropertyAliases: ['tamanho', 'frontmatter', 'propriedade', 'redimensionar']
        },

        links: {
            heading: 'Links',
            titlesName: 'Buscar o título dos links colados',
            titlesDesc:
                'Colar um endereço da web sozinho insere um link Markdown com o título da página. Se houver texto selecionado, esse texto vira o rótulo e nenhum título é buscado. O endereço simples é mantido quando o título não pode ser obtido.',
            titlesAliases: ['título', 'página', 'site', 'link markdown', 'baixar'],
            cleaningName: 'Limpar os links colados',
            cleaningDesc: 'Remove os parâmetros de rastreamento dos links colados:',
            cleaningAliases: ['url', 'rastreamento', 'utm', 'parâmetros', 'consulta', 'site', 'domínio', 'youtube', 'exceção'],
            stripName: 'Quais parâmetros remover',
            stripDesc: 'Os parâmetros de rastreamento são nomes como utm_source, fbclid e gclid.',
            stripAliases: ['utm', 'rastreamento', 'consulta', 'parâmetros'],
            stripAll: 'Todos os parâmetros, a menos que uma regra de site os mantenha',
            stripTracking: 'Apenas os parâmetros de rastreamento conhecidos',
            rulesName: 'Regras de site',
            rulesDesc: 'Parâmetros a manter em sites específicos.',
            rulesCount: { one: '{count} site', other: '{count} sites' },
            listName: 'Suas regras de site',
            listDesc:
                '{sites} já são cobertos pelo plugin. Adicione aqui suas próprias regras, uma por linha. "example.com" mantém todos os parâmetros daquele site, "example.com: a, b" mantém apenas esses dois e "!example.com" remove uma regra que vem com o plugin. Os subdomínios são reconhecidos automaticamente.',
            listShippedCount: { one: '{count} site comum', other: '{count} sites comuns' },
            listAliases: ['domínio', 'exceção', 'lista branca', 'youtube'],
            listInvalid: 'Não é um nome de site: {values}',
            testerName: 'Experimente',
            testerDesc: 'Cole um link para ver o que as regras mantêm.',
            testerLabel: 'Link a limpar',
            testerEmpty: 'O link limpo aparece aqui.'
        },

        terminal: {
            heading: 'Texto do terminal',
            cleanupName: 'Limpar a saída do terminal',
            cleanupDesc:
                'Junta de novo as linhas que o terminal quebrou e remove os códigos de cor e a indentação inicial. Blocos de código, tabelas e listas ficam intactos.',
            cleanupAliases: ['quebra de linha', 'juntar', 'ansi', 'console', 'shell', 'indentação', 'marcador', 'lista', 'markdown'],
            pageName: 'Tratamento do texto do terminal',
            pageDesc: 'Junção de linhas e caracteres de marcador.',
            rejoinName: 'Quando juntar uma linha quebrada',
            rejoinDesc: 'Uma linha só é juntada à de cima quando essa linha parece cheia.',
            rejoinAliases: ['indentação', 'quebra de linha', 'agressivo', 'seguro', 'git log'],
            rejoinIndented: 'Somente quando a linha está indentada',
            rejoinAny: 'Esteja indentada ou não',
            rejoinNever: 'Nunca, apenas retirar códigos e indentação',
            bulletsName: 'Caracteres de marcador',
            bulletsDesc: 'O que fazer com os caracteres de marcador como • na saída do terminal.',
            bulletsAliases: ['lista', 'markdown', 'traço'],
            bulletsMarkdown: 'Converter em itens de lista Markdown',
            bulletsPreserve: 'Deixar como estão',
            testerName: 'Experimente',
            testerDesc: 'Cole uma saída de terminal para ver como ela fica limpa.',
            testerLabel: 'Texto do terminal a limpar',
            testerEmpty: 'O texto limpo aparece aqui.',
            testerSample: [
                '• O passo extra está isolado no tratador do Enter da lista, então a mudança principal é simples. Ao percorrer fluxos vizinhos, encontrei',
                '  dois prováveis pontos de atrito que vale a pena validar: a seleção pode saltar após a atualização.'
            ]
        },

        text: {
            heading: 'Processamento de texto',
            trimName: 'Remover os espaços ao redor',
            trimDesc: 'Remove linhas em branco e espaços do início e do fim do texto colado.',
            trimAliases: ['espaço', 'linha em branco', 'nova linha', 'aparar'],
            commasName: 'Vírgulas e aspas',
            commasDesc: 'Onde fica a vírgula ao lado de uma aspa dupla de fechamento.',
            commasAliases: ['vírgula', 'aspas', 'citação', 'pontuação', 'estilo'],
            commasNone: 'Sem alteração',
            commasInside: 'Vírgula dentro das aspas',
            commasOutside: 'Vírgula fora das aspas',
            commasExampleSource: 'Ele o chamou de "pronto," depois foi embora.',
            commasExampleOutside: 'Ele o chamou de "pronto", depois foi embora.',
            invisibleName: 'Limpeza de IA: caracteres invisíveis',
            invisibleDesc: 'Remove os espaços de largura zero e transforma os espaços inquebráveis em espaços normais.',
            invisibleAliases: [
                'ia',
                'chatgpt',
                'claude',
                'llm',
                'travessão',
                'meia-risca',
                'hífen',
                'unicode',
                'invisível',
                'nbsp',
                'tipografia',
                'pontuação',
                'espaço'
            ],
            invisibleExampleStart: 'O',
            invisibleExampleMiddle: 'resultado',
            invisibleExampleEnd: ' ficou bom.',
            invisibleExampleAfter: 'O resultado ficou bom.',
            punctuationName: 'Limpeza de IA: travessões e aspas',
            punctuationDesc: 'Converte os travessões longos em hifens e as aspas curvas em aspas retas.',
            punctuationAliases: ['travessão', 'meia-risca', 'hífen', 'aspas', 'aspas curvas', 'apóstrofo', 'pontuação', 'tipografia'],
            punctuationExampleBefore: '“O resultado — contra todas as expectativas — ficou perfeito.”',
            punctuationExampleAfter: '"O resultado - contra todas as expectativas - ficou perfeito."'
        }
    },

    welcome: {
        title: 'Boas-vindas ao Better Paste',
        intro: [
            'O Better Paste altera o conteúdo da área de transferência enquanto ele é colado em uma nota.',
            'Ele salva as imagens vinculadas como anexos do cofre, remove parâmetros de rastreamento dos links, junta de novo as linhas quebradas na saída do terminal e substitui aspas curvas e caracteres invisíveis por equivalentes simples.',
            'Cada regra pode ser desligada separadamente.',
            'Uma nota específica pode ficar totalmente de fora com a propriedade "bp: false". As configurações estão em Configurações, Better Paste.'
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
        support: 'Se o Better Paste é útil para você, considere apoiar seu desenvolvimento.',
        coffeeButton: '☕️ Me pague um café',
        thanksButton: 'Obrigado!'
    }
};
