import cover1 from "@/assets/cover-1.jpg";
import cover2 from "@/assets/cover-2.jpg";
import cover3 from "@/assets/cover-3.jpg";
import cover4 from "@/assets/cover-4.jpg";
import author1 from "@/assets/author-1.jpg";
import author2 from "@/assets/author-2.jpg";
import author3 from "@/assets/author-3.jpg";

export type Author = {
  slug: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  longBio: string;
  stats: { posts: number; reads: string; avgMinutes: number };
};

export type Article = {
  slug: string;
  title: string;
  subtitle: string;
  cover: string;
  category: string;
  categorySlug: string;
  kind: "Araştırma" | "Kolektif" | "Deneme";
  author: Author;
  publishedAt: string;
  readMinutes: number;
  reads: number;
  excerpt: string;
  body: string[];
  tags: string[];
  toc: { id: string; label: string }[];
};

export const authors: Author[] = [
  {
    slug: "elif-yildirim",
    name: "Elif Yıldırım",
    title: "Editör · Deneme yazarı",
    avatar: author1,
    bio: "Şehirler, hafıza ve mahremiyet üzerine yazıyor.",
    longBio:
      "Elif Yıldırım, on yıldır uzun form deneme ve şehir kültürü üzerine yazıyor. İstanbul, Lizbon ve Tiflis'te yaşadı; üç kitabı yayımlandı. Kelimelerin ağırlığını taşımayı seven, yavaş okumayı savunan bir yazar.",
    stats: { posts: 38, reads: "412K", avgMinutes: 12 },
  },
  {
    slug: "kerem-aksoy",
    name: "Kerem Aksoy",
    title: "Araştırmacı · Felsefe",
    avatar: author2,
    bio: "Dikkat, zaman ve teknoloji felsefesi üzerine çalışıyor.",
    longBio:
      "Kerem Aksoy bir akademisyen ve denemeci. Çağdaş dikkat ekonomisi, dijital sessizlik ve zaman algısı üzerine kitapları ve makaleleri var. ODTÜ Felsefe bölümünde ders veriyor.",
    stats: { posts: 24, reads: "298K", avgMinutes: 18 },
  },
  {
    slug: "deniz-arslan",
    name: "Deniz Arslan",
    title: "Yazar · Kolektif anlatıcı",
    avatar: author3,
    bio: "Aile, miras ve göç üzerine kişisel anlatılar.",
    longBio:
      "Deniz Arslan kişisel deneyim ve sözlü tarih arasında dolaşan kısa anlatılar yazıyor. İlk kitabı 'Yaz Sonu Mektupları' 2023'te yayımlandı.",
    stats: { posts: 19, reads: "187K", avgMinutes: 9 },
  },
  {
    slug: "selin-kara",
    name: "Selin Kara",
    title: "Gazeteci · Kültür",
    avatar: author1,
    bio: "Sinema, müzik ve görsel kültür üzerine eleştiriler.",
    longBio:
      "Selin Kara on iki yıldır kültür gazeteciliği yapıyor. Cannes, Berlinale ve Venedik festivallerinden düzenli yazıyor; iki film kitabı yayımladı.",
    stats: { posts: 31, reads: "356K", avgMinutes: 10 },
  },
  {
    slug: "mert-ozdemir",
    name: "Mert Özdemir",
    title: "Mimar · Yazar",
    avatar: author2,
    bio: "Mekan, ışık ve sessizlik üzerine düşünüyor.",
    longBio:
      "Mert Özdemir İstanbul ve Tokyo'da çalışan bir mimar. Ando, Zumthor ve Sejima üzerine denemeleri çeşitli dergilerde yayımlandı; 'Boş Oda' adlı kitabın yazarı.",
    stats: { posts: 14, reads: "142K", avgMinutes: 14 },
  },
  {
    slug: "ayse-tekin",
    name: "Ayşe Tekin",
    title: "Sosyolog · Araştırmacı",
    avatar: author3,
    bio: "Kentsel eşitsizlik, emek ve gündelik hayat.",
    longBio:
      "Ayşe Tekin Boğaziçi Üniversitesi'nde sosyoloji doktorası yaptı. Kentsel emek, kadın çalışmaları ve mahalle araştırmaları üzerine üç kitabı var.",
    stats: { posts: 22, reads: "264K", avgMinutes: 19 },
  },
  {
    slug: "can-demir",
    name: "Can Demir",
    title: "Şair · Editör",
    avatar: author2,
    bio: "Şiir, çeviri ve klasik edebiyat üzerine yazıyor.",
    longBio:
      "Can Demir dört şiir kitabı yayımladı, Rilke ve Celan çevirileri yaptı. YKY'de editör olarak çalıştı, şimdi bağımsız yazıyor.",
    stats: { posts: 17, reads: "168K", avgMinutes: 8 },
  },
  {
    slug: "leyla-bahar",
    name: "Leyla Bahar",
    title: "Bilim yazarı",
    avatar: author1,
    bio: "Beyin, uyku ve davranış bilimleri üzerine yazıyor.",
    longBio:
      "Leyla Bahar nörobilim doktoralı bir bilim iletişimcisi. New Scientist Türkiye'de düzenli yazdı; 'Uykunun Grameri' kitabının yazarı.",
    stats: { posts: 26, reads: "318K", avgMinutes: 13 },
  },
  {
    slug: "okan-firat",
    name: "Okan Fırat",
    title: "Politika analisti",
    avatar: author2,
    bio: "İklim, enerji ve siyaset kesişimi üzerine.",
    longBio:
      "Okan Fırat Brüksel merkezli bir iklim politikası analisti. AB Yeşil Mutabakatı üzerine raporlar hazırlıyor; çeşitli düşünce kuruluşlarına danışmanlık yapıyor.",
    stats: { posts: 11, reads: "98K", avgMinutes: 16 },
  },
];

