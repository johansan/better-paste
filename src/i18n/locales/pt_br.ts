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
        cleanTerminal: 'Limpar a saída do terminal',
        cleanPdf: 'Limpar texto de PDF',
        runSnippet: 'Executar trecho',
        commasInside: 'Colocar vírgulas dentro das aspas',
        commasOutside: 'Colocar vírgulas fora das aspas',
        toggleCleanup: 'Alternar a limpeza automática'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        cleanupOn: 'processamento automático ativado',
        cleanupOff: 'processamento automático desativado',
        selectTextFirst: 'selecione um texto primeiro',
        nothingToClean: 'nada para limpar',
        clipboardFailed: 'não foi possível ler a área de transferência',
        titleFailed: 'não foi possível obter o título.',
        fetchingTitle: 'obtendo o título...',
        imagesFailed: {
            one: 'não foi possível salvar {count} imagem',
            other: 'não foi possível salvar {count} imagens'
        },
        imagesFailedLinkKept: '{images}, o link original foi mantido',
        imagesFailedNothingPasted: '{images}, então nada foi colado',
        snippetsCopied: 'trechos copiados',
        snippetsCopyFailed: 'não foi possível copiar os trechos'
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
            showReleaseNotesName: 'Mostrar as novidades após uma atualização',
            showReleaseNotesDesc: 'Abre o diálogo de novidades uma vez após cada atualização.',
            showReleaseNotesAliases: ['notas de lançamento', 'novidades', 'atualização', 'diálogo', 'popup', 'aviso'],
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
                'Aplica as regras em toda colagem. Com a opção desativada, as regras só são aplicadas pelos comandos do Better Paste. Uma nota específica pode ficar de fora com a propriedade "{property}: false", ou ser incluída com "{property}: true".',
            autoCleanAliases: ['automático', 'ativar', 'desativar', 'nota', 'excluir', 'propriedade', 'frontmatter', 'exceção'],
            notePropertyName: 'Propriedade da nota',
            notePropertyDesc: 'Propriedade que ativa ou desativa o Better Paste em uma única nota.',
            notePropertyAliases: ['nota', 'propriedade', 'frontmatter', 'excluir', 'desativar', 'ativar', 'bp']
        },

        images: {
            heading: 'Imagens',
            savingName: 'Salvar no cofre as imagens da web',
            savingDesc:
                'Salva as imagens da web na sua pasta de anexos e aponta para o arquivo local em vez do endereço da web. Abrange o "Copiar imagem" do Safari, as imagens dentro de conteúdo da web copiado e os endereços de imagem colados. Por padrão, o nome do arquivo vem do endereço:',
            savingAliases: ['baixar', 'url', 'web', 'anexo', 'safari', 'local', 'imagem', 'pasta'],
            sizeStyleName: 'Tamanho e estilo',
            sizeStyleDesc: 'Adicione uma largura ou uma classe CSS às imagens coladas, automaticamente ou por um seletor.',
            sizeStyleAliases: ['tamanho', 'largura', 'css', 'classe', 'estilo', 'redimensionar', 'invert'],
            summarySize: 'Tamanho: {value}',
            summaryStyle: 'Estilo: {value}',
            summaryAsk: 'Perguntar',
            sizeChoiceName: 'Aplicar tamanho ao colar',
            sizeChoiceDesc:
                'Adiciona uma largura a cada imagem salva, como ![[photo.jpg|400]]. A propriedade de largura da nota tem prioridade.',
            sizeChoiceAliases: ['tamanho', 'largura', 'tamanho da imagem', 'redimensionar', 'incorporar', '400'],
            sizeOptionsName: 'Opções de tamanho',
            sizeOptionsDesc: 'As larguras oferecidas acima e no diálogo ao colar, separadas por vírgulas.',
            classChoiceName: 'Aplicar classe CSS ao colar',
            classChoiceDesc:
                'Adiciona uma classe a cada imagem salva, como ![[photo.jpg#invert]]. Temas e trechos CSS decidem o que uma classe faz.',
            classChoiceAliases: ['css', 'classe', 'trecho', 'invert', 'tema', 'filtro', 'incorporar'],
            classOptionsName: 'Opções de classe',
            classOptionsDesc: 'As classes oferecidas acima e no diálogo ao colar, separadas por vírgulas.',
            choiceNone: 'Não fazer nada',
            choiceAsk: 'Perguntar em cada colagem',
            nameFormatName: 'Nomes de arquivo',
            customDesc:
                'Use {{name}} para o nome de origem, {{noteName}} para o nome da nota, {{property:xyz}} para uma propriedade do frontmatter, {{counter}} ou {{counter:2}} para um número crescente e formatos de data do Moment como YYYY-MM-DD.',
            customScreenshotDesc:
                'Uma captura de tela não tem nome de origem, então o {{name}} dela vira "Pasted image" com data e hora, como no Obsidian.',
            customMomentLink: 'Formato Moment',
            customExample: 'Exemplo: {value}',
            customExampleNote: 'Minha nota',
            customAliases: [
                'nome',
                'arquivo',
                'data',
                'moment',
                'YYYY',
                '{{name}}',
                'contador',
                'propriedade',
                'nome da nota',
                'captura de tela',
                'renomear',
                'área de transferência',
                'paste image rename'
            ],
            sizePropertyName: 'Propriedade de largura das imagens',
            sizePropertyDesc:
                'Propriedade do frontmatter que define a largura das imagens coladas em uma nota. Com "{property}: 400" na nota, uma imagem colada fica ![[photo.png|400]]. Deixe em branco para não acrescentar largura.',
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
            removalsName: 'Remoções nos links',
            removalsDesc: 'Parâmetros extras para remoção em todos os lugares ou em sites específicos.',
            rulesCount: { one: '{count} entrada', other: '{count} entradas' },
            builtInName: 'Remoções integradas',
            builtInDesc:
                'Atualizado em {date}. Filtros globais de rastreamento: {trackingCount}. Regras específicas para sites: {siteCount}. Links assinados criptograficamente permanecem inalterados.',
            builtInButton: 'Ver lista',
            listName: 'Suas remoções',
            listDesc:
                'Remova um parâmetro de links comuns em qualquer site digitando apenas o nome dele. Por exemplo, "fbclid" remove o parâmetro fbclid onde quer que ele apareça.\n\nRemova parâmetros apenas em um site com "example.com | source, ref". Isso remove source e ref de example.com e seus subdomínios, enquanto todos os outros parâmetros permanecem. Comece uma linha com "!" para desativar as remoções integradas para esse site. Links assinados criptograficamente permanecem sempre inalterados.',
            listAliases: ['domínio', 'parâmetro', 'filtro', 'remover', 'youtube'],
            listInvalid: 'Regra de remoção inválida: {values}',
            suggestName: 'Sugira suas remoções',
            suggestDesc: 'Ajude a melhorar as remoções integradas contribuindo com parâmetros para remover.',
            suggestAliases: ['contribua', 'enviar', 'compartilhar', 'mandar', 'filtro'],
            suggestButton: 'Revisar e enviar',
            testerName: 'Experimente',
            testerDesc: 'Cole um link para ver o resultado limpo.',
            testerLabel: 'Link a limpar',
            testerEmpty: 'O link limpo aparece aqui.'
        },

        text: {
            heading: 'Processamento de texto',
            trimName: 'Remover os espaços ao redor',
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
            quotesDesc: 'Converte as aspas curvas e os apóstrofos em aspas retas.',
            quotesAliases: ['aspas', 'aspas curvas', 'aspas retas', 'apóstrofo', 'pontuação', 'tipografia', 'ia'],
            quotesExample: '“Bem”, disse ela.',
            dashesName: 'Travessões',
            dashesDesc: 'Converte as meias-riscas e os travessões em hifens.',
            dashesAliases: ['travessão', 'meia-risca', 'hífen', 'pontuação', 'tipografia', 'ia'],
            dashesExample: 'O resultado — contra todas as expectativas — ficou bom.'
        },

        structure: {
            heading: 'Estrutura',
            listNestingName: 'Manter o aninhamento de listas ao colar',
            listNestingDesc: 'Cola uma lista copiada com a hierarquia intacta, com o recuo ajustado ao item de lista em que você cola.',
            listNestingAliases: [
                'lista',
                'aninhada',
                'recuo',
                'indentação',
                'hierarquia',
                'esquema',
                'marcadores',
                'caixa de seleção',
                'árvore'
            ]
        },

        custom: {
            heading: 'Processamento personalizado',
            pipelineName: 'Aplicar trechos personalizados de expressões regulares ao texto',
            pastedText: 'Texto colado',
            builtInRules: 'Regras integradas',
            customSnippets: 'Trechos personalizados',
            note: 'Nota',
            wikiButton: 'Ver wiki',
            regexButton: 'Abrir ambiente de testes de expressões regulares',
            snippetsName: 'Trechos',
            snippetsDesc: 'Adicione e edite seus trechos. Ative os que devem ser aplicados ao colar.',
            enabledSnippetsCount: { one: '{count} trecho ativado', other: '{count} trechos ativados' },
            snippetRulesCount: { one: '{count} regra', other: '{count} regras' },
            invalidRulesCount: { one: '{count} linha inválida', other: '{count} linhas inválidas' },
            unnamedSnippet: 'Trecho sem nome',
            emptyState: 'Você ainda não criou nenhum trecho.',
            addSnippet: 'Adicionar trecho',
            editButton: 'Editar trecho',
            exportName: 'Exportar trechos',
            exportDesc: 'Copia todos os trechos no formato de intercâmbio da wiki.',
            exportButton: 'Copiar trechos',
            importName: 'Importar trechos',
            importDesc: 'Adiciona trechos do formato de intercâmbio da wiki.',
            previewName: 'Experimente',
            previewDesc: 'Digite um texto de exemplo para ver o resultado de todos os trechos ativados.',
            modalPreviewDesc: 'Digite um texto de exemplo para ver o resultado deste trecho.',
            previewInputLabel: 'Texto de exemplo',
            previewEmpty: 'O texto processado aparece aqui.',
            nameName: 'Nome',
            rulesName: 'Regras',
            rulesDesc: 'Digite uma substituição com expressão regular JavaScript por linha.',
            wikiPasteHint: 'Copie um trecho pronto da wiki e cole direto no campo de regras.',
            invalidLine: 'Linha {line}: {value}',
            saveButton: 'Salvar',
            recognizedSnippetsCount: { one: '{count} trecho reconhecido', other: '{count} trechos reconhecidos' },
            recognizedRulesCount: { one: '{count} regra reconhecida', other: '{count} regras reconhecidas' },
            unparseableName: 'Linhas não reconhecidas',
            importFallbackName: 'Trecho importado'
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

    pdfModal: {
        furniture: 'Remover números de página',
        singleParagraph: 'Juntar tudo em um único parágrafo',
        description:
            'As linhas quebradas são reunidas, as palavras divididas por hífen são reparadas, as ligaduras viram letras normais e os espaços extras são removidos.',
        preview: 'Pré-visualização'
    },

    welcome: {
        title: 'Boas-vindas ao Better Paste',
        intro: [
            'Copie imagens do Safari direto para o cofre, cole links sem parâmetros de rastreamento, conserte linhas quebradas na saída do terminal e limpe texto de IA. É só colar, o Better Paste cuida do resto.',
            'Uma dica antes de começar: vincule **Colar sem processamento** a `Cmd+Shift+V` (`Ctrl+Shift+V` no Windows) para sempre poder colar exatamente o que está na área de transferência.',
            'Cada regra tem seu próprio interruptor em Configurações, Better Paste, e a propriedade `{property}: false` desativa o plugin naquela nota.'
        ],
        startButton: 'Começar'
    },

    overlap: {
        title: 'Better Paste: plugins que se sobrepõem',
        thanks: 'Obrigado por instalar e usar o Better Paste!',
        intro: {
            one: 'No momento você tem {count} plugin instalado que faz mais ou menos a mesma coisa, então desative ou desinstale:',
            other: 'No momento você tem {count} plugins instalados que fazem mais ou menos a mesma coisa, então desative ou desinstale:'
        },
        outro: 'Desative em Configurações > Plugins não oficiais.',
        dontRemind: 'Não mostrar esta mensagem novamente',
        button: 'Entendi'
    },

    whatsNew: {
        title: 'Novidades do Better Paste',
        releaseHeading: 'Versão {version} ({date})',
        categoryNew: 'Novo',
        categoryImproved: 'Melhorado',
        categoryChanged: 'Alterado',
        categoryFixed: 'Corrigido',
        support: 'Se o Better Paste é útil para você, considere apoiar seu desenvolvimento.',
        coffeeButton: '☕️ Me pague um café',
        thanksButton: 'Obrigado!',
        dontShowAgain: 'Não mostrar novamente após as atualizações'
    }
};
