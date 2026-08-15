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
        imagesFailed: { other: '이미지 {count}개를 저장하지 못했습니다' },
        imagesFailedLinkKept: '{images}. 원래 링크를 유지했습니다',
        imagesFailedNothingPasted: '{images}. 그래서 아무것도 붙여넣지 않았습니다'
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
                '붙여넣을 때마다 규칙을 적용합니다. 꺼 두면 Better Paste 명령에서만 규칙이 적용됩니다. 개별 노트는 "bp: false" 속성으로 제외하거나 "bp: true" 속성으로 포함할 수 있습니다.',
            autoCleanAliases: ['자동', '켜기', '끄기', '노트', '제외', '속성', '프론트매터', 'frontmatter']
        },

        images: {
            heading: '이미지',
            savingName: '붙여넣은 이미지를 보관함에 저장',
            savingDesc:
                '붙여넣은 이미지를 첨부 파일 폴더에 저장하고 웹 주소 대신 로컬 파일을 링크합니다. Safari의 "이미지 복사", 복사한 웹 콘텐츠 속 이미지, 붙여넣은 이미지 주소가 여기에 해당합니다. 파일 이름은 기본적으로 주소에서 가져옵니다:',
            savingAliases: ['다운로드', '첨부 파일', 'safari', '스크린샷', '이미지', '폴더', '파일 이름', '너비', '크기'],
            nameFormatName: '파일 이름',
            nameFormatDesc: '저장한 이미지의 이름을 정하는 방식.',
            nameFormatSource: '원본 이름 사용',
            nameFormatCustom: '사용자 형식',
            customName: '사용자 형식',
            customDesc: '원본 이름에는 {{name}}을, 날짜에는 YYYY-MM-DD 같은 Moment 형식을 사용하세요.',
            customMomentLink: 'Moment 형식',
            customExample: '예: {value}',
            customAliases: ['이름', '파일 이름', '날짜', 'moment', 'YYYY', '{{name}}']
        },

        frontmatter: {
            heading: '프론트매터',
            notePropertyName: '노트 속성',
            notePropertyDesc:
                '개별 노트에서 Better Paste를 켜거나 끄는 속성입니다. "bp: false"이면 노트를 그대로 두고, "bp: true"면 "붙여넣을 때마다 정리"가 꺼져 있어도 정리합니다. 비워 두면 이 속성을 무시합니다.',
            notePropertyAliases: ['노트', '속성', '프론트매터', 'frontmatter', '제외', '끄기', '켜기', 'bp'],
            sizePropertyName: '이미지 너비 속성',
            sizePropertyDesc:
                '노트에 붙여넣는 이미지의 너비를 정하는 프론트매터 속성입니다. 노트에 "bp-image-width: 400"이 있으면 붙여넣은 이미지가 ![[photo.png|400]]이 됩니다. 비워 두면 너비를 넣지 않습니다.',
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
            stripName: '어떤 매개변수를 제거할지',
            stripDesc: '추적 매개변수는 utm_source, fbclid, gclid 같은 이름입니다.',
            stripAliases: ['utm', '추적', '쿼리', '매개변수'],
            stripAll: '사이트 규칙이 남기는 경우를 빼고 모든 매개변수',
            stripTracking: '알려진 추적 매개변수만',
            rulesName: '사이트 규칙',
            rulesDesc: '특정 사이트에서 남길 매개변수.',
            rulesCount: { other: '{count}개 사이트' },
            listName: '내 사이트 규칙',
            listDesc:
                '{sites}은 플러그인이 이미 처리합니다. 여기에 직접 만든 규칙을 한 줄에 하나씩 추가하세요. "example.com"은 그 사이트의 모든 매개변수를 남기고, "example.com: a, b"는 그 둘만 남기며, "!example.com"은 플러그인에 포함된 규칙을 없앱니다. 하위 도메인은 자동으로 일치합니다.',
            listShippedCount: { other: '주요 사이트 {count}곳' },
            listAliases: ['도메인', '예외', '허용 목록', 'youtube'],
            listInvalid: '사이트 이름이 아닙니다: {values}',
            testerName: '시험해 보기',
            testerDesc: '링크를 붙여넣어 규칙이 무엇을 남기는지 확인하세요.',
            testerLabel: '정리할 링크',
            testerEmpty: '정리된 링크가 여기에 표시됩니다.'
        },

        terminal: {
            heading: '터미널 텍스트',
            cleanupName: '터미널 출력 정리',
            cleanupDesc: '터미널이 줄바꿈한 행을 다시 잇고 색상 코드와 앞쪽 들여쓰기를 없앱니다. 코드 블록, 표, 목록은 그대로 둡니다.',
            cleanupAliases: ['줄바꿈', '잇기', 'ansi', '콘솔', '셸', '들여쓰기', '글머리 기호', '목록', 'markdown'],
            pageName: '터미널 텍스트 처리',
            pageDesc: '줄 잇기와 글머리 기호 문자.',
            rejoinName: '끊어진 줄을 다시 잇는 시점',
            rejoinDesc: '윗줄이 가득 차 보일 때만 그 줄에 이어 붙입니다.',
            rejoinAliases: ['들여쓰기', '줄바꿈', '적극적', '안전', 'git log'],
            rejoinIndented: '그 줄이 들여쓰기된 경우에만',
            rejoinAny: '들여쓰기 여부와 상관없이',
            rejoinNever: '절대 잇지 않고 코드와 들여쓰기만 제거',
            bulletsName: '글머리 기호 문자',
            bulletsDesc: '터미널 출력의 • 같은 글머리 기호를 어떻게 처리할지.',
            bulletsAliases: ['목록', 'markdown', '대시'],
            bulletsMarkdown: 'Markdown 목록 항목으로 변환',
            bulletsPreserve: '그대로 두기',
            testerName: '시험해 보기',
            testerDesc: '터미널 출력을 붙여넣어 어떻게 정리되는지 확인하세요.',
            testerLabel: '정리할 터미널 텍스트',
            testerEmpty: '정리된 텍스트가 여기에 표시됩니다.',
            testerSample: [
                '• 추가 단계는 목록의 Enter 처리기에만 한정되므로 핵심 변경은 간단합니다. 인접한 흐름을 따라가다가 찾은 것은',
                '  확인해 볼 만한 마찰 지점 두 곳으로, 새로 고침 뒤 선택이 튈 수 있습니다.'
            ]
        },

        text: {
            heading: '텍스트 처리',
            trimName: '앞뒤 공백 제거',
            trimDesc: '붙여넣은 텍스트의 처음과 끝에서 빈 줄과 공백을 제거합니다.',
            trimAliases: ['공백', '빈 줄', '스페이스', '줄바꿈', '다듬기'],
            commasName: '쉼표와 따옴표',
            commasDesc: '닫는 큰따옴표 옆에 쉼표를 두는 위치.',
            commasAliases: ['쉼표', '따옴표', '인용', '문장 부호', '스타일'],
            commasNone: '변경 없음',
            commasInside: '쉼표를 따옴표 안쪽에',
            commasOutside: '쉼표를 따옴표 바깥쪽에',
            commasExampleSource: '상태는 "완료," 다음은 "대기"였다.',
            commasExampleOutside: '상태는 "완료", 다음은 "대기"였다.',
            invisibleName: 'AI 정리: 보이지 않는 문자',
            invisibleDesc: '너비가 0인 공백을 제거하고 줄바꿈 없는 공백을 일반 공백으로 바꿉니다.',
            invisibleAliases: [
                'ai',
                'chatgpt',
                'claude',
                'llm',
                '대시',
                '엠 대시',
                '엔 대시',
                '하이픈',
                '유니코드',
                '보이지 않는',
                'nbsp',
                '타이포그래피',
                '문장 부호',
                '공백'
            ],
            invisibleExampleStart: '그',
            invisibleExampleMiddle: '결과',
            invisibleExampleEnd: '는 좋았다.',
            invisibleExampleAfter: '그 결과는 좋았다.',
            punctuationName: 'AI 정리: 대시와 따옴표',
            punctuationDesc: '긴 대시를 하이픈으로, 둥근 따옴표를 곧은 따옴표로 바꿉니다.',
            punctuationAliases: ['엠 대시', '엔 대시', '하이픈', '따옴표', '스마트 따옴표', '아포스트로피', '문장 부호', '타이포그래피'],
            punctuationExampleBefore: '“그 결과는 — 모든 예상을 깨고 — 완벽했다.”',
            punctuationExampleAfter: '"그 결과는 - 모든 예상을 깨고 - 완벽했다."'
        }
    },

    welcome: {
        title: 'Better Paste에 오신 것을 환영합니다',
        intro: [
            'Safari에서 복사한 이미지를 보관함에 바로 저장하고, 링크에서 추적 매개변수를 제거하고, 줄이 끊긴 터미널 출력을 이어 붙이고, AI 텍스트를 정리합니다. 그냥 붙여넣기만 하세요.',
            '시작하기 전에 한 가지 팁: **처리 없이 붙여넣기**를 `Cmd+Shift+V`(Windows에서는 `Ctrl+Shift+V`)에 지정해 두면 언제든지 클립보드 내용을 그대로 붙여넣을 수 있습니다.',
            '규칙은 설정, Better Paste에서 각각 따로 켜고 끌 수 있고, `bp: false` 속성을 추가하면 해당 노트에서 플러그인이 꺼집니다.'
        ],
        startButton: '시작하기'
    },

    whatsNew: {
        title: 'Better Paste의 새로운 기능',
        scrollLabel: '릴리스 노트',
        releaseHeading: '버전 {version} ({date})',
        categoryNew: '새 기능',
        categoryImproved: '개선',
        categoryChanged: '변경',
        categoryFixed: '수정',
        support: 'Better Paste가 도움이 되었다면 개발을 후원해 주세요.',
        coffeeButton: '☕️ 커피 한 잔 사주기',
        thanksButton: '고마워요!'
    }
};
