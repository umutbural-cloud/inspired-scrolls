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
];

export const categories = [
  { slug: "dusunce", name: "Düşünce", description: "Felsefe, eleştiri, fikir denemeleri." },
  { slug: "edebiyat", name: "Edebiyat", description: "Kurmaca, şiir ve eleştiri üzerine yazılar." },
  { slug: "sehir", name: "Şehir", description: "Mekan, hafıza, mimari ve yaşanan yerler." },
  { slug: "teknoloji", name: "Teknoloji", description: "Dijital kültür, dikkat ve teknolojinin felsefesi." },
  { slug: "kolektif", name: "Kolektif", description: "Kişisel deneyim ve gözlem üzerine yazılar." },
];

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
