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
        separator: ', ',
        cleanupOn: 'processamento automático ativado',
        cleanupOff: 'processamento automático desativado',
        selectTextFirst: 'selecione texto primeiro',
        nothingToClean: 'nada para limpar',
        clipboardFailed: 'não foi possível ler a área de transferência',
        titleFailed: 'não foi possível obter o título.',
        fetchingTitle: 'a obter o título{dots}',
        imagesFailed: {
            one: 'não foi possível guardar {count} imagem',
            other: 'não foi possível guardar {count} imagens'
        },
        imagesFailedLinkKept: '{images}, a ligação original foi mantida',
        imagesFailedNothingPasted: '{images}, por isso nada foi colado. A área de transferência ainda o tem.',
        aiTextCleaned: 'texto de IA arrumado',
        terminalCleaned: 'saída do terminal limpa',
        textProcessed: 'estilo do texto ajustado',
        urlsCleaned: { one: '{count} URL limpo', other: '{count} URL limpos' },
        imagesSaved: { one: '{count} imagem guardada', other: '{count} imagens guardadas' }
    },

    settings: {
        exampleFallback: '{description} Exemplo: {example}',
        plainFallback: '{description} {example}',

        start: {
            whatsNewName: 'Novidades do Better Paste {version}',
            whatsNewDesc: 'O que mudou nas versões mais recentes.',
            whatsNewAliases: ['notas de versão', 'alterações', 'registo de alterações', 'versão', 'atualização', 'histórico'],
            whatsNewButton: 'Ver as novidades',
            supportName: 'Apoiar o desenvolvimento',
            supportDesc: 'Se o Better Paste lhe é útil, considere apoiar o seu desenvolvimento contínuo.',
            supportAliases: ['patrocinar', 'donativo', 'café', 'github'],
            sponsorButton: '❤️ Patrocinar',
            coffeeButton: '☕️ Ofereça-me um café'
        },

        behavior: {
            heading: 'Comportamento',
            autoCleanName: 'Limpar todas as colagens',
            autoCleanDesc:
                'Aplica as regras a cada colagem. Desative para usar apenas os comandos. Uma nota isolada pode ficar de fora com a propriedade "better-paste: false".',
            autoCleanAliases: ['automático', 'ativar', 'desativar', 'nota', 'excluir', 'propriedade', 'frontmatter', 'exceção'],
            showNoticesName: 'Mostrar um aviso quando uma colagem é alterada',
            showNoticesDesc: 'Um resumo de uma linha do que foi limpo. As falhas são sempre comunicadas, seja qual for esta opção.',
            showNoticesAliases: ['aviso', 'resumo', 'mensagem', 'notificação', 'silêncio']
        },

        images: {
            heading: 'Imagens',
            savingName: 'Guardar no cofre as imagens coladas',
            savingDesc:
                'Guarda as imagens coladas como ficheiros locais em vez de deixar ligações externas. Inclui "Copiar imagem" do Safari, imagens dentro de conteúdo web copiado e endereços de imagem isolados. As imagens são guardadas na pasta de anexos do seu cofre. Com "Nome a partir da origem":',
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
            pageName: 'Tratamento de imagens',
            pageDesc: 'Nomes de ficheiro e largura das imagens por nota.',
            nameFormatName: 'Nomes de ficheiro',
            nameFormatDesc: 'Escolha como são nomeados os ficheiros de imagem guardados.',
            nameFormatSource: 'Nome a partir da origem',
            nameFormatCustom: 'Formato próprio',
            customName: 'Formato próprio',
            customDesc: 'Use {{name}} para o nome de origem e formatos de data do Moment como YYYY-MM-DD.',
            customMomentLink: 'Formato Moment',
            customExample: 'Exemplo: {value}',
            customAliases: ['nome', 'ficheiro', 'data', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'Propriedade de largura das imagens',
            sizePropertyDesc:
                'A propriedade do frontmatter que define a largura das imagens coladas numa nota. Uma nota que use esta propriedade passa a tratar as capturas de ecrã em vez do Obsidian. Deixe em branco para desativar.',
            sizePropertyAliases: ['tamanho', 'frontmatter', 'propriedade', 'redimensionar']
        },

        links: {
            heading: 'Ligações',
            titlesName: 'Obter o título das ligações coladas',
            titlesDesc:
                'Quando a área de transferência contém apenas um endereço web que não é uma imagem, o título da página é obtido e é colada uma ligação Markdown. Outro texto selecionado passa a ser o rótulo sem qualquer pedido. Se o título não puder ser obtido, o endereço original é mantido.',
            titlesAliases: ['título', 'página', 'site', 'ligação markdown', 'descarregar'],
            cleaningName: 'Limpar as ligações coladas',
            cleaningDesc: 'Remove os parâmetros de rastreio das ligações coladas. A parte riscada é removida:',
            cleaningAliases: ['url', 'rastreio', 'utm', 'parâmetros', 'consulta', 'site', 'domínio', 'youtube', 'exceção'],
            stripName: 'Que parâmetros remover',
            stripDesc:
                'Escolha entre remover todos os parâmetros da consulta ou apenas os parâmetros de rastreio conhecidos. As regras de site podem preservar parâmetros em qualquer um dos modos.',
            stripAliases: ['utm', 'rastreio', 'consulta', 'parâmetros'],
            stripAll: 'Todos os parâmetros, exceto onde uma regra de site os mantém',
            stripTracking: 'Apenas os parâmetros de rastreio conhecidos',
            rulesName: 'Regras para preservar parâmetros',
            rulesDesc: 'Regras de site para manter parâmetros de consulta específicos em qualquer um dos modos de remoção.',
            rulesCount: { one: '{count} site', other: '{count} sites' },
            listName: 'As suas regras de site',
            listDesc:
                '{sites} já são tratados e mantêm-se atualizados com a extensão. Acrescente aqui as suas regras de site, uma por linha. "example.com" mantém todos os parâmetros desse site, "example.com: a, b" mantém apenas esses dois e "!example.com" descarta uma regra incluída na extensão. No modo "Apenas os parâmetros de rastreio conhecidos", uma regra só resgata os parâmetros de rastreio correspondentes, porque os restantes já são mantidos. Os subdomínios são reconhecidos automaticamente.',
            listShippedCount: { one: '{count} site comum', other: '{count} sites comuns' },
            listAliases: ['domínio', 'exceção', 'lista branca', 'youtube'],
            listInvalid: 'Não é um nome de site: {values}',
            testerName: 'Experimente',
            testerDesc: 'Cole uma ligação para ver o que estas regras manteriam.',
            testerLabel: 'Ligação a limpar',
            testerEmpty: 'A ligação limpa aparece aqui.'
        },

        terminal: {
            heading: 'Texto do terminal',
            cleanupName: 'Limpar a saída do terminal',
            cleanupDesc:
                'Volta a juntar as linhas partidas na saída do terminal e remove a indentação. Os códigos de cor são retirados. Blocos de código, tabelas e itens de lista ficam intactos.',
            cleanupAliases: ['quebra de linha', 'juntar', 'ansi', 'consola', 'shell', 'indentação', 'marca', 'lista', 'markdown'],
            pageName: 'Tratamento do texto do terminal',
            pageDesc: 'Condições para voltar a juntar e caracteres de marcador.',
            rejoinName: 'Quando voltar a juntar uma linha partida',
            rejoinDesc: 'A condição necessária para tratar uma linha como continuação da anterior.',
            rejoinAliases: ['indentação', 'quebra de linha', 'agressivo', 'seguro', 'git log'],
            rejoinIndented: 'Apenas quando a linha seguinte está indentada',
            rejoinAny: 'Sempre que a linha acima parecer cheia',
            rejoinNever: 'Nunca juntar, apenas retirar códigos e indentação',
            bulletsName: 'Caracteres de marcador',
            bulletsDesc:
                'Determina se os caracteres de marca (como •) na saída do terminal são preservados ou convertidos em itens de lista Markdown.',
            bulletsAliases: ['lista', 'markdown', 'travessão'],
            bulletsMarkdown: 'Converter em itens de lista Markdown',
            bulletsPreserve: 'Deixar como estão',
            testerName: 'Experimente',
            testerDesc: 'Cole saída do terminal para ver como ficaria limpa.',
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
            commasName: 'Vírgulas e aspas',
            commasDesc: 'Escolha onde colocar a vírgula junto a uma aspa dupla de fecho.',
            commasAliases: ['vírgula', 'aspas', 'citação', 'pontuação', 'estilo'],
            commasNone: 'Sem alteração',
            commasInside: 'Vírgula dentro das aspas',
            commasOutside: 'Vírgula fora das aspas',
            commasExampleSource: 'Chamou-lhe "concluído," depois saiu.',
            commasExampleOutside: 'Chamou-lhe "concluído", depois saiu.',
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
            punctuationDesc: 'Converte os travessões longos em hífenes e as aspas curvas em aspas direitas.',
            punctuationAliases: ['travessão', 'meia-risca', 'hífen', 'aspas', 'aspas curvas', 'apóstrofo', 'pontuação', 'tipografia'],
            punctuationExampleBefore: '“O resultado — contra todas as expectativas — ficou perfeito.”',
            punctuationExampleAfter: '"O resultado - contra todas as expectativas - ficou perfeito."'
        }
    },

    welcome: {
        title: 'Bem-vindo ao Better Paste',
        intro: [
            'O Better Paste altera o conteúdo da área de transferência à medida que este é colado numa nota.',
            'Guarda as imagens ligadas como anexos do cofre, remove parâmetros de rastreio das ligações, volta a juntar as linhas partidas na saída do terminal e substitui aspas curvas e caracteres invisíveis por equivalentes simples.',
            'Cada regra pode ser desligada isoladamente.',
            'Uma nota isolada pode ficar completamente de fora com a propriedade "better-paste: false". As definições estão em Definições, Better Paste.'
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