export const categories = [
  { slug: "arastirmalar", name: "Araştırmalar", description: "Kaynaklara dayalı, derinlemesine incelemeler." },
  { slug: "kolektif", name: "Kolektif", description: "Kişisel deneyim ve gözlem üzerine yazılar." },
  { slug: "sehir", name: "Şehir", description: "Mekânlar, sokaklar ve gündelik hayatın grameri." },
  { slug: "dusunce", name: "Düşünce", description: "Felsefe, etik ve çağdaş tartışmalar." },
  { slug: "edebiyat", name: "Edebiyat", description: "Roman, şiir, deneme ve okuma kültürü." },
  { slug: "sanat", name: "Sanat", description: "Sinema, müzik, mimari ve görsel kültür." },
  { slug: "bilim", name: "Bilim", description: "Beyin, doğa ve insan üzerine bilimsel yazılar." },
  { slug: "politika", name: "Politika", description: "İklim, ekonomi ve toplumsal mesele yazıları." },
];

export type Tag = { slug: string; name: string };

export const tags: Tag[] = [
  { slug: "sehir", name: "şehir" },
  { slug: "hafiza", name: "hafıza" },
  { slug: "yavaslik", name: "yavaşlık" },
  { slug: "mimari", name: "mimari" },
  { slug: "isik", name: "ışık" },
  { slug: "minimalizm", name: "minimalizm" },
  { slug: "felsefe", name: "felsefe" },
  { slug: "dikkat", name: "dikkat" },
  { slug: "teknoloji", name: "teknoloji" },
  { slug: "okuma", name: "okuma" },
  { slug: "kitap", name: "kitap" },
  { slug: "siir", name: "şiir" },
  { slug: "ceviri", name: "çeviri" },
  { slug: "aile", name: "aile" },
  { slug: "ev", name: "ev" },
  { slug: "goc", name: "göç" },
  { slug: "kisisel", name: "kişisel" },
  { slug: "sinema", name: "sinema" },
  { slug: "muzik", name: "müzik" },
  { slug: "sanat", name: "sanat" },
  { slug: "uyku", name: "uyku" },
  { slug: "beyin", name: "beyin" },
  { slug: "iklim", name: "iklim" },
  { slug: "politika", name: "politika" },
  { slug: "emek", name: "emek" },
  { slug: "kadin", name: "kadın" },
  { slug: "mahalle", name: "mahalle" },
];

export const findTag = (slug: string) => tags.find((t) => t.slug === slug);

