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

/** Thai. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_TH: TranslationStrings = {
    commands: {
        paste: 'วาง',
        pasteRaw: 'วางโดยไม่ประมวลผล',
        cleanSelection: 'จัดระเบียบข้อความที่เลือก',
        toggleCleanup: 'สลับการจัดระเบียบอัตโนมัติ'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        cleanupOn: 'เปิดการประมวลผลอัตโนมัติแล้ว',
        cleanupOff: 'ปิดการประมวลผลอัตโนมัติแล้ว',
        selectTextFirst: 'เลือกข้อความก่อน',
        nothingToClean: 'ไม่มีอะไรให้จัดระเบียบ',
        clipboardFailed: 'อ่านคลิปบอร์ดไม่ได้',
        titleFailed: 'ดึงชื่อเรื่องไม่สำเร็จ',
        fetchingTitle: 'กำลังดึงชื่อเรื่อง...',
        imagesFailed: { other: 'บันทึกรูปภาพ {count} รูปไม่สำเร็จ' },
        imagesFailedLinkKept: '{images} จึงคงลิงก์เดิมไว้',
        imagesFailedNothingPasted: '{images} จึงไม่ได้วางอะไรเลย'
    },

    settings: {
        exampleFallback: '{description} ตัวอย่าง: {example}',
        plainFallback: '{description} {example}',

        start: {
            heading: 'เกี่ยวกับ',
            whatsNewName: 'มีอะไรใหม่ใน Better Paste {version}',
            whatsNewDesc: 'สิ่งที่เปลี่ยนไปในรุ่นล่าสุด',
            whatsNewAliases: ['บันทึกการเปลี่ยนแปลง', 'การเปลี่ยนแปลง', 'รุ่น', 'อัปเดต', 'ประวัติ'],
            whatsNewButton: 'ดูการอัปเดตล่าสุด',
            supportName: 'สนับสนุนการพัฒนา',
            supportDesc: 'หาก Better Paste เป็นประโยชน์กับคุณ โปรดพิจารณาสนับสนุนการพัฒนา',
            supportAliases: ['สนับสนุน', 'บริจาค', 'กาแฟ', 'github'],
            sponsorButton: '❤️ สนับสนุน',
            coffeeButton: '☕️ เลี้ยงกาแฟ',
            pluginsName: 'ดูปลั๊กอินอื่นของฉัน',
            pluginsAliases: ['ปลั๊กอิน', 'notebook navigator', 'pixel perfect image', 'ผู้พัฒนา', 'เพิ่มเติม'],
            notebookNavigatorDesc: 'ตัวเรียกดูไฟล์และปฏิทินที่ดีกว่า',
            pixelPerfectImageDesc: 'ปรับขนาดภาพได้แม่นยำและอื่น ๆ'
        },

        behavior: {
            autoCleanName: 'จัดระเบียบทุกครั้งที่วาง',
            autoCleanDesc:
                'ใช้กฎกับการวางทุกครั้ง เมื่อปิดไว้ กฎจะทำงานเฉพาะผ่านคำสั่งของ Better Paste โน้ตแต่ละฉบับยกเว้นตัวเองได้ด้วยคุณสมบัติ "bp: false" หรือเลือกให้จัดระเบียบได้ด้วย "bp: true"',
            autoCleanAliases: ['อัตโนมัติ', 'เปิด', 'ปิด', 'โน้ต', 'ยกเว้น', 'คุณสมบัติ', 'frontmatter']
        },

        images: {
            heading: 'รูปภาพ',
            savingName: 'บันทึกรูปภาพที่วางลงในห้องนิรภัย',
            savingDesc:
                'บันทึกรูปภาพที่วางลงในโฟลเดอร์ไฟล์แนบของคุณ และลิงก์ไปยังไฟล์ในเครื่องแทนที่อยู่เว็บ ครอบคลุมทั้ง "คัดลอกรูปภาพ" ของ Safari รูปภาพในเนื้อหาเว็บที่คัดลอกมา และที่อยู่รูปภาพที่วาง โดยค่าเริ่มต้นชื่อไฟล์มาจากที่อยู่:',
            savingAliases: ['ดาวน์โหลด', 'ไฟล์แนบ', 'safari', 'ภาพหน้าจอ', 'รูปภาพ', 'โฟลเดอร์', 'ชื่อไฟล์', 'ความกว้าง', 'ขนาด'],
            nameFormatName: 'ชื่อไฟล์',
            nameFormatDesc: 'วิธีตั้งชื่อรูปภาพที่บันทึก',
            nameFormatSource: 'ใช้ชื่อจากต้นทาง',
            nameFormatCustom: 'รูปแบบกำหนดเอง',
            customName: 'รูปแบบกำหนดเอง',
            customDesc: 'ใช้ {{name}} แทนชื่อต้นทาง และรูปแบบวันที่ของ Moment เช่น YYYY-MM-DD',
            customMomentLink: 'รูปแบบ Moment',
            customExample: 'ตัวอย่าง: {value}',
            customAliases: ['ชื่อ', 'ชื่อไฟล์', 'วันที่', 'moment', 'YYYY', '{{name}}']
        },

        frontmatter: {
            heading: 'Frontmatter',
            notePropertyName: 'คุณสมบัติของโน้ต',
            notePropertyDesc:
                'คุณสมบัติที่เปิดหรือปิด Better Paste สำหรับโน้ตแต่ละฉบับ เมื่อเป็น "bp: false" โน้ตจะไม่ถูกแก้ไข และเมื่อเป็น "bp: true" โน้ตจะถูกจัดระเบียบแม้ว่า "จัดระเบียบทุกครั้งที่วาง" จะปิดอยู่ เว้นว่างไว้เพื่อไม่ใช้คุณสมบัตินี้',
            notePropertyAliases: ['โน้ต', 'คุณสมบัติ', 'frontmatter', 'ยกเว้น', 'ปิด', 'เปิด', 'bp'],
            sizePropertyName: 'คุณสมบัติความกว้างรูปภาพ',
            sizePropertyDesc:
                'คุณสมบัติใน frontmatter ที่กำหนดความกว้างของรูปภาพที่วางลงในโน้ต เมื่อโน้ตมี "image-width: 400" รูปภาพที่วางจะกลายเป็น ![[photo.png|400]] เว้นว่างไว้เพื่อไม่ใส่ความกว้าง',
            sizePropertyAliases: ['ขนาด', 'frontmatter', 'คุณสมบัติ', 'ปรับขนาด']
        },

        links: {
            heading: 'ลิงก์',
            titlesName: 'ดึงชื่อเรื่องของลิงก์ที่วาง',
            titlesDesc:
                'การวางที่อยู่เว็บเพียงลำพังจะแทรกลิงก์ Markdown พร้อมชื่อหน้าเว็บ หากมีข้อความที่เลือกไว้ ข้อความนั้นจะกลายเป็นป้ายกำกับและไม่มีการดึงชื่อเรื่อง หากดึงชื่อเรื่องไม่ได้ จะคงที่อยู่ล้วน ๆ ไว้',
            titlesAliases: ['ชื่อเรื่อง', 'หน้าเว็บ', 'เว็บไซต์', 'ลิงก์ markdown', 'ดาวน์โหลด'],
            cleaningName: 'จัดระเบียบลิงก์ที่วาง',
            cleaningDesc: 'ลบพารามิเตอร์ติดตามออกจากลิงก์ที่วาง:',
            cleaningAliases: ['url', 'ติดตาม', 'utm', 'พารามิเตอร์', 'คิวรี', 'เว็บไซต์', 'โดเมน', 'youtube', 'ข้อยกเว้น'],
            stripName: 'จะลบพารามิเตอร์ใด',
            stripDesc: 'พารามิเตอร์ติดตามคือชื่ออย่าง utm_source, fbclid และ gclid',
            stripAliases: ['utm', 'ติดตาม', 'คิวรี', 'พารามิเตอร์'],
            stripAll: 'ทุกพารามิเตอร์ ยกเว้นที่กฎของเว็บไซต์เก็บไว้',
            stripTracking: 'เฉพาะพารามิเตอร์ติดตามที่รู้จัก',
            rulesName: 'กฎของเว็บไซต์',
            rulesDesc: 'พารามิเตอร์ที่จะเก็บไว้ในเว็บไซต์ที่ระบุ',
            rulesCount: { other: '{count} เว็บไซต์' },
            listName: 'กฎเว็บไซต์ของคุณ',
            listDesc:
                '{sites} ปลั๊กอินรองรับอยู่แล้ว เพิ่มกฎของคุณเองที่นี่ บรรทัดละหนึ่งกฎ "example.com" เก็บทุกพารามิเตอร์ของเว็บไซต์นั้น "example.com: a, b" เก็บเฉพาะสองตัวนั้น และ "!example.com" ลบกฎที่มาพร้อมปลั๊กอิน โดเมนย่อยจะจับคู่ให้อัตโนมัติ',
            listShippedCount: { other: 'เว็บไซต์ยอดนิยม {count} แห่ง' },
            listAliases: ['โดเมน', 'ข้อยกเว้น', 'บัญชีขาว', 'youtube'],
            listInvalid: 'ไม่ใช่ชื่อเว็บไซต์: {values}',
            testerName: 'ลองดู',
            testerDesc: 'วางลิงก์เพื่อดูว่ากฎเก็บอะไรไว้',
            testerLabel: 'ลิงก์ที่จะจัดระเบียบ',
            testerEmpty: 'ลิงก์ที่จัดระเบียบแล้วจะปรากฏที่นี่'
        },

        terminal: {
            heading: 'ข้อความเทอร์มินัล',
            cleanupName: 'จัดระเบียบผลลัพธ์เทอร์มินัล',
            cleanupDesc:
                'ต่อบรรทัดที่เทอร์มินัลตัดกลับเข้าด้วยกัน และลบรหัสสีกับการเยื้องที่ต้นบรรทัด บล็อกโค้ด ตาราง และรายการจะไม่ถูกแตะต้อง',
            cleanupAliases: ['ตัดบรรทัด', 'ต่อบรรทัด', 'ansi', 'คอนโซล', 'เชลล์', 'การเยื้อง', 'สัญลักษณ์หัวข้อ', 'รายการ', 'markdown'],
            pageName: 'การจัดการข้อความเทอร์มินัล',
            pageDesc: 'การต่อบรรทัดและอักขระหัวข้อย่อย',
            rejoinName: 'เมื่อใดจึงต่อบรรทัดที่ถูกตัด',
            rejoinDesc: 'บรรทัดจะถูกต่อเข้ากับบรรทัดด้านบนก็ต่อเมื่อบรรทัดนั้นดูเต็ม',
            rejoinAliases: ['การเยื้อง', 'ตัดบรรทัด', 'เชิงรุก', 'ปลอดภัย', 'git log'],
            rejoinIndented: 'เฉพาะเมื่อบรรทัดมีการเยื้อง',
            rejoinAny: 'ไม่ว่าบรรทัดจะเยื้องหรือไม่',
            rejoinNever: 'ไม่ต่อเลย ลบเพียงรหัสและการเยื้อง',
            bulletsName: 'อักขระหัวข้อย่อย',
            bulletsDesc: 'จะทำอย่างไรกับอักขระหัวข้อย่อยอย่าง • ในผลลัพธ์เทอร์มินัล',
            bulletsAliases: ['รายการ', 'markdown', 'ขีด'],
            bulletsMarkdown: 'แปลงเป็นรายการ Markdown',
            bulletsPreserve: 'คงไว้อย่างเดิม',
            testerName: 'ลองดู',
            testerDesc: 'วางผลลัพธ์เทอร์มินัลเพื่อดูว่าถูกจัดระเบียบอย่างไร',
            testerLabel: 'ข้อความเทอร์มินัลที่จะจัดระเบียบ',
            testerEmpty: 'ข้อความที่จัดระเบียบแล้วจะปรากฏที่นี่',
            testerSample: [
                '• ขั้นตอนเพิ่มเติมจำกัดอยู่แค่ตัวจัดการ Enter ของรายการ การเปลี่ยนแปลงหลักจึงตรงไปตรงมา ระหว่างไล่ดูขั้นตอนใกล้เคียงผมพบ',
                '  จุดสะดุดที่น่าตรวจสอบสองจุด: การเลือกอาจกระโดดหลังการรีเฟรช'
            ]
        },

        text: {
            heading: 'การประมวลผลข้อความ',
            trimName: 'ตัดช่องว่างรอบข้าง',
            trimDesc: 'ลบบรรทัดว่างและช่องว่างที่ต้นและท้ายข้อความที่วาง',
            trimAliases: ['ช่องว่าง', 'บรรทัดว่าง', 'เว้นวรรค', 'ขึ้นบรรทัดใหม่', 'ตัดขอบ'],
            commasName: 'จุลภาค',
            commasDesc: 'ตำแหน่งของจุลภาคที่อยู่ติดกับอัญประกาศคู่ปิด',
            commasAliases: ['จุลภาค', 'อัญประกาศ', 'คำพูด', 'เครื่องหมายวรรคตอน', 'รูปแบบ'],
            commasNone: 'ไม่เปลี่ยนแปลง',
            commasInside: 'จุลภาคอยู่ในอัญประกาศ',
            commasOutside: 'จุลภาคอยู่นอกอัญประกาศ',
            commasExampleSource: 'สถานะคือ "เสร็จแล้ว," ถัดไปคือ "รอดำเนินการ"',
            commasExampleOutside: 'สถานะคือ "เสร็จแล้ว", ถัดไปคือ "รอดำเนินการ"',
            invisibleName: 'อักขระที่มองไม่เห็น',
            invisibleDesc: 'ลบช่องว่างความกว้างศูนย์และเปลี่ยนช่องว่างไม่ตัดคำให้เป็นช่องว่างปกติ',
            invisibleAliases: ['ai', 'chatgpt', 'claude', 'llm', 'unicode', 'มองไม่เห็น', 'nbsp', 'ช่องว่าง'],
            invisibleExampleStart: 'ผลลัพธ์คือ',
            invisibleExampleMiddle: 'OK',
            invisibleExampleEnd: ' แล้ว',
            invisibleExampleAfter: 'ผลลัพธ์คือ OK แล้ว',
            quotesName: 'อัญประกาศ',
            quotesDesc: 'เปลี่ยนอัญประกาศและอะพอสทรอฟีให้เป็นรูปแบบนี้',
            quotesAliases: [
                'อัญประกาศ',
                'เครื่องหมายคำพูด',
                'อัญประกาศโค้ง',
                'อัญประกาศตรง',
                'อะพอสทรอฟี',
                'เครื่องหมายวรรคตอน',
                'การพิมพ์',
                'ai'
            ],
            quotesNone: 'ไม่เปลี่ยนแปลง',
            quotesStraight: 'อัญประกาศตรง',
            quotesCurly: 'อัญประกาศโค้ง',
            quotesExample: '“เสร็จแล้ว” เธอบอก แล้วเสริมว่า "อย่าหยุดนะ"',
            dashesName: 'เครื่องหมายขีด',
            dashesDesc: 'เปลี่ยนเครื่องหมายขีดระหว่างคำให้เป็นรูปแบบนี้',
            dashesAliases: ['ขีด', 'แดช', 'ขีดยาว', 'ขีดกลาง', 'ยัติภังค์', 'เครื่องหมายวรรคตอน', 'การพิมพ์', 'ai'],
            dashesNone: 'ไม่เปลี่ยนแปลง',
            dashesHyphen: 'ยัติภังค์',
            dashesEn: 'เอ็นแดช',
            dashesEm: 'เอ็มแดช',
            dashesEmSpaced: 'เอ็มแดชแบบเว้นวรรค',
            dashesExample: 'ผลลัพธ์ - แม้จะมีอุปสรรค — ก็ออกมาดี'
        }
    },

    welcome: {
        title: 'ยินดีต้อนรับสู่ Better Paste',
        intro: [
            'คัดลอกรูปภาพจาก Safari ลงห้องนิรภัยได้โดยตรง วางลิงก์โดยไม่มีพารามิเตอร์ติดตาม ต่อบรรทัดที่ถูกตัดในผลลัพธ์เทอร์มินัล และทำความสะอาดข้อความจาก AI แค่วาง ที่เหลือ Better Paste จัดการให้',
            'เคล็ดลับก่อนเริ่ม: ตั้งค่า **วางโดยไม่ประมวลผล** เป็น `Cmd+Shift+V` (`Ctrl+Shift+V` บน Windows) เพื่อให้วางเนื้อหาในคลิปบอร์ดแบบเดิมได้ทุกเมื่อ',
            'กฎแต่ละข้อมีสวิตช์ของตัวเองใน การตั้งค่า, Better Paste และคุณสมบัติ `bp: false` จะปิดปลั๊กอินสำหรับโน้ตนั้น'
        ],
        startButton: 'เริ่มใช้งาน'
    },

    whatsNew: {
        title: 'มีอะไรใหม่ใน Better Paste',
        scrollLabel: 'หมายเหตุประจำรุ่น',
        releaseHeading: 'รุ่น {version} ({date})',
        categoryNew: 'ใหม่',
        categoryImproved: 'ปรับปรุง',
        categoryChanged: 'เปลี่ยนแปลง',
        categoryFixed: 'แก้ไข',
        support: 'หาก Better Paste เป็นประโยชน์กับคุณ โปรดพิจารณาสนับสนุนการพัฒนา',
        coffeeButton: '☕️ เลี้ยงกาแฟ',
        thanksButton: 'ขอบคุณ!'
    }
};
