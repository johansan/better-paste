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
        separator: ', ',
        cleanupOn: 'เปิดการประมวลผลอัตโนมัติแล้ว',
        cleanupOff: 'ปิดการประมวลผลอัตโนมัติแล้ว',
        selectTextFirst: 'เลือกข้อความก่อน',
        nothingToClean: 'ไม่มีอะไรให้จัดระเบียบ',
        clipboardFailed: 'อ่านคลิปบอร์ดไม่ได้',
        titleFailed: 'ดึงชื่อเรื่องไม่สำเร็จ',
        fetchingTitle: 'กำลังดึงชื่อเรื่อง{dots}',
        imagesFailed: { other: 'บันทึกรูปภาพ {count} รูปไม่สำเร็จ' },
        imagesFailedLinkKept: '{images} จึงคงลิงก์เดิมไว้',
        imagesFailedNothingPasted: '{images} จึงไม่ได้วางอะไรเลย เนื้อหายังอยู่ในคลิปบอร์ด',
        aiTextCleaned: 'จัดระเบียบข้อความ AI แล้ว',
        terminalCleaned: 'จัดระเบียบผลลัพธ์เทอร์มินัลแล้ว',
        textProcessed: 'ปรับรูปแบบข้อความแล้ว',
        urlsCleaned: { other: 'จัดระเบียบลิงก์ {count} รายการ' },
        imagesSaved: { other: 'บันทึกรูปภาพ {count} รูป' }
    },

    settings: {
        exampleFallback: '{description} ตัวอย่าง: {example}',
        plainFallback: '{description} {example}',

        start: {
            whatsNewName: 'มีอะไรใหม่ใน Better Paste {version}',
            whatsNewDesc: 'สิ่งที่เปลี่ยนไปในรุ่นล่าสุด',
            whatsNewAliases: ['บันทึกการเปลี่ยนแปลง', 'การเปลี่ยนแปลง', 'รุ่น', 'อัปเดต', 'ประวัติ'],
            whatsNewButton: 'ดูการอัปเดตล่าสุด',
            supportName: 'สนับสนุนการพัฒนา',
            supportDesc: 'หาก Better Paste เป็นประโยชน์กับคุณ โปรดพิจารณาสนับสนุนการพัฒนาต่อไป',
            supportAliases: ['สนับสนุน', 'บริจาค', 'กาแฟ', 'github'],
            sponsorButton: '❤️ สนับสนุน',
            coffeeButton: '☕️ เลี้ยงกาแฟ'
        },

        behavior: {
            heading: 'พฤติกรรม',
            autoCleanName: 'จัดระเบียบทุกครั้งที่วาง',
            autoCleanDesc:
                'ใช้กฎกับการวางทุกครั้ง ปิดตัวเลือกนี้เพื่อใช้เฉพาะคำสั่ง โน้ตแต่ละฉบับยกเว้นตัวเองได้ด้วยคุณสมบัติ "better-paste: false"',
            autoCleanAliases: ['อัตโนมัติ', 'เปิด', 'ปิด', 'โน้ต', 'ยกเว้น', 'คุณสมบัติ', 'frontmatter'],
            showNoticesName: 'แสดงการแจ้งเตือนเมื่อการวางถูกเปลี่ยน',
            showNoticesDesc: 'สรุปหนึ่งบรรทัดว่าจัดระเบียบอะไรไปบ้าง ความล้มเหลวจะแจ้งเสมอไม่ว่าตั้งค่านี้ไว้อย่างไร',
            showNoticesAliases: ['การแจ้งเตือน', 'สรุป', 'ข้อความ', 'เงียบ']
        },

        images: {
            heading: 'รูปภาพ',
            savingName: 'บันทึกรูปภาพที่วางลงในห้องนิรภัย',
            savingDesc:
                'บันทึกรูปภาพที่วางเป็นไฟล์ในเครื่องแทนที่จะทิ้งลิงก์รูปภาพภายนอกไว้ ครอบคลุมทั้ง "คัดลอกรูปภาพ" ของ Safari รูปภาพในเนื้อหาเว็บที่คัดลอกมา และที่อยู่รูปภาพเดี่ยว รูปภาพจะถูกบันทึกในโฟลเดอร์ไฟล์แนบของห้องนิรภัย เมื่อเลือก "ใช้ชื่อจากต้นทาง":',
            savingAliases: ['ดาวน์โหลด', 'ไฟล์แนบ', 'safari', 'ภาพหน้าจอ', 'รูปภาพ', 'โฟลเดอร์', 'ชื่อไฟล์', 'ความกว้าง', 'ขนาด'],
            pageName: 'การจัดการรูปภาพ',
            pageDesc: 'ชื่อไฟล์และความกว้างของรูปภาพต่อโน้ต',
            nameFormatName: 'ชื่อไฟล์',
            nameFormatDesc: 'เลือกวิธีตั้งชื่อไฟล์รูปภาพที่บันทึก',
            nameFormatSource: 'ใช้ชื่อจากต้นทาง',
            nameFormatCustom: 'รูปแบบกำหนดเอง',
            customName: 'รูปแบบกำหนดเอง',
            customDesc: 'ใช้ {{name}} แทนชื่อต้นทาง และรูปแบบวันที่ของ Moment เช่น YYYY-MM-DD',
            customMomentLink: 'รูปแบบ Moment',
            customExample: 'ตัวอย่าง: {value}',
            customAliases: ['ชื่อ', 'ชื่อไฟล์', 'วันที่', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'คุณสมบัติความกว้างรูปภาพ',
            sizePropertyDesc:
                'คุณสมบัติใน frontmatter ที่กำหนดความกว้างของรูปภาพที่วางลงในโน้ต โน้ตที่ใช้คุณสมบัตินี้จะรับหน้าที่วางภาพหน้าจอแทน Obsidian เว้นว่างไว้เพื่อปิดการทำงาน',
            sizePropertyAliases: ['ขนาด', 'frontmatter', 'คุณสมบัติ', 'ปรับขนาด']
        },

        links: {
            heading: 'ลิงก์',
            titlesName: 'ดึงชื่อเรื่องของลิงก์ที่วาง',
            titlesDesc:
                'เมื่อคลิปบอร์ดมีเพียงที่อยู่เว็บที่ไม่ใช่รูปภาพ ระบบจะดึงชื่อหน้าเว็บแล้ววางเป็นลิงก์ Markdown ข้อความอื่นที่เลือกไว้จะกลายเป็นป้ายกำกับโดยไม่ส่งคำขอใด ๆ หากดึงชื่อเรื่องไม่ได้ จะคงที่อยู่เดิมไว้',
            titlesAliases: ['ชื่อเรื่อง', 'หน้าเว็บ', 'เว็บไซต์', 'ลิงก์ markdown', 'ดาวน์โหลด'],
            cleaningName: 'จัดระเบียบลิงก์ที่วาง',
            cleaningDesc: 'ลบพารามิเตอร์ติดตามออกจากลิงก์ที่วาง ส่วนที่ขีดฆ่าจะถูกลบ:',
            cleaningAliases: ['url', 'ติดตาม', 'utm', 'พารามิเตอร์', 'คิวรี', 'เว็บไซต์', 'โดเมน', 'youtube', 'ข้อยกเว้น'],
            stripName: 'จะลบพารามิเตอร์ใด',
            stripDesc:
                'เลือกว่าจะลบพารามิเตอร์คิวรีทั้งหมด หรือเฉพาะพารามิเตอร์ติดตามที่รู้จัก กฎของเว็บไซต์เก็บพารามิเตอร์ไว้ได้ในทั้งสองโหมด',
            stripAliases: ['utm', 'ติดตาม', 'คิวรี', 'พารามิเตอร์'],
            stripAll: 'ทุกพารามิเตอร์ ยกเว้นที่กฎของเว็บไซต์เก็บไว้',
            stripTracking: 'เฉพาะพารามิเตอร์ที่รู้ว่าใช้ติดตาม',
            rulesName: 'กฎสำหรับเก็บพารามิเตอร์',
            rulesDesc: 'กฎของเว็บไซต์สำหรับเก็บพารามิเตอร์คิวรีบางตัวไว้ในทั้งสองโหมดการลบ',
            rulesCount: { other: '{count} เว็บไซต์' },
            listName: 'กฎเว็บไซต์ของคุณ',
            listDesc:
                '{sites} รองรับอยู่แล้วและอัปเดตไปพร้อมกับปลั๊กอิน เพิ่มกฎเว็บไซต์ของคุณเองที่นี่ บรรทัดละหนึ่งกฎ "example.com" เก็บทุกพารามิเตอร์ของเว็บไซต์นั้น "example.com: a, b" เก็บเฉพาะสองตัวนั้น และ "!example.com" ยกเลิกกฎที่มาพร้อมปลั๊กอิน ในโหมด "เฉพาะพารามิเตอร์ที่รู้ว่าใช้ติดตาม" กฎจะช่วยเก็บเฉพาะพารามิเตอร์ติดตามที่ตรงกัน เพราะพารามิเตอร์อื่นถูกเก็บไว้อยู่แล้ว โดเมนย่อยจะจับคู่ให้อัตโนมัติ',
            listShippedCount: { other: 'เว็บไซต์ยอดนิยม {count} แห่ง' },
            listAliases: ['โดเมน', 'ข้อยกเว้น', 'บัญชีขาว', 'youtube'],
            listInvalid: 'ไม่ใช่ชื่อเว็บไซต์: {values}',
            testerName: 'ลองดู',
            testerDesc: 'วางลิงก์เพื่อดูว่ากฎเหล่านี้จะเก็บอะไรไว้',
            testerLabel: 'ลิงก์ที่จะจัดระเบียบ',
            testerEmpty: 'ลิงก์ที่จัดระเบียบแล้วจะปรากฏที่นี่'
        },

        terminal: {
            heading: 'ข้อความเทอร์มินัล',
            cleanupName: 'จัดระเบียบผลลัพธ์เทอร์มินัล',
            cleanupDesc:
                'ต่อบรรทัดที่ถูกตัดในผลลัพธ์เทอร์มินัลกลับเข้าด้วยกันและลบการเยื้อง รหัสสีจะถูกลบออก บล็อกโค้ด ตาราง และรายการในลิสต์จะไม่ถูกแตะต้อง',
            cleanupAliases: ['ตัดบรรทัด', 'ต่อบรรทัด', 'ansi', 'คอนโซล', 'เชลล์', 'การเยื้อง', 'สัญลักษณ์หัวข้อ', 'รายการ', 'markdown'],
            pageName: 'การจัดการข้อความเทอร์มินัล',
            pageDesc: 'เงื่อนไขการต่อบรรทัดและอักขระหัวข้อย่อย',
            rejoinName: 'เมื่อใดจึงต่อบรรทัดที่ถูกตัด',
            rejoinDesc: 'เงื่อนไขที่ทำให้ถือว่าบรรทัดหนึ่งเป็นส่วนต่อของบรรทัดก่อนหน้า',
            rejoinAliases: ['การเยื้อง', 'ตัดบรรทัด', 'เชิงรุก', 'ปลอดภัย', 'git log'],
            rejoinIndented: 'เฉพาะเมื่อบรรทัดถัดไปมีการเยื้อง',
            rejoinAny: 'เมื่อใดก็ตามที่บรรทัดด้านบนดูเต็ม',
            rejoinNever: 'ไม่ต่อบรรทัดเลย ลบเพียงรหัสและการเยื้อง',
            bulletsName: 'อักขระหัวข้อย่อย',
            bulletsDesc: 'กำหนดว่าอักขระหัวข้อย่อย (เช่น •) ในผลลัพธ์เทอร์มินัลจะคงไว้หรือแปลงเป็นรายการ Markdown',
            bulletsAliases: ['รายการ', 'markdown', 'ขีด'],
            bulletsMarkdown: 'แปลงเป็นรายการ Markdown',
            bulletsPreserve: 'คงไว้อย่างเดิม',
            testerName: 'ลองดู',
            testerDesc: 'วางผลลัพธ์เทอร์มินัลเพื่อดูว่าจะถูกจัดระเบียบอย่างไร',
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
            commasName: 'จุลภาคและอัญประกาศ',
            commasDesc: 'เลือกตำแหน่งของจุลภาคที่อยู่ติดกับอัญประกาศคู่ปิด',
            commasAliases: ['จุลภาค', 'อัญประกาศ', 'คำพูด', 'เครื่องหมายวรรคตอน', 'รูปแบบ'],
            commasNone: 'ไม่เปลี่ยนแปลง',
            commasInside: 'จุลภาคอยู่ในอัญประกาศ',
            commasOutside: 'จุลภาคอยู่นอกอัญประกาศ',
            commasExampleSource: 'สถานะคือ "เสร็จแล้ว," ถัดไปคือ "รอดำเนินการ"',
            commasExampleOutside: 'สถานะคือ "เสร็จแล้ว", ถัดไปคือ "รอดำเนินการ"',
            invisibleName: 'จัดระเบียบ AI: อักขระที่มองไม่เห็น',
            invisibleDesc: 'ลบช่องว่างความกว้างศูนย์และเปลี่ยนช่องว่างไม่ตัดคำให้เป็นช่องว่างปกติ',
            invisibleAliases: [
                'ai',
                'chatgpt',
                'claude',
                'llm',
                'ขีด',
                'ขีดยาว',
                'ยัติภังค์',
                'unicode',
                'มองไม่เห็น',
                'nbsp',
                'การพิมพ์',
                'เครื่องหมายวรรคตอน',
                'ช่องว่าง'
            ],
            invisibleExampleStart: 'ผลลัพธ์คือ',
            invisibleExampleMiddle: 'OK',
            invisibleExampleEnd: ' แล้ว',
            invisibleExampleAfter: 'ผลลัพธ์คือ OK แล้ว',
            punctuationName: 'จัดระเบียบ AI: ขีดและอัญประกาศ',
            punctuationDesc: 'เปลี่ยนขีดยาวเป็นยัติภังค์ และอัญประกาศโค้งเป็นอัญประกาศตรง',
            punctuationAliases: [
                'ขีดยาว',
                'ขีดกลาง',
                'ยัติภังค์',
                'อัญประกาศ',
                'อัญประกาศโค้ง',
                'อะพอสทรอฟี',
                'เครื่องหมายวรรคตอน',
                'การพิมพ์'
            ],
            punctuationExampleBefore: '“ผลลัพธ์ — แม้ทุกอย่างจะขวางอยู่ — ออกมาสมบูรณ์แบบ”',
            punctuationExampleAfter: '"ผลลัพธ์ - แม้ทุกอย่างจะขวางอยู่ - ออกมาสมบูรณ์แบบ"'
        }
    },

    welcome: {
        title: 'ยินดีต้อนรับสู่ Better Paste',
        intro: [
            'Better Paste จะปรับเนื้อหาในคลิปบอร์ดขณะที่ถูกวางลงในโน้ต',
            'บันทึกรูปภาพที่ลิงก์ไว้เป็นไฟล์แนบในห้องนิรภัย ลบพารามิเตอร์ติดตามออกจากลิงก์ ต่อบรรทัดที่ถูกตัดในผลลัพธ์เทอร์มินัลกลับเข้าด้วยกัน และแทนที่อัญประกาศโค้งกับอักขระที่มองไม่เห็นด้วยตัวอักษรธรรมดา',
            'ปิดกฎแต่ละข้อแยกกันได้',
            'โน้ตแต่ละฉบับยกเว้นตัวเองทั้งหมดได้ด้วยคุณสมบัติ "better-paste: false" การตั้งค่าอยู่ที่ การตั้งค่า, Better Paste'
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