const lorem = [
  "Şehir bazen bir yüzdür: tanıdıktır ama uzaktır. Sokakların kıvrımları, bir mektubun kıvrımları gibidir; içinde söylenmemiş şeyler taşır. Yürürken farkında olmadan hatırlarız — bir balkon, bir tabela, bir lambanın titreyişi. Hafıza burada bir mekan değil, bir hızdır.",
  "Hızını yavaşlattığında, şehir konuşmaya başlar. Ama bu konuşma cümlelerle değil, dokularla, kokularla, ışığın belli saatlerde belli duvarlara düşüşüyle olur. Bir kentte uzun süre kalmak, onun gramerini öğrenmek demektir. Bu gramer hiçbir kitapta yazmaz; sadece sabırla taşınır.",
  "Mahremiyet ise bu gramerin en kırılgan kuralıdır. Birinin penceresinden geçen ışığa bakmak ile içeri bakmak arasındaki ince çizgi, modern şehrin kaybettiği şeydir. Eskiden komşunun perdesi indiğinde anlardık — şimdi her şey daima yarı açık.",
  "Belki de bu yüzden uzun yazılar yazıyoruz. Bir cümlenin gerçekten yer kaplaması için ona zaman vermek gerekir. Hızlı tüketilen metinler, şehre hızlı bakışlar gibi: bir şey gördüğünü sanırsın ama hatırladığın hiçbir şey yoktur.",
  "Yavaşlamak bir tercih değil, bir disiplindir. Sayfayı çevirmek, satırı izlemek, paragrafın ortasında bir kelimenin önünde durmak — bunların hepsi öğrenilen şeyler. Bu sitenin amacı tam da bu: bir yer açmak, sessiz ve geniş.",
];

const buildBody = (intro: string) => [intro, ...lorem, ...lorem.slice(0, 3)];

