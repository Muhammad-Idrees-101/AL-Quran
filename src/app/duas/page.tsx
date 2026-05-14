'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSettingsStore } from '@/stores/settingsStore';

// ─── Duas Data ───────────────────────────────────────────────
interface Dua {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  translation_ur: string;
  reference: string;
}

interface DuaCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  duas: Dua[];
}

const DUA_CATEGORIES: DuaCategory[] = [
  {
    id: 'morning',
    label: 'Morning (Sabah)',
    icon: '🌅',
    color: 'from-amber-900/30 to-orange-900/20 border-amber-500/20',
    duas: [
      {
        id: 'morning-1',
        title: 'Waking Up',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        transliteration: 'Alhamdu lillaahil-lathee ahyaanaa ba\'da maa amaatanaa wa-ilayhin-nushoor',
        translation: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.',
        translation_ur: 'تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں مارنے (نیند) کے بعد زندہ کیا اور اسی کی طرف اٹھ کر جانا ہے۔',
        reference: 'Bukhari 6312',
      },
      {
        id: 'morning-2',
        title: 'Morning Remembrance',
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
        transliteration: 'Asbahna wa-asbahal-mulku lillaah, walhamdu lillaah',
        translation: 'We have reached the morning and at this very time the sovereignty belongs to Allah, and all praise is for Allah.',
        translation_ur: 'ہم نے اور تمام بادشاہت نے اللہ کے لیے صبح کی، اور تمام تعریفیں اللہ کے لیے ہیں۔',
        reference: 'Muslim 2723',
      },
      {
        id: 'morning-3',
        title: 'Protection in the Morning',
        arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
        transliteration: 'Allaahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namootu wa ilaykan-nushoor',
        translation: 'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the Final Return.',
        translation_ur: 'اے اللہ! ہم نے تیری ہی مدد سے صبح کی اور تیری ہی مدد سے شام کی، تیرے ہی حکم سے ہم جیتے ہیں اور تیرے ہی حکم سے ہم مرتے ہیں، اور تیری ہی طرف لوٹ کر جانا ہے۔',
        reference: 'Tirmidhi 3391',
      },
      {
        id: 'morning-4',
        title: 'Knowledge, Provision & Deeds',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
        transliteration: "Allaahumma innee as'aluka 'ilman naafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan",
        translation: 'O Allah, I ask You for knowledge that is of benefit, a good provision, and deeds that will be accepted.',
        translation_ur: 'اے اللہ! میں تجھ سے نفع بخش علم، پاکیزہ رزق، اور قبول ہونے والے عمل کا سوال کرتا ہوں۔',
        reference: 'Ibn Majah 925',
      },
    ],
  },
  {
    id: 'evening',
    label: 'Evening (Masa\')',
    icon: '🌙',
    color: 'from-indigo-900/30 to-blue-900/20 border-indigo-500/20',
    duas: [
      {
        id: 'evening-1',
        title: 'Evening Remembrance',
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
        transliteration: 'Amsayna wa-amsal-mulku lillaah, walhamdu lillaah',
        translation: 'We have reached the evening and at this very time the sovereignty belongs to Allah, and all praise is for Allah.',
        translation_ur: 'ہم نے اور تمام بادشاہت نے اللہ کے لیے شام کی، اور تمام تعریفیں اللہ کے لیے ہیں۔',
        reference: 'Muslim 2723',
      },
      {
        id: 'evening-2',
        title: 'Seeking Refuge in the Evening',
        arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        transliteration: "A'udhu bikalimaatil-laahit-taammaati min sharri maa khalaq",
        translation: 'I seek refuge in the Perfect Words of Allah from the evil of what He has created.',
        translation_ur: 'میں اللہ کے مکمل کلمات کی پناہ مانگتا ہوں، ہر اس چیز کے شر سے جو اس نے پیدا کی ہے۔',
        reference: 'Muslim 2709',
      },
      {
        id: 'evening-3',
        title: 'Seeking Well-being',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
        transliteration: "Allaahumma innee as'alukal-'aafiyata fid-dunyaa wal-aakhirah",
        translation: 'O Allah, I ask You for well-being in this world and the Hereafter.',
        translation_ur: 'اے اللہ! میں تجھ سے دنیا اور آخرت میں عافیت (سلامتی) مانگتا ہوں۔',
        reference: 'Abu Dawud 5074',
      },
    ],
  },
  {
    id: 'prayer',
    label: 'Prayer (Salah)',
    icon: '🕌',
    color: 'from-emerald-900/30 to-teal-900/20 border-emerald-500/20',
    duas: [
      {
        id: 'prayer-1',
        title: 'Before Salah (Iftitah)',
        arabic: 'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ',
        transliteration: 'Allaahumma baa\'id bayni wa bayna khataayaaya kamaa baa\'adta baynal-mashriqi wal-maghrib',
        translation: 'O Allah, distance me from my sins as You have distanced the East from the West.',
        translation_ur: 'اے اللہ! میرے اور میرے گناہوں کے درمیان اتنی دوری کر دے جتنی تو نے مشرق اور مغرب کے درمیان کی ہے۔',
        reference: 'Bukhari 744, Muslim 598',
      },
      {
        id: 'prayer-2',
        title: 'Ruku (Bowing)',
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
        transliteration: 'Subhaana Rabbiyal-Atheem',
        translation: 'Glory be to my Lord, the Most Great.',
        translation_ur: 'پاک ہے میرا رب، بڑی عظمت والا۔',
        reference: 'Abu Dawud 871',
      },
      {
        id: 'prayer-3',
        title: 'Sujood (Prostration)',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        transliteration: "Subhaana Rabbiyal-A'laa",
        translation: 'Glory be to my Lord, the Most High.',
        translation_ur: 'پاک ہے میرا رب، سب سے اعلیٰ۔',
        reference: 'Abu Dawud 871',
      },
      {
        id: 'prayer-4',
        title: 'Between Two Sajdahs',
        arabic: 'رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي',
        transliteration: 'Rabbighfir lee, Rabbighfir lee',
        translation: 'My Lord, forgive me. My Lord, forgive me.',
        translation_ur: 'اے میرے رب مجھے بخش دے، اے میرے رب مجھے بخش دے۔',
        reference: 'Ibn Majah 897',
      },
    ],
  },
  {
    id: 'food',
    label: 'Food & Eating',
    icon: '🍽️',
    color: 'from-rose-900/30 to-pink-900/20 border-rose-500/20',
    duas: [
      {
        id: 'food-1',
        title: 'Before Eating',
        arabic: 'بِسْمِ اللَّهِ',
        transliteration: 'Bismillaah',
        translation: 'In the name of Allah.',
        translation_ur: 'اللہ کے نام سے۔',
        reference: 'Abu Dawud 3767',
      },
      {
        id: 'food-2',
        title: 'After Eating',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
        transliteration: "Alhamdu lillaahil-lathee at'amanee haathaa wa razaqaneehi min ghayri hawlim-minnee wa laa quwwah",
        translation: 'Praise is to Allah Who has given me this food and provided it for me without any strength or power on my part.',
        translation_ur: 'تمام تعریفیں اللہ کے لیے ہیں جس نے مجھے یہ کھلایا اور مجھے یہ رزق دیا، میری کسی طاقت اور قوت کے بغیر۔',
        reference: 'Abu Dawud 4023',
      },
      {
        id: 'food-3',
        title: 'If You Forget Bismillah',
        arabic: 'بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ',
        transliteration: 'Bismillaahi awwalahu wa aakhirahu',
        translation: 'In the Name of Allah, at the beginning and at the end.',
        translation_ur: 'اللہ کے نام کے ساتھ اس کے شروع اور آخر میں۔',
        reference: 'Abu Dawud 3767',
      },
    ],
  },
  {
    id: 'travel',
    label: 'Travel (Safar)',
    icon: '✈️',
    color: 'from-sky-900/30 to-cyan-900/20 border-sky-500/20',
    duas: [
      {
        id: 'travel-1',
        title: 'Leaving Home',
        arabic: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
        transliteration: "Bismillaah, tawakkaltu 'alal-laah, wa laa hawla wa laa quwwata illaa billaah",
        translation: 'In the name of Allah, I place my trust in Allah and there is no might nor power except with Allah.',
        translation_ur: 'اللہ کے نام سے، میں نے اللہ پر توکل کیا، اور گناہوں سے بچنے کی طاقت اور نیکی کرنے کی قوت اللہ ہی کی توفیق سے ہے۔',
        reference: 'Abu Dawud 5095',
      },
      {
        id: 'travel-2',
        title: 'Boarding a Vehicle',
        arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنقَلِبُونَ',
        transliteration: 'Subhaanal-lathee sakhkhara lanaa haathaa wa maa kunnaa lahoo muqrineen. Wa innaa ilaa rabbinaa lamunqaliboon.',
        translation: 'Glory is to Him Who has subjected this to us and we could not have had it subjugated. And indeed, to our Lord we will return.',
        translation_ur: 'پاک ہے وہ ذات جس نے اس (سواری) کو ہمارے مسخر کر دیا حالانکہ ہم اسے قابو میں لانے والے نہ تھے۔ اور بے شک ہم اپنے رب ہی کی طرف لوٹ کر جانے والے ہیں۔',
        reference: 'Quran 43:13-14',
      },
      {
        id: 'travel-3',
        title: 'Returning from Travel',
        arabic: 'آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ',
        transliteration: 'Aayiboona, taa\'iboona, \'aabidoona, lirabbinaa haamidoon',
        translation: 'We return, repenting, worshipping and praising our Lord.',
        translation_ur: 'ہم لوٹنے والے ہیں، توبہ کرنے والے ہیں، عبادت کرنے والے ہیں اور اپنے رب کی تعریف کرنے والے ہیں۔',
        reference: 'Muslim 1342',
      },
    ],
  },
  {
    id: 'family',
    label: 'Parents & Family',
    icon: '👨‍👩‍👧‍👦',
    color: 'from-pink-900/30 to-fuchsia-900/20 border-pink-500/20',
    duas: [
      {
        id: 'family-1',
        title: 'Dua for Parents',
        arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
        transliteration: "Rabbirhamhumaa kamaa rabbayaanee sagheeraa",
        translation: 'My Lord, have mercy upon them as they brought me up [when I was] small.',
        translation_ur: 'اے میرے رب! ان دونوں پر رحم فرما جیسا کہ انہوں نے بچپن میں مجھے پالا۔',
        reference: 'Quran 17:24',
      },
      {
        id: 'family-2',
        title: 'For Righteous Spouse & Children',
        arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
        transliteration: "Rabbanaa hab lanaa min azwaajinaa wa thurriyyaatinaa qurrata a'yunin waj'alnaa lilmuttaqeena imaamaa",
        translation: 'Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.',
        translation_ur: 'اے ہمارے رب! ہمیں ہماری بیویوں اور ہماری اولاد کی طرف سے آنکھوں کی ٹھنڈک عطا فرما اور ہمیں پرہیزگاروں کا امام بنا۔',
        reference: 'Quran 25:74',
      },
    ],
  },
  {
    id: 'forgiveness',
    label: 'Forgiveness (Istighfar)',
    icon: '💧',
    color: 'from-violet-900/30 to-purple-900/20 border-violet-500/20',
    duas: [
      {
        id: 'forgiveness-1',
        title: 'Sayyid al-Istighfar (Master Dua)',
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
        transliteration: "Allaahumma anta rabbee laa ilaaha illaa ant, khalaqtanee wa ana 'abduka wa ana 'alaa 'ahdika wa wa'dika mastata't, a'oodhu bika min sharri maa sana't, aboo'u laka bini'matika 'alayya wa aboo'u bidhambee faghfir lee fa'innahoo laa yaghfirudh-dhunooba illaa ant",
        translation: 'O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant, following Your covenant and Your promise as best I can. I take refuge in You from the evil of what I have done. I acknowledge Your blessing upon me and I acknowledge my sin, so forgive me, for none forgives sins but You.',
        translation_ur: 'اے اللہ! تو ہی میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں، اور میں اپنی طاقت کے مطابق تیرے عہد اور وعدے پر قائم ہوں۔ میں اپنے کیے کے شر سے تیری پناہ مانگتا ہوں، میں اپنے اوپر تیری نعمتوں کا اقرار کرتا ہوں اور اپنے گناہوں کا اعتراف کرتا ہوں، پس مجھے بخش دے، کیونکہ تیرے سوا کوئی گناہوں کو نہیں بخش سکتا۔',
        reference: 'Bukhari 6306',
      },
      {
        id: 'forgiveness-2',
        title: 'Simple Forgiveness',
        arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
        transliteration: "Astaghfirul-laahal-'atheemul-lathee laa ilaaha illaa huwal-hayyul-qayyoomu wa atoobu ilayh",
        translation: 'I seek forgiveness from Allah, the Magnificent, the One besides Whom there is no other god, the Ever-Living, the All-Sustaining, and I turn to Him in repentance.',
        translation_ur: 'میں اللہِ عظیم سے بخشش مانگتا ہوں جس کے سوا کوئی معبود نہیں، وہ زندہ اور قائم رکھنے والا ہے، اور میں اسی کی طرف توبہ کرتا ہوں۔',
        reference: 'Abu Dawud 1517',
      },
    ],
  },
  {
    id: 'anxiety',
    label: 'Anxiety & Distress',
    icon: '🌊',
    color: 'from-teal-900/30 to-emerald-900/20 border-teal-500/20',
    duas: [
      {
        id: 'anxiety-1',
        title: 'Relief from Distress',
        arabic: 'اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ',
        transliteration: "Allaahumma innee 'abduka, ibnu 'abdika, ibnu amatika, naasiyatee biyadika, maadin fiyya hukmuka, 'adlun fiyya qadaa'uk",
        translation: 'O Allah, I am Your servant, son of Your servant, son of Your female servant, my forelock is in Your hand, Your command over me is forever executed and Your decree over me is just.',
        translation_ur: 'اے اللہ! بے شک میں تیرا بندہ ہوں، تیرے بندے کا بیٹا ہوں، تیری بندی کا بیٹا ہوں، میری پیشانی تیرے ہاتھ میں ہے، مجھ پر تیرا حکم جاری ہے، اور میرے حق میں تیرا فیصلہ سراپا عدل ہے۔',
        reference: 'Ahmad 3528',
      },
      {
        id: 'anxiety-2',
        title: 'Dua of Yunus (AS)',
        arabic: 'لَا إِلَهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
        transliteration: "Laa ilaaha illaa anta subhaanaka innee kuntu minath-thaalimeen",
        translation: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
        translation_ur: 'تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ہی ظالموں میں سے تھا۔',
        reference: 'Quran 21:87',
      },
    ],
  },
  {
    id: 'sleep',
    label: 'Sleep & Bed',
    icon: '😴',
    color: 'from-slate-800/50 to-gray-900/30 border-slate-500/20',
    duas: [
      {
        id: 'sleep-1',
        title: 'Before Sleeping',
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        transliteration: 'Bismika Allaahumma amootu wa ahyaa',
        translation: 'In Your name, O Allah, I die and I live.',
        translation_ur: 'اے اللہ! تیرے ہی نام کے ساتھ میں مرتا (سوتا) ہوں اور جیتا (جاگتا) ہوں۔',
        reference: 'Bukhari 6324',
      },
      {
        id: 'sleep-2',
        title: 'Ayat al-Kursi before Sleep',
        arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
        transliteration: "Allahu laa ilaaha illaa huwal-hayyul-qayyoom. Laa ta'khudhuhu sinatun wa laa nawm...",
        translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep...',
        translation_ur: 'اللہ، اس کے سوا کوئی معبود نہیں، وہ ہمیشہ زندہ اور قائم رہنے والا ہے۔ اسے نہ اونگھ آتی ہے اور نہ نیند...',
        reference: 'Quran 2:255 — recite before sleep for protection all night (Bukhari 2311)',
      },
    ],
  },
];

