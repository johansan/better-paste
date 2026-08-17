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
        cleanTerminal: 'จัดระเบียบผลลัพธ์เทอร์มินัล',
        commasInside: 'ย้ายจุลภาคเข้าไปในอัญประกาศ',
        commasOutside: 'ย้ายจุลภาคออกนอกอัญประกาศ',
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
                'ใช้กฎกับการวางทุกครั้ง เมื่อปิดไว้ กฎจะทำงานเฉพาะผ่านคำสั่งของ Better Paste โน้ตแต่ละฉบับยกเว้นตัวเองได้ด้วยคุณสมบัติ "{property}: false" หรือเลือกให้จัดระเบียบได้ด้วย "{property}: true"',
            autoCleanAliases: ['อัตโนมัติ', 'เปิด', 'ปิด', 'โน้ต', 'ยกเว้น', 'คุณสมบัติ', 'frontmatter'],
            notePropertyName: 'คุณสมบัติของโน้ต',
            notePropertyDesc: 'คุณสมบัติที่เปิดหรือปิด Better Paste สำหรับโน้ตแต่ละฉบับ',
            notePropertyAliases: ['โน้ต', 'คุณสมบัติ', 'frontmatter', 'ยกเว้น', 'ปิด', 'เปิด', 'bp']
        },

        images: {
            heading: 'รูปภาพ',
            savingName: 'บันทึกรูปภาพที่วางลงในห้องนิรภัย',
            savingDesc:
                'บันทึกรูปภาพที่วางลงในโฟลเดอร์ไฟล์แนบของคุณ และลิงก์ไปยังไฟล์ในเครื่องแทนที่อยู่เว็บ ครอบคลุมทั้ง "คัดลอกรูปภาพ" ของ Safari รูปภาพในเนื้อหาเว็บที่คัดลอกมา และที่อยู่รูปภาพที่วาง โดยค่าเริ่มต้นชื่อไฟล์มาจากที่อยู่:',
            savingAliases: ['ดาวน์โหลด', 'ไฟล์แนบ', 'safari', 'ภาพหน้าจอ', 'รูปภาพ', 'โฟลเดอร์', 'ชื่อไฟล์', 'ความกว้าง', 'ขนาด'],
            sizeChoiceName: 'ใช้ขนาดเมื่อวาง',
            sizeChoiceDesc: 'เพิ่มความกว้างให้ภาพฝังที่บันทึกทุกภาพ เช่น ![[photo.jpg|400]] คุณสมบัติความกว้างของโน้ตเองจะมีผลแทนค่านี้',
            sizeChoiceAliases: ['ขนาด', 'ความกว้าง', 'ขนาดภาพ', 'ปรับขนาด', 'ฝัง', '400'],
            sizeOptionsName: 'ตัวเลือกขนาด',
            sizeOptionsDesc: 'ความกว้างที่มีให้เลือกด้านบนและในกล่องโต้ตอบเมื่อวาง คั่นด้วยจุลภาค',
            classChoiceName: 'ใช้คลาส CSS เมื่อวาง',
            classChoiceDesc: 'เพิ่มคลาสให้ภาพฝังที่บันทึกทุกภาพ เช่น ![[photo.jpg#invert]] ธีมและสนิปเพ็ต CSS เป็นตัวกำหนดผลของคลาส',
            classChoiceAliases: ['css', 'คลาส', 'สนิปเพ็ต', 'invert', 'ธีม', 'ฟิลเตอร์', 'ฝัง'],
            classOptionsName: 'ตัวเลือกคลาส',
            classOptionsDesc: 'คลาสที่มีให้เลือกด้านบนและในกล่องโต้ตอบเมื่อวาง คั่นด้วยจุลภาค',
            choiceNone: 'ไม่ต้องทำอะไร',
            choiceAsk: 'ถามทุกครั้งที่วาง',
            nameFormatName: 'ชื่อไฟล์',
            nameFormatDesc: 'วิธีตั้งชื่อรูปภาพที่บันทึก',
            nameFormatSource: 'ใช้ชื่อจากต้นทาง',
            nameFormatCustom: 'รูปแบบกำหนดเอง',
            customName: 'รูปแบบกำหนดเอง',
            customDesc: 'ใช้ {{name}} แทนชื่อต้นทาง และรูปแบบวันที่ของ Moment เช่น YYYY-MM-DD',
            customMomentLink: 'รูปแบบ Moment',
            customExample: 'ตัวอย่าง: {value}',
            customAliases: ['ชื่อ', 'ชื่อไฟล์', 'วันที่', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'คุณสมบัติความกว้างรูปภาพ',
            sizePropertyDesc:
                'คุณสมบัติใน frontmatter ที่กำหนดความกว้างของรูปภาพที่วางลงในโน้ต เมื่อโน้ตมี "{property}: 400" รูปภาพที่วางจะกลายเป็น ![[photo.png|400]] เว้นว่างไว้เพื่อไม่ใส่ความกว้าง',
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
            removalsName: 'การลบพารามิเตอร์จากลิงก์',
            removalsDesc: 'พารามิเตอร์เพิ่มเติมเพื่อลบออกทุกที่หรือบนเว็บไซต์เฉพาะ',
            rulesCount: { other: '{count} รายการ' },
            builtInName: 'การลบที่มาพร้อมปลั๊กอิน',
            builtInDesc:
                'อัปเดตเมื่อ {date} ตัวกรองการติดตามที่ใช้กับทุกเว็บไซต์: {trackingCount} กฎเฉพาะเว็บไซต์: {siteCount} ลิงก์ที่มีลายเซ็นเข้ารหัสจะคงเดิมไม่เปลี่ยนแปลง',
            builtInButton: 'ดูรายการ',
            listName: 'รายการลบของคุณ',
            listDesc:
                'ลบพารามิเตอร์จากลิงก์ทั่วไปบนทุกเว็บไซต์โดยการป้อนชื่อพารามิเตอร์นั้นเพียงอย่างเดียว ตัวอย่างเช่น fbclid จะลบพารามิเตอร์ fbclid ทุกที่ที่ปรากฏ\n\nลบพารามิเตอร์เฉพาะบนเว็บไซต์เดียวด้วย "example.com | source, ref" วิธีนี้จะลบ source และ ref จาก example.com และโดเมนย่อยทั้งหมด ในขณะที่พารามิเตอร์อื่น ๆ ยังคงอยู่ เริ่มบรรทัดด้วย ! เพื่อปิดการลบที่มาพร้อมปลั๊กอินสำหรับเว็บไซต์นั้น ลิงก์ที่มีลายเซ็นเข้ารหัสจะคงเดิมไม่เปลี่ยนแปลงเสมอ',
            listAliases: ['โดเมน', 'พารามิเตอร์', 'ฟิลเตอร์', 'ลบ', 'youtube'],
            listInvalid: 'กฎการลบที่ไม่ถูกต้อง: {values}',
            suggestName: 'เสนอรายการลบของคุณ',
            suggestDesc: 'ตรวจสอบรายการของคุณบน betterpaste.md แล้วส่งมาเพื่อช่วยปรับปรุงการลบที่มาพร้อมปลั๊กอิน',
            suggestAliases: ['ร่วมสร้าง', 'เสนอ', 'แชร์', 'ส่ง', 'ฟิลเตอร์'],
            suggestButton: 'ตรวจสอบและส่ง',
            testerName: 'ลองดู',
            testerDesc: 'วางลิงก์เพื่อดูผลลัพธ์ที่จัดระเบียบแล้ว',
            testerLabel: 'ลิงก์ที่จะจัดระเบียบ',
            testerEmpty: 'ลิงก์ที่จัดระเบียบแล้วจะปรากฏที่นี่'
        },

        text: {
            heading: 'การประมวลผลข้อความ',
            trimName: 'ตัดช่องว่างรอบข้าง',
            trimDesc: 'ลบบรรทัดว่างและช่องว่างที่ต้นและท้ายข้อความที่วาง',
            trimAliases: ['ช่องว่าง', 'บรรทัดว่าง', 'เว้นวรรค', 'ขึ้นบรรทัดใหม่', 'ตัดขอบ'],
            invisibleName: 'อักขระที่มองไม่เห็น',
            invisibleDesc: 'ลบช่องว่างความกว้างศูนย์และเปลี่ยนช่องว่างไม่ตัดคำให้เป็นช่องว่างปกติ',
            invisibleAliases: ['ai', 'chatgpt', 'claude', 'llm', 'unicode', 'มองไม่เห็น', 'nbsp', 'ช่องว่าง'],
            invisibleExampleStart: 'ผลลัพธ์คือ',
            invisibleExampleMiddle: 'OK',
            invisibleExampleEnd: ' แล้ว',
            invisibleExampleAfter: 'ผลลัพธ์คือ OK แล้ว',
            quotesName: 'อัญประกาศ',
            quotesDesc: 'เปลี่ยนอัญประกาศโค้งและอะพอสทรอฟีเป็นอัญประกาศตรง',
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
            quotesExample: '“เสร็จแล้ว” เธอบอก',
            dashesName: 'เครื่องหมายขีด',
            dashesDesc: 'เปลี่ยนเอ็นแดชและเอ็มแดชเป็นยัติภังค์',
            dashesAliases: ['ขีด', 'แดช', 'ขีดยาว', 'ขีดกลาง', 'ยัติภังค์', 'เครื่องหมายวรรคตอน', 'การพิมพ์', 'ai'],
            dashesExample: 'ผลลัพธ์ — แม้จะมีอุปสรรค — ก็ออกมาดี'
        }
    },

    imageModal: {
        title: 'ตัวเลือกรูปภาพ',
        sizeName: 'ขนาด',
        className: 'คลาส CSS',
        none: 'ไม่ต้องทำอะไร',
        apply: 'นำไปใช้',
        cancel: 'ยกเลิก'
    },

    welcome: {
        title: 'ยินดีต้อนรับสู่ Better Paste',
        intro: [
            'คัดลอกรูปภาพจาก Safari ลงห้องนิรภัยได้โดยตรง วางลิงก์โดยไม่มีพารามิเตอร์ติดตาม ต่อบรรทัดที่ถูกตัดในผลลัพธ์เทอร์มินัล และทำความสะอาดข้อความจาก AI แค่วาง ที่เหลือ Better Paste จัดการให้',
            'เคล็ดลับก่อนเริ่ม: ตั้งค่า **วางโดยไม่ประมวลผล** เป็น `Cmd+Shift+V` (`Ctrl+Shift+V` บน Windows) เพื่อให้วางเนื้อหาในคลิปบอร์ดแบบเดิมได้ทุกเมื่อ',
            'กฎแต่ละข้อมีสวิตช์ของตัวเองใน การตั้งค่า, Better Paste และคุณสมบัติ `{property}: false` จะปิดปลั๊กอินสำหรับโน้ตนั้น'
        ],
        startButton: 'เริ่มใช้งาน'
    },

    overlap: {
        title: 'Better Paste: ปลั๊กอินที่ทำงานซ้ำซ้อน',
        thanks: 'ขอบคุณที่ติดตั้งและใช้งาน Better Paste!',
        intro: {
            other: 'ตอนนี้คุณมีปลั๊กอินที่ทำงานแทบเหมือนกันติดตั้งอยู่ {count} ตัว โปรดปิดใช้งานหรือถอนการติดตั้งปลั๊กอินต่อไปนี้:'
        },
        outro: 'ปิดใช้งานได้ที่ การตั้งค่า > ปลั๊กอินโดยชุมชน',
        dontRemind: 'ไม่ต้องเตือนอีก',
        button: 'เข้าใจแล้ว'
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
