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

/** Korean. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_KO: TranslationStrings = {
    commands: {
        paste: '붙여넣기',
        pasteRaw: '처리 없이 붙여넣기',
        cleanSelection: '선택 영역 정리',
        cleanTerminal: '터미널 출력 정리',
        cleanPdf: 'PDF 텍스트 정리',
        runSnippet: '스니펫 실행',
        commasInside: '쉼표를 따옴표 안으로 이동',
        commasOutside: '쉼표를 따옴표 밖으로 이동',
        toggleCleanup: '자동 정리 전환'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        cleanupOn: '자동 처리 켜짐',
        cleanupOff: '자동 처리 꺼짐',
        selectTextFirst: '먼저 텍스트를 선택하세요',
        nothingToClean: '정리할 것이 없습니다',
        clipboardFailed: '클립보드를 읽지 못했습니다',
        titleFailed: '제목을 가져오지 못했습니다.',
        fetchingTitle: '제목 가져오는 중...',
        fetchingTitles: '제목 가져오는 중...',
        titlesFailed: { other: '제목 {count}개를 가져오지 못했습니다' },
        imagesFailed: { other: '이미지 {count}개를 저장하지 못했습니다' },
        imagesFailedLinkKept: '{images}. 원래 링크를 유지했습니다',
        imagesFailedNothingPasted: '{images}. 그래서 아무것도 붙여넣지 않았습니다',
        snippetsCopied: '스니펫을 복사했습니다',
        snippetsCopyFailed: '스니펫을 복사하지 못했습니다'
    },

    settings: {
        exampleFallback: '{description} 예: {example}',
        plainFallback: '{description} {example}',

        start: {
            heading: '정보',
            whatsNewName: 'Better Paste {version}의 새로운 기능',
            whatsNewDesc: '최근 릴리스에서 달라진 점입니다.',
            whatsNewAliases: ['릴리스 노트', '변경 사항', '변경 기록', '버전', '업데이트', '기록'],
            whatsNewButton: '최근 업데이트 보기',
            showReleaseNotesName: '업데이트 후 새로운 기능 표시',
            showReleaseNotesDesc: '업데이트할 때마다 새로운 기능 대화상자를 한 번 엽니다.',
            showReleaseNotesAliases: ['릴리스 노트', '새로운 기능', '업데이트', '대화상자', '팝업', '알림'],
            supportName: '개발 후원하기',
            supportDesc: 'Better Paste가 도움이 되었다면 개발을 후원해 주세요.',
            supportAliases: ['후원', '기부', '커피', 'github'],
            sponsorButton: '❤️ 후원',
            coffeeButton: '☕️ 커피 한 잔 사주기',
            pluginsName: '제가 만든 다른 플러그인 보기',
            pluginsAliases: ['플러그인', 'notebook navigator', 'pixel perfect image', '제작자', '더 보기'],
            notebookNavigatorDesc: '더 나은 파일 브라우저와 캘린더',
            pixelPerfectImageDesc: '정확한 이미지 크기 조정 등'
        },

        behavior: {
            autoCleanName: '붙여넣을 때마다 정리',
            autoCleanDesc:
                '붙여넣을 때마다 규칙을 적용합니다. 꺼 두면 Better Paste 명령에서만 규칙이 적용됩니다. 개별 노트는 "{property}: false" 속성으로 제외하거나 "{property}: true" 속성으로 포함할 수 있습니다.',
            autoCleanAliases: ['자동', '켜기', '끄기', '노트', '제외', '속성', '프론트매터', 'frontmatter'],
            notePropertyName: '노트 속성',
            notePropertyDesc: '개별 노트에서 Better Paste를 켜거나 끄는 속성입니다.',
            notePropertyAliases: ['노트', '속성', '프론트매터', 'frontmatter', '제외', '끄기', '켜기', 'bp']
        },

        images: {
            heading: '이미지',
            savingName: '웹 이미지',
            savingDesc:
                '웹 이미지를 붙여넣을 때 어떻게 처리할지 선택하세요. "아무것도 안 함"은 붙여넣은 내용을 그대로 두고, "미리보기와 함께 링크"는 웹에서 바로 이미지를 표시하며, "미리보기와 함께 다운로드"는 Safari에서 복사한 이미지를 포함해 보관함에 사본을 저장합니다.',
            savingDownloadDesc: '파일 이름은 기본적으로 주소에서 가져옵니다:',
            savingChoiceOff: '아무것도 안 함',
            savingChoiceLink: '미리보기와 함께 링크',
            savingChoiceDownload: '미리보기와 함께 다운로드',
            savingAliases: ['다운로드', '링크', '임베드', '미리보기', 'url', '웹', '첨부 파일', 'safari', '로컬', '이미지', '폴더'],
            sizeStyleName: '크기와 스타일',
            sizeStyleDesc: '붙여넣은 이미지에 너비나 CSS 클래스를 추가합니다. 자동으로 적용하거나 매번 선택할 수 있습니다.',
            sizeStyleAliases: ['크기', '너비', 'css', '클래스', '스타일', '크기 조절', 'invert'],
            summarySize: '크기: {value}',
            summaryStyle: '스타일: {value}',
            summaryAsk: '묻기',
            sizeChoiceName: '붙여넣을 때 크기 적용',
            sizeChoiceDesc: '저장되는 모든 이미지 임베드에 너비를 추가합니다. 예: ![[photo.jpg|400]]. 노트 자체의 너비 속성이 우선합니다.',
            sizeChoiceAliases: ['크기', '너비', '이미지 크기', '크기 조절', '임베드', '400'],
            sizeOptionsName: '크기 옵션',
            sizeOptionsDesc: '위 설정과 붙여넣기 대화상자에 표시할 너비를 쉼표로 구분해 입력합니다.',
            classChoiceName: '붙여넣을 때 CSS 클래스 적용',
            classChoiceDesc:
                '저장되는 모든 이미지 임베드에 클래스를 추가합니다. 예: ![[photo.jpg#invert]]. 클래스의 효과는 테마와 CSS 스니펫에 따라 달라집니다.',
            classChoiceAliases: ['css', '클래스', '스니펫', 'invert', '테마', '필터', '임베드'],
            classOptionsName: '클래스 옵션',
            classOptionsDesc: '위 설정과 붙여넣기 대화상자에 표시할 클래스를 쉼표로 구분해 입력합니다.',
            choiceNone: '아무것도 안 함',
            choiceAsk: '붙여넣을 때마다 묻기',
            nameFormatName: '파일 이름',
            customDesc:
                '원본 이름에는 {{name}}을, 노트 이름에는 {{noteName}}을, 프론트매터 속성에는 {{property:xyz}}를, 증가하는 번호에는 {{counter}} 또는 {{counter:2}}를, 날짜에는 YYYY-MM-DD 같은 Moment 형식을 사용하세요.',
            customScreenshotDesc:
                '스크린샷에는 원본 이름이 없으므로 {{name}}은 Obsidian에서처럼 타임스탬프가 붙은 "Pasted image"가 됩니다.',
            customMomentLink: 'Moment 형식',
            customExample: '예: {value}',
            customExampleNote: '내 노트',
            customAliases: [
                '이름',
                '파일 이름',
                '날짜',
                'moment',
                'YYYY',
                '{{name}}',
                '카운터',
                '속성',
                '노트 이름',
                '스크린샷',
                '이름 바꾸기',
                '클립보드',
                'paste image rename'
            ],
            sizePropertyName: '이미지 너비 속성',
            sizePropertyDesc:
                '노트에 붙여넣는 이미지의 너비를 정하는 프론트매터 속성입니다. 노트에 "{property}: 400"이 있으면 붙여넣은 이미지가 ![[photo.png|400]]이 됩니다. 비워 두면 너비를 넣지 않습니다.',
            sizePropertyAliases: ['크기', '프론트매터', 'frontmatter', '속성', '크기 조정']
        },

        links: {
            heading: '링크',
            titlesName: '붙여넣은 링크의 제목 가져오기',
            titlesDesc:
                '웹 주소만 붙여넣으면 페이지 제목이 붙은 Markdown 링크가 삽입됩니다. 텍스트를 선택해 두었다면 그 텍스트가 링크 이름이 되고 제목은 가져오지 않습니다. 제목을 가져오지 못하면 주소만 남습니다.',
            titlesAliases: ['제목', '페이지', '웹사이트', 'markdown 링크', '다운로드'],
            cleaningName: '붙여넣은 링크 정리',
            cleaningDesc: '붙여넣은 링크에서 추적 매개변수를 제거합니다:',
            cleaningAliases: ['url', '추적', 'utm', '매개변수', '쿼리', '사이트', '도메인', 'youtube', '예외'],
            removalsName: '링크 매개변수 제거',
            removalsDesc: '모든 곳에서 또는 특정 사이트에서만 제거할 추가 매개변수.',
            rulesCount: { other: '{count}개 항목' },
            builtInName: '내장 제거 규칙',
            builtInDesc:
                '마지막 업데이트: {date}. 전역 추적 필터: {trackingCount}. 사이트별 규칙: {siteCount}. 암호학적으로 서명된 링크는 변경되지 않습니다.',
            builtInButton: '목록 보기',
            listName: '내 제거 규칙',
            listDesc:
                '모든 사이트의 일반 링크에서 특정 매개변수를 제거하려면 해당 매개변수 이름만 단독으로 입력하세요. 예를 들어, fbclid를 입력하면 fbclid 매개변수가 나타나는 모든 곳에서 제거됩니다.\n\nexample.com | source, ref와 같이 입력하면 특정 사이트에서만 매개변수를 제거할 수 있습니다. 이렇게 하면 example.com 및 그 하위 도메인에서 source와 ref가 제거되고, 다른 모든 매개변수는 그대로 유지됩니다. 해당 사이트에 대한 내장 제거 규칙을 비활성화하려면 줄의 시작 부분에 !를 입력하세요. 암호학적으로 서명된 링크는 항상 변경되지 않은 상태로 유지됩니다.',
            listAliases: ['도메인', '매개변수', '필터', '제거', 'youtube'],
            listInvalid: '잘못된 제거 규칙: {values}',
            suggestName: '제거 규칙 제안하기',
            suggestDesc: '제거할 매개변수를 제안하여 내장 제거 규칙을 개선하는 데 기여해 주세요.',
            suggestAliases: ['기여하기', '제출', '공유', '보내기', '필터'],
            suggestButton: '검토 후 전송',
            testerName: '시험해 보기',
            testerDesc: '링크를 붙여넣어 정리된 결과를 확인해 보세요.',
            testerLabel: '정리할 링크',
            testerEmpty: '정리된 링크가 여기에 표시됩니다.'
        },

        text: {
            heading: '텍스트 처리',
            trimName: '앞뒤 공백 제거',
            trimDesc: '붙여넣은 텍스트의 처음과 끝에서 빈 줄과 공백을 제거합니다.',
            trimAliases: ['공백', '빈 줄', '스페이스', '줄바꿈', '다듬기'],
            invisibleName: '보이지 않는 문자',
            invisibleDesc: '너비가 0인 공백을 제거하고 줄바꿈 없는 공백을 일반 공백으로 바꿉니다.',
            invisibleAliases: ['ai', 'chatgpt', 'claude', 'llm', '유니코드', '보이지 않는', 'nbsp', '공백'],
            invisibleExampleStart: '그',
            invisibleExampleMiddle: '결과',
            invisibleExampleEnd: '는 좋았다.',
            invisibleExampleAfter: '그 결과는 좋았다.',
            quotesName: '따옴표',
            quotesDesc: '둥근 따옴표와 아포스트로피를 곧은 따옴표로 바꿉니다.',
            quotesAliases: ['따옴표', '큰따옴표', '스마트 따옴표', '아포스트로피', '문장 부호', '타이포그래피', 'ai'],
            quotesExample: '“완료”라고 했다.',
            dashesName: '대시',
            dashesDesc: '엔 대시와 엠 대시를 하이픈으로 바꿉니다.',
            dashesAliases: ['대시', '엠 대시', '엔 대시', '하이픈', '줄표', '붙임표', '문장 부호', '타이포그래피', 'ai'],
            dashesExample: '그 결과는 — 모든 예상을 깨고 — 좋았다.'
        },

        structure: {
            heading: '구조',
            listNestingName: '붙여넣을 때 목록 중첩 유지',
            listNestingDesc: '복사한 목록을 계층 구조를 유지한 채 붙여넣고, 붙여넣는 위치의 목록 항목에 맞춰 들여쓰기합니다.',
            listNestingAliases: ['목록', '중첩', '들여쓰기', '계층', '개요', '글머리 기호', '체크박스', '트리'],
            quoteContinuationName: '붙여넣을 때 인용문 계속',
            quoteContinuationDesc:
                '여러 줄 텍스트를 인용된 줄에 붙여넣을 때 모든 줄에 인용 기호를 붙여 전체 내용이 인용문이나 콜아웃 안에 유지되도록 합니다.',
            quoteContinuationAliases: ['인용', '인용문', '콜아웃', '인용구', '주의', '문단']
        },

        custom: {
            heading: '사용자 지정 처리',
            pipelineName: '사용자 지정 정규 표현식 스니펫을 텍스트에 적용',
            pastedText: '붙여넣은 텍스트',
            note: '노트',
            wikiButton: '위키 보기',
            regexButton: '정규 표현식 테스트 도구 열기',
            snippetsName: '텍스트 스니펫',
            snippetsDesc: '내장 규칙이 적용된 뒤 붙여넣은 텍스트 전체에 적용됩니다. 붙여넣을 때 실행할 스니펫을 켜세요.',
            urlSnippetsName: '링크 스니펫',
            urlSnippetsDesc:
                '페이지 제목을 가져온 뒤 붙여넣은 링크마다 적용됩니다. 규칙은 완성된 Markdown 링크만 보며, 링크 대상은 바뀌지 않습니다.',
            enabledSnippetsCount: { other: '활성화된 스니펫 {count}개' },
            snippetRulesCount: { other: '규칙 {count}개' },
            invalidRulesCount: { other: '잘못된 줄 {count}개' },
            unnamedSnippet: '이름 없는 스니펫',
            emptyState: '아직 만든 스니펫이 없습니다.',
            addSnippet: '스니펫 추가',
            editButton: '스니펫 편집',
            exportName: '스니펫 내보내기',
            exportDesc: '모든 스니펫을 위키 교환 형식으로 복사합니다.',
            exportButton: '스니펫 복사',
            importName: '스니펫 가져오기',
            importDesc: '위키 교환 형식에서 스니펫을 추가합니다.',
            previewName: '시험해 보기',
            previewDesc: '예제 텍스트를 입력하여 활성화된 모든 스니펫의 결과를 확인합니다.',
            modalPreviewDesc: '예제 텍스트를 입력하여 이 스니펫의 결과를 확인합니다.',
            previewInputLabel: '예제 텍스트',
            previewEmpty: '처리된 텍스트가 여기에 표시됩니다.',
            urlPreviewDesc: '제목이 붙은 링크 예제를 수정하여 활성화된 모든 링크 스니펫의 결과를 확인합니다.',
            urlModalPreviewDesc: '제목이 붙은 링크 예제를 수정하여 이 스니펫의 결과를 확인합니다.',
            urlPreviewLabel: '제목이 붙은 링크 예제',
            urlPreviewEmpty: '처리된 링크가 여기에 표시됩니다.',
            nameName: '이름',
            rulesName: '규칙',
            rulesDesc: '한 줄에 하나의 JavaScript 정규 표현식 바꾸기를 입력하세요.',
            wikiPasteHint: '위키에서 미리 만들어진 스니펫을 복사해 규칙 입력란에 바로 붙여넣으세요.',
            invalidLine: '{line}번 줄: {value}',
            saveButton: '저장',
            recognizedSnippetsCount: { other: '스니펫 {count}개 인식됨' },
            recognizedRulesCount: { other: '규칙 {count}개 인식됨' },
            unparseableName: '해석할 수 없는 줄',
            importFallbackName: '가져온 스니펫'
        }
    },

    imageModal: {
        title: '이미지 옵션',
        sizeName: '크기',
        className: 'CSS 클래스',
        none: '아무것도 안 함',
        apply: '적용',
        cancel: '취소'
    },

    pdfModal: {
        furniture: '페이지 번호 제거',
        singleParagraph: '모두 한 문단으로 합치기',
        description: '줄바꿈된 줄을 다시 잇고, 하이픈으로 나뉜 단어를 복원하고, 합자를 일반 글자로 바꾸고, 불필요한 공백을 제거합니다.',
        preview: '미리보기'
    },

    welcome: {
        title: 'Better Paste에 오신 것을 환영합니다',
        intro: [
            'Safari에서 복사한 이미지를 보관함에 바로 저장하고, 링크에서 추적 매개변수를 제거하고, 줄이 끊긴 터미널 출력을 이어 붙이고, AI 텍스트를 정리합니다. 그냥 붙여넣기만 하세요.',
            '시작하기 전에 한 가지 팁: **처리 없이 붙여넣기**를 `Cmd+Shift+V`(Windows에서는 `Ctrl+Shift+V`)에 지정해 두면 언제든지 클립보드 내용을 그대로 붙여넣을 수 있습니다.',
            '규칙은 설정, Better Paste에서 각각 따로 켜고 끌 수 있고, `{property}: false` 속성을 추가하면 해당 노트에서 플러그인이 꺼집니다.'
        ],
        startButton: '시작하기'
    },

    overlap: {
        title: 'Better Paste: 기능이 겹치는 플러그인',
        thanks: 'Better Paste를 설치하고 사용해 주셔서 감사합니다!',
        intro: {
            other: 'Better Paste와 기능이 거의 같은 플러그인이 {count}개 설치되어 있습니다. 다음 플러그인을 비활성화하거나 삭제해 주세요:'
        },
        outro: '설정 > 커뮤니티 플러그인에서 비활성화할 수 있습니다.',
        dontRemind: '다시 보지 않기',
        button: '확인'
    },

    whatsNew: {
        title: 'Better Paste의 새로운 기능',
        releaseHeading: '버전 {version} ({date})',
        categoryNew: '새 기능',
        categoryImproved: '개선',
        categoryChanged: '변경',
        categoryFixed: '수정',
        support: 'Better Paste가 도움이 되었다면 개발을 후원해 주세요.',
        coffeeButton: '☕️ 커피 한 잔 사주기',
        thanksButton: '고마워요!',
        dontShowAgain: '업데이트 후 다시 표시하지 않음'
    }
};