// ─── Page Component ──────────────────────────────────────────
export default function DuasPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedDua, setExpandedDua] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const { readingLanguage } = useSettingsStore();

  const activeData = DUA_CATEGORIES.find(c => c.id === activeCategory);

  const filteredCategories = DUA_CATEGORIES.filter(cat =>
    searchQuery === '' ||
    cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.duas.some(d =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.translation.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const copyArabic = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 min-[1200px]:top-20 z-20 theme-sticky-header backdrop-blur-xl border-b border-white/[0.06] px-4 md:px-8 py-4"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div>
            <button onClick={() => router.push('/')} className="text-xs text-gray-500 hover:text-white mb-1 flex items-center gap-1">← Back</button>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              💧 Duas Collection
            </h1>
            <p className="text-xs text-gray-400">Authentic supplications from Quran & Sunnah</p>
          </div>
          <div className="md:ml-auto">
            <input
              type="text"
              placeholder="Search duas..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full md:w-64 bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-islamic-gold/50"
            />
          </div>
        </div>
      </motion.section>

      <div className="flex-1 px-4 md:px-8 py-8">
        {/* Category Chips */}
        <div className="flex gap-2 flex-wrap mb-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
              activeCategory === null
                ? 'bg-islamic-gold/15 text-islamic-gold border-islamic-gold/25'
                : 'bg-white/[0.04] text-gray-400 border-transparent hover:bg-white/[0.08]'
            }`}
          >
            ✨ All Categories
          </motion.button>
          {DUA_CATEGORIES.map(cat => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                activeCategory === cat.id
                  ? 'bg-islamic-gold/15 text-islamic-gold border-islamic-gold/25'
                  : 'bg-white/[0.04] text-gray-400 border-transparent hover:bg-white/[0.08]'
              }`}
            >
              {cat.icon} {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Category + Duas Grid */}
        <div className="space-y-8">
          {(activeCategory ? DUA_CATEGORIES.filter(c => c.id === activeCategory) : filteredCategories).map((cat, ci) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.05 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{cat.icon}</span>
                <h2 className="text-lg font-bold text-white">{cat.label}</h2>
                <span className="text-xs text-gray-600 bg-white/[0.04] px-2 py-0.5 rounded-full">
                  {cat.duas.length} duas
                </span>
              </div>

              {/* Duas List */}
              <div className="space-y-3">
                {cat.duas.map((dua, di) => (
                  <motion.div
                    key={dua.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: di * 0.04 }}
                    className={`rounded-2xl border bg-gradient-to-br ${cat.color} overflow-hidden`}
                  >
                    {/* Dua Header */}
                    <div
                      onClick={() => setExpandedDua(expandedDua === dua.id ? null : dua.id)}
                      className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-300">
                          {di + 1}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white">{dua.title}</h3>
                          <p className="text-[10px] text-gray-500">{dua.reference}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={e => { e.stopPropagation(); copyArabic(dua.arabic, dua.id); }}
                          className="text-[10px] px-2 py-1 rounded-lg bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                          {copied === dua.id ? '✓ Copied' : '📋 Copy'}
                        </button>
                        <motion.span
                          animate={{ rotate: expandedDua === dua.id ? 180 : 0 }}
                          className="text-gray-400 text-sm"
                        >▾</motion.span>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {expandedDua === dua.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-5 space-y-4 border-t border-white/[0.06]">
                            {/* Arabic */}
                            <div className="pt-4">
                              <p className="font-arabic text-2xl md:text-3xl text-islamic-gold leading-[2.2] text-right" dir="rtl">
                                {dua.arabic}
                              </p>
                            </div>
                            {/* Transliteration */}
                            <div className="bg-white/[0.04] rounded-xl p-3">
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Transliteration</p>
                              <p className="text-sm text-gray-300 italic leading-6">{dua.transliteration}</p>
                            </div>
                            {/* Translation */}
                            <div className="bg-white/[0.04] rounded-xl p-3">
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Meaning</p>
                              <p className={`text-sm text-gray-200 leading-6 ${readingLanguage === 'ur' ? 'font-arabic text-right' : ''}`}>
                                "{readingLanguage === 'ur' ? dua.translation_ur : dua.translation}"
                              </p>
                            </div>
                            {/* Source */}
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-islamic-gold/60">📖 Source:</span>
                              <span className="text-[10px] text-gray-500">{dua.reference}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🤲</p>
            <p className="text-gray-400">No duas found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