export const articles: Article[] = [
  {
    slug: "sehrin-grameri",
    title: "Şehrin Grameri",
    subtitle: "Yavaş yürümek, hatırlamanın bir biçimidir.",
    cover: cover2,
    category: "Şehir",
    categorySlug: "sehir",
    kind: "Deneme",
    author: authors[0],
    publishedAt: "12 Nisan 2025",
    readMinutes: 11,
    reads: 12480,
    excerpt:
      "Bir kentte uzun süre kalmak, onun gramerini öğrenmek demektir. Bu gramer hiçbir kitapta yazmaz; sadece sabırla taşınır.",
    body: buildBody(
      "İstanbul'a ilk geldiğimde, sokakların bir dili olduğunu fark etmem aylar sürdü. Önce sadece gürültüyü duyuyordum; sonra ritmi, sonra ritmin içindeki sessizlikleri. Şehirler de insanlar gibi: tanışmak ile tanımak farklı şeyler.",
    ),
    tags: ["şehir", "hafıza", "yavaşlık"],
    toc: [
      { id: "i", label: "I — Tanışmak ve tanımak" },
      { id: "ii", label: "II — Mahremiyetin kıvrımları" },
      { id: "iii", label: "III — Yavaşlığın disiplini" },
    ],
  },
  {
    slug: "dikkat-ve-zaman",
    title: "Dikkat ve Zaman: Bir Yüzyılın Borcu",
    subtitle: "Dikkatimizi nereye verdiğimiz, kim olduğumuzu söyler.",
    cover: cover1,
    category: "Düşünce",
    categorySlug: "dusunce",
    kind: "Araştırma",
    author: authors[1],
    publishedAt: "8 Nisan 2025",
    readMinutes: 22,
    reads: 9840,
    excerpt:
      "Yirmi birinci yüzyıl bir dikkat krizi yüzyılı olarak hatırlanacak. Peki dikkat, kimin? Ve hangi zaman içinde?",
    body: buildBody(
      "Simone Weil dikkati, 'ruhun en saf cömertliği' olarak tanımlamıştı. Bugün dikkat, üzerinde savaşılan bir mülk haline geldi. Bu yazıda dikkatin felsefi, ekonomik ve gündelik anlamları arasında bir köprü kurmaya çalışacağım.",
    ),
    tags: ["felsefe", "dikkat", "teknoloji"],
    toc: [
      { id: "i", label: "I — Dikkat nedir" },
      { id: "ii", label: "II — Dikkat ekonomisi" },
      { id: "iii", label: "III — Bir geri kazanım siyaseti" },
      { id: "iv", label: "IV — Sonuç ve kaynakça" },
    ],
  },
  {
    slug: "annemin-mektuplari",
    title: "Annemin Mektupları",
    subtitle: "Bir bavul dolusu el yazısı, bir hayatın özeti.",
    cover: cover3,
    category: "Kolektif",
    categorySlug: "kolektif",
    kind: "Kolektif",
    author: authors[2],
    publishedAt: "5 Nisan 2025",
    readMinutes: 8,
    reads: 7320,
    excerpt:
      "Annem öldükten sonra, çatı arasında bir bavul buldum. İçinde otuz yıl boyunca bana yazıp göndermediği mektuplar vardı.",
    body: buildBody(
      "Annem öldükten sonra, çatı arasında bir bavul buldum. Açtığımda içeriden ince bir lavanta kokusu geldi — onun her şeyine sinmiş o tanıdık koku. Bavulun içinde otuz yıl boyunca bana yazıp hiç göndermediği mektuplar vardı.",
    ),
    tags: ["aile", "hafıza", "kişisel"],
    toc: [
      { id: "i", label: "I — Bavul" },
      { id: "ii", label: "II — Sessiz bir konuşma" },
    ],
  },
  {
    slug: "bos-bir-oda",
    title: "Boş Bir Oda",
    subtitle: "Mimaride sessizliğin yeri üzerine.",
    cover: cover4,
    category: "Şehir",
    categorySlug: "sehir",
    kind: "Deneme",
    author: authors[0],
    publishedAt: "30 Mart 2025",
    readMinutes: 9,
    reads: 5410,
    excerpt:
      "İçinde hiçbir şey olmayan bir oda bile bir şey söyler. Boşluk, mimarinin en az konuşulan dilidir.",
    body: buildBody(
      "Tadao Ando bir röportajda 'mimarlık ışığa bir kap açmaktır' demişti. Bir odanın boşluğu, içinden geçen ışığın şekliyle vardır. Bu yazıda boş odaların farklı kültürlerdeki anlamına bakacağız.",
    ),
    tags: ["mimari", "ışık", "minimalizm"],
    toc: [
      { id: "i", label: "I — Boşluk nedir" },
      { id: "ii", label: "II — Işığın kabı" },
    ],
  },
  {
    slug: "okumanin-bicimi",
    title: "Okumanın Yeni Bir Biçimi",
    subtitle: "Ekrandan kağıda ve geri — bir okuma denemesi.",
    cover: cover1,
    category: "Edebiyat",
    categorySlug: "edebiyat",
    kind: "Deneme",
    author: authors[1],
    publishedAt: "27 Mart 2025",
    readMinutes: 14,
    reads: 4280,
    excerpt:
      "Okuduğumuz yer, okuduğumuz şeyin parçasıdır. Sayfanın dokusu, kitabın anlamını taşır.",
    body: buildBody(
      "Bir kitabı ekrandan okumakla kağıttan okumak farklı şeylerdir. Bu fark sadece nostalji değildir; nörolojik, fiziksel ve duygusal katmanları olan bir farktır.",
    ),
    tags: ["okuma", "kitap", "dikkat"],
    toc: [
      { id: "i", label: "I — İki yüzey" },
      { id: "ii", label: "II — Bedenin okuması" },
    ],
  },
  {
    slug: "tasinmanin-agirligi",
    title: "Taşınmanın Ağırlığı",
    subtitle: "Bir evden bir eve — bir hayattan bir hayata.",
    cover: cover2,
    category: "Kolektif",
    categorySlug: "kolektif",
    kind: "Kolektif",
    author: authors[2],
    publishedAt: "22 Mart 2025",
    readMinutes: 7,
    reads: 3960,
    excerpt:
      "Eşyalarımız bizi tanır. Onları bir yerden bir yere taşımak, kendimizi yeniden tanıtmak gibidir.",
    body: buildBody(
      "Üç yılda dört kez taşındım. Her seferinde bir şeyler arkamda bıraktım — kitap, lamba, bir mektup. Geriye kalanlar ise zamanla daha ağır oldu, daha kıymetli oldu.",
    ),
    tags: ["aile", "ev", "göç"],
    toc: [{ id: "i", label: "I — Eşyalar" }],
  },
  {
    slug: "ando-ve-isigin-kabi",
    title: "Ando ve Işığın Kabı",
    subtitle: "Tadao Ando'nun mimarisinde sessizliğin mimarisi.",
    cover: cover4,
    category: "Sanat",
    categorySlug: "sanat",
    kind: "Araştırma",
    author: authors[4],
    publishedAt: "20 Mart 2025",
    readMinutes: 16,
    reads: 6120,
    excerpt:
      "Ando için beton bir yüzey değil, ışığı tutan bir kaptır. Naoshima'daki müzelerde bu kabın nasıl çalıştığını izleyelim.",
    body: buildBody(
      "Naoshima'ya ilk gittiğimde Tadao Ando'nun beton duvarlarının soğuk değil, sıcak olduğunu fark ettim. Bu sıcaklık, ışığın o yüzeylere düşüş biçiminden geliyordu.",
    ),
    tags: ["mimari", "ışık", "sanat"],
    toc: [
      { id: "i", label: "I — Naoshima notları" },
      { id: "ii", label: "II — Beton ve ışık" },
      { id: "iii", label: "III — Kabın geometrisi" },
    ],
  },
  {
    slug: "siiri-cevirmek",
    title: "Şiiri Çevirmek: İmkansızın Sanatı",
    subtitle: "Celan'ı Türkçeye taşımak — kelimelerin ardındaki sessizlik.",
    cover: cover1,
    category: "Edebiyat",
    categorySlug: "edebiyat",
    kind: "Deneme",
    author: authors[6],
    publishedAt: "18 Mart 2025",
    readMinutes: 12,
    reads: 4870,
    excerpt:
      "Bir şiiri çevirmek, başka bir dilde aynı sessizliği kurmaktır. Paul Celan'ın 'Atemwende'si üzerine notlar.",
    body: buildBody(
      "Çeviri, ihanetin en zarif biçimidir derler. Şiir çevirmek ise bu ihaneti her satırda yeniden işlemektir. Celan'la karşılaşmak, dilin sınırına gelmektir.",
    ),
    tags: ["şiir", "çeviri", "kitap"],
    toc: [
      { id: "i", label: "I — Atemwende" },
      { id: "ii", label: "II — Sessizliğin grameri" },
    ],
  },
  {
    slug: "uykunun-grameri",
    title: "Uykunun Grameri",
    subtitle: "Beynimiz uyurken ne yapar — ve neyi unutur?",
    cover: cover3,
    category: "Bilim",
    categorySlug: "bilim",
    kind: "Araştırma",
    author: authors[8],
    publishedAt: "15 Mart 2025",
    readMinutes: 19,
    reads: 11240,
    excerpt:
      "Uyku bir dinlenme değil, bir yazma sürecidir. REM evrelerinde beyin gün boyu yaşadıklarımızı yeniden düzenler.",
    body: buildBody(
      "Uyumak basit görünür ama beyin için en aktif zamanlardan biridir. Bu yazıda son on yılın uyku araştırmalarına bir yolculuk yapacağız: REM, hafıza pekiştirme, glymphatic sistem.",
    ),
    tags: ["uyku", "beyin", "dikkat"],
    toc: [
      { id: "i", label: "I — Uyku evreleri" },
      { id: "ii", label: "II — REM ve hafıza" },
      { id: "iii", label: "III — Modern uykusuzluk" },
      { id: "iv", label: "IV — Kaynakça" },
    ],
  },
  {
    slug: "iklim-politikasi-2030",
    title: "İklim Politikası 2030: Yeşil Mutabakatın Cesareti",
    subtitle: "Avrupa'nın iklim ajandasını yeniden okumak.",
    cover: cover2,
    category: "Politika",
    categorySlug: "politika",
    kind: "Araştırma",
    author: authors[8],
    publishedAt: "12 Mart 2025",
    readMinutes: 24,
    reads: 5430,
    excerpt:
      "AB Yeşil Mutabakatı 2030 hedeflerine ulaşabilecek mi? Politika ile teknolojinin kesişiminde bir analiz.",
    body: buildBody(
      "İklim politikası bir teknik mesele değil, derin bir kültürel meseledir. Bu yazıda 2030 hedeflerini siyasi ekonomi penceresinden okumaya çalışacağım.",
    ),
    tags: ["iklim", "politika"],
    toc: [
      { id: "i", label: "I — Yeşil Mutabakat'a kısa bakış" },
      { id: "ii", label: "II — Sanayi politikası" },
      { id: "iii", label: "III — Adil geçiş" },
      { id: "iv", label: "IV — Sonuç" },
    ],
  },
  {
    slug: "mahallenin-sessiz-emegi",
    title: "Mahallenin Sessiz Emeği",
    subtitle: "Görünmeyen kadın emeği üzerine bir saha çalışması.",
    cover: cover3,
    category: "Politika",
    categorySlug: "politika",
    kind: "Araştırma",
    author: authors[6],
    publishedAt: "9 Mart 2025",
    readMinutes: 18,
    reads: 4720,
    excerpt:
      "İstanbul'un üç mahallesinde altı ay süren bir araştırmadan notlar: bakım emeği, komşuluk ve dayanışma.",
    body: buildBody(
      "Bir mahallenin gerçek ekonomisi, hiç para görmeyen ilişkilerdir. Bakım, komşuluk, ortak çocuk büyütme — bunlar görünmez ama ağır emeklerdir.",
    ),
    tags: ["emek", "kadın", "mahalle", "şehir"],
    toc: [
      { id: "i", label: "I — Saha notu" },
      { id: "ii", label: "II — Görünmez ekonomi" },
      { id: "iii", label: "III — Politik sonuçlar" },
    ],
  },
  {
    slug: "sinemada-yavaslik",
    title: "Sinemada Yavaşlığın İade-i İtibarı",
    subtitle: "Tarr, Tsai ve uzun planın felsefesi.",
    cover: cover1,
    category: "Sanat",
    categorySlug: "sanat",
    kind: "Deneme",
    author: authors[3],
    publishedAt: "6 Mart 2025",
    readMinutes: 13,
    reads: 6210,
    excerpt:
      "Béla Tarr'ın yedi dakikalık planları neden bu kadar dayanılmaz, neden bu kadar güzel?",
    body: buildBody(
      "Sinemanın hızı, dikkat ekonomisinin hızıdır. Béla Tarr ve Tsai Ming-liang gibi yönetmenler bu hıza karşı sessiz bir direniş örgütler.",
    ),
    tags: ["sinema", "sanat", "yavaşlık"],
    toc: [
      { id: "i", label: "I — Uzun plan" },
      { id: "ii", label: "II — Zamanın dokusu" },
    ],
  },
  {
    slug: "kitapcilarin-sessiz-direnisi",
    title: "Kitapçıların Sessiz Direnişi",
    subtitle: "Bağımsız kitapçılar nasıl ayakta kalıyor?",
    cover: cover4,
    category: "Edebiyat",
    categorySlug: "edebiyat",
    kind: "Kolektif",
    author: authors[3],
    publishedAt: "3 Mart 2025",
    readMinutes: 9,
    reads: 3840,
    excerpt:
      "İstanbul'un dört bağımsız kitapçısıyla konuştum. Kâr değil, ısrar üzerine kurulan bir ekonomi.",
    body: buildBody(
      "Bir kitabı bulmak için Google'a değil, bir kitapçıya gitmek bir tercih meselesidir. Bu yazı, bu tercihe inanan kişilerle konuşmaktan doğdu.",
    ),
    tags: ["kitap", "okuma", "şehir"],
    toc: [
      { id: "i", label: "I — Dört dükkan, dört hikaye" },
      { id: "ii", label: "II — Direnişin ekonomisi" },
    ],
  },
  {
    slug: "ekran-kuslari",
    title: "Ekran Kuşları",
    subtitle: "Çocuklar ve dijital zaman üzerine düşünceler.",
    cover: cover2,
    category: "Kolektif",
    categorySlug: "kolektif",
    kind: "Kolektif",
    author: authors[2],
    publishedAt: "28 Şubat 2025",
    readMinutes: 8,
    reads: 5980,
    excerpt:
      "Yeğenim sekiz yaşında ve YouTube ona kahkahanın ne olduğunu öğretmiş gibi. İyi mi, kötü mü, bilmiyorum.",
    body: buildBody(
      "Yeğenim sekiz yaşında. Bir gün bana 'amca, sen YouTuber olsana' dedi. Bu cümle birkaç saat boyunca kafamda dolaştı.",
    ),
    tags: ["aile", "teknoloji", "kişisel"],
    toc: [{ id: "i", label: "I — Yeğenim" }, { id: "ii", label: "II — Yeni dikkat" }],
  },
  {
    slug: "siirin-pratigi",
    title: "Şiirin Gündelik Pratiği",
    subtitle: "Her sabah üç satır — bir disiplin denemesi.",
    cover: cover1,
    category: "Edebiyat",
    categorySlug: "edebiyat",
    kind: "Deneme",
    author: authors[6],
    publishedAt: "25 Şubat 2025",
    readMinutes: 7,
    reads: 4280,
    excerpt:
      "Bir yıl boyunca her sabah üç satır şiir yazdım. Bunun bana öğrettikleri şiir hakkında değil, dikkat hakkındaydı.",
    body: buildBody(
      "Şiir bir tür ciddi oyundur. Onu her gün biraz oynayınca, başka şeylere bakışın da değişiyor.",
    ),
    tags: ["şiir", "okuma", "dikkat"],
    toc: [{ id: "i", label: "I — Üç satırlık disiplin" }],
  },
  {
    slug: "muzigin-icindeki-bosluk",
    title: "Müziğin İçindeki Boşluk",
    subtitle: "Morton Feldman ve sessizliğin kompozisyonu.",
    cover: cover4,
    category: "Sanat",
    categorySlug: "sanat",
    kind: "Deneme",
    author: authors[3],
    publishedAt: "21 Şubat 2025",
    readMinutes: 11,
    reads: 3120,
    excerpt:
      "Morton Feldman'ın altı saatlik dörtlüsünü dinlemek, bir mekânın içinde uyumak gibidir.",
    body: buildBody(
      "Feldman'ın 'String Quartet No. 2' eseri altı saat sürer. İlk dinleyişimde uyandığımda hâlâ aynı akor çalıyordu — ve bu beni şaşırtmadı.",
    ),
    tags: ["müzik", "sanat", "yavaşlık"],
    toc: [{ id: "i", label: "I — Altı saat" }, { id: "ii", label: "II — Boşluk" }],
  },
  {
    slug: "kentin-isiklari",
    title: "Kentin Işıkları: Geceyi Yeniden Düşünmek",
    subtitle: "Işık kirliliği bir politik meseledir.",
    cover: cover2,
    category: "Şehir",
    categorySlug: "sehir",
    kind: "Araştırma",
    author: authors[6],
    publishedAt: "17 Şubat 2025",
    readMinutes: 15,
    reads: 5460,
    excerpt:
      "Modern şehir, geceyi unuttu. Ama gece, hâlâ orada — sadece görünmüyor.",
    body: buildBody(
      "Bir Anadolu köyünde gökyüzüne baktığımda, İstanbul'da hiç görmediğim bir Samanyolu vardı. Bu sadece estetik bir kayıp değil, derin bir kayıp.",
    ),
    tags: ["şehir", "ışık", "politika"],
    toc: [
      { id: "i", label: "I — Karanlığın hakları" },
      { id: "ii", label: "II — Politikanın aydınlanması" },
    ],
  },
  {
    slug: "dikkatin-mimarisi",
    title: "Dikkatin Mimarisi",
    subtitle: "Bir mekân, sizi nasıl okur?",
    cover: cover3,
    category: "Sanat",
    categorySlug: "sanat",
    kind: "Deneme",
    author: authors[4],
    publishedAt: "13 Şubat 2025",
    readMinutes: 10,
    reads: 4940,
    excerpt:
      "Bir kütüphane sizi okumaya, bir AVM sizi tüketime davet eder. Mekân, dikkati biçimlendirir.",
    body: buildBody(
      "Mimari bir form değil, bir davettir. Her mekan size bir şey yapmanızı söyler — bazen sessiz, bazen yüksek sesle.",
    ),
    tags: ["mimari", "dikkat", "minimalizm"],
    toc: [{ id: "i", label: "I — Mekan ve davranış" }],
  },
  {
    slug: "annemin-tarifleri",
    title: "Annemin Tarifleri",
    subtitle: "El yazısıyla yazılmış bir mutfak defteri.",
    cover: cover3,
    category: "Kolektif",
    categorySlug: "kolektif",
    kind: "Kolektif",
    author: authors[2],
    publishedAt: "9 Şubat 2025",
    readMinutes: 6,
    reads: 6730,
    excerpt:
      "Annem öldükten sonra mutfak defterini buldum. Tariflerden çok, kenarına yazdığı notlar konuştu benimle.",
    body: buildBody(
      "Tariflerin kendisi değildi mesele — kenarlara yazdığı 'Ali sevmez', 'fazla tuz', 'düğün için iki kat' notlarıydı.",
    ),
    tags: ["aile", "hafıza", "kişisel", "ev"],
    toc: [{ id: "i", label: "I — Defter" }],
  },
  {
    slug: "felsefede-zaman",
    title: "Felsefede Zaman: Augustinus'tan Bergson'a",
    subtitle: "Zaman bir şey midir, yoksa bir bakış mı?",
    cover: cover1,
    category: "Düşünce",
    categorySlug: "dusunce",
    kind: "Araştırma",
    author: authors[1],
    publishedAt: "5 Şubat 2025",
    readMinutes: 26,
    reads: 7820,
    excerpt:
      "Augustinus 'zamanın ne olduğunu bilirim, ama biri sorduğunda bilmem' demişti. Bu yazı, o cümlenin etrafında dönüyor.",
    body: buildBody(
      "Zaman üzerine düşünmek, kendi düşünme biçimimiz üzerine düşünmektir. Bu yazıda Augustinus, Kant ve Bergson'u yan yana koyacağım.",
    ),
    tags: ["felsefe", "dikkat"],
    toc: [
      { id: "i", label: "I — Augustinus" },
      { id: "ii", label: "II — Kant'ın saati" },
      { id: "iii", label: "III — Bergson'un süresi" },
      { id: "iv", label: "IV — Sonuç" },
    ],
  },
  {
    slug: "yavas-internet",
    title: "Yavaş İnternet İçin Bir Manifesto",
    subtitle: "Web'i yeniden kullanışlı kılmak mümkün mü?",
    cover: cover2,
    category: "Düşünce",
    categorySlug: "dusunce",
    kind: "Deneme",
    author: authors[1],
    publishedAt: "1 Şubat 2025",
    readMinutes: 9,
    reads: 8120,
    excerpt:
      "Sosyal medya yorulmadı; biz yorulduk. Yavaş internet, web'i bir kütüphane gibi kullanmaya dönüş.",
    body: buildBody(
      "RSS, kişisel bloglar, e-posta bültenleri — bunlar bir nostalji değil, hâlâ çalışan bir altyapı. Yavaş internet bir tercih.",
    ),
    tags: ["teknoloji", "dikkat", "okuma"],
    toc: [{ id: "i", label: "I — Manifesto" }, { id: "ii", label: "II — Pratik" }],
  },
  {
    slug: "bir-yaz-mektup",
    title: "Bir Yaz Mektubu",
    subtitle: "Hiç göndermediğim bir mektup.",
    cover: cover4,
    category: "Kolektif",
    categorySlug: "kolektif",
    kind: "Kolektif",
    author: authors[0],
    publishedAt: "27 Ocak 2025",
    readMinutes: 5,
    reads: 4120,
    excerpt:
      "Bir yaz, bir kıyıda, hiç göndermediğim bir mektup yazdım. Şimdi onu burada bırakıyorum.",
    body: buildBody(
      "Sevgili —, kıyıda bir taş seçtim. Yassı, gri, içinde bir damar. Onu sana göndermek istedim ama posta kutusu çok uzaktı.",
    ),
    tags: ["kişisel", "hafıza"],
    toc: [{ id: "i", label: "I — Mektup" }],
  },
  {
    slug: "kentin-kapilari",
    title: "Kentin Kapıları",
    subtitle: "Bir şehre nereden girersin?",
    cover: cover2,
    category: "Şehir",
    categorySlug: "sehir",
    kind: "Deneme",
    author: authors[0],
    publishedAt: "22 Ocak 2025",
    readMinutes: 8,
    reads: 3680,
    excerpt:
      "Bir şehre uçakla, trenle ya da yürüyerek girmek farklı şeylerdir. Kapı, ilk izlenimi belirler.",
    body: buildBody(
      "Lizbon'a trenle, İstanbul'a denizden, Tiflis'e uçakla girdim. Üçü de farklı şehirlerdi — sadece coğrafi olarak değil.",
    ),
    tags: ["şehir", "göç"],
    toc: [{ id: "i", label: "I — Üç kapı" }],
  },
];

export const featured = articles[0];
export const recent = articles.slice(1, 5);
export const popular = [...articles].sort((a, b) => b.reads - a.reads).slice(0, 5);

export const findArticle = (slug: string) => articles.find((a) => a.slug === slug);
export const findAuthor = (slug: string) => authors.find((a) => a.slug === slug);
export const articlesByAuthor = (slug: string) =>
  articles.filter((a) => a.author.slug === slug);
export const articlesByCategory = (slug: string) =>
  articles.filter((a) => a.categorySlug === slug);
export const findCategory = (slug: string) => categories.find((c) => c.slug === slug);

const tagSlugByName = new Map(tags.map((t) => [t.name, t.slug]));
export const articlesByTag = (tagSlug: string) =>
  articles.filter((a) =>
    a.tags.some((t) => (tagSlugByName.get(t) ?? t) === tagSlug),
  );
