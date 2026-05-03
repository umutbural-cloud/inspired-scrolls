import { supabase } from "@/integrations/supabase/client";
import { articles } from "@/data/mock";

const FLAG = "demo:seeded:v2";

type SeedSpec = {
  slug: string;
  highlights: string[];
  notes: string[];
  completedDaysAgo?: number; // for DB completed_articles
  readMinutes?: number;
};

const SPECS: SeedSpec[] = [
  {
    slug: "sehrin-grameri",
    completedDaysAgo: 1,
    readMinutes: 11,
    highlights: [
      "Bir kentte uzun süre kalmak, onun gramerini öğrenmek demektir.",
      "Hızını yavaşlattığında, şehir konuşmaya başlar.",
      "Yavaşlamak bir tercih değil, bir disiplindir.",
      "Hafıza burada bir mekan değil, bir hızdır.",
    ],
    notes: [
      "Şehirde 'gramer' metaforu çok güçlü — kendi mahallemde de aynı sessiz kuralları sezdiğimi fark ettim.",
      "Pazar yürüyüşlerimde test etmek için: bir sokağı her hafta aynı saatte yürümek.",
    ],
  },
  {
    slug: "dikkat-ve-zaman",
    completedDaysAgo: 2,
    readMinutes: 22,
    highlights: [
      "Simone Weil dikkati, 'ruhun en saf cömertliği' olarak tanımlamıştı.",
      "Bugün dikkat, üzerinde savaşılan bir mülk haline geldi.",
      "Dikkatimizi nereye verdiğimiz, kim olduğumuzu söyler.",
    ],
    notes: [
      "Weil alıntısı için kaynağı bul — 'Tanrıyı Beklerken' içinde olabilir.",
      "Dikkat ekonomisi başlığı için ayrıca bir okuma listesi açacağım.",
      "Telefonu sabah ilk saatte açmamak — küçük bir deney olarak başlatmak.",
    ],
  },
  {
    slug: "annemin-mektuplari",
    completedDaysAgo: 3,
    readMinutes: 8,
    highlights: [
      "İçeriden ince bir lavanta kokusu geldi — onun her şeyine sinmiş o tanıdık koku.",
      "Otuz yıl boyunca bana yazıp hiç göndermediği mektuplar vardı.",
    ],
    notes: [
      "Çok dokundu. Anneannemin bana yazdığı kartpostalları yeniden okumalıyım.",
    ],
  },
  {
    slug: "bos-bir-oda",
    completedDaysAgo: 4,
    readMinutes: 9,
    highlights: [
      "Mimarlık ışığa bir kap açmaktır.",
      "İçinde hiçbir şey olmayan bir oda bile bir şey söyler.",
      "Boşluk, mimarinin en az konuşulan dilidir.",
    ],
    notes: [
      "Ando'nun Naoshima projeleri üzerine ayrı bir derleme hazırlamak iyi olur.",
    ],
  },
  {
    slug: "okumanin-bicimi",
    completedDaysAgo: 5,
    readMinutes: 14,
    highlights: [
      "Okuduğumuz yer, okuduğumuz şeyin parçasıdır.",
      "Ekrandan okumak ile kağıttan okumak farklı şeylerdir.",
    ],
    notes: [
      "Akşamları sadece kağıttan okumayı deneyeceğim — iki hafta süren küçük bir deney.",
      "Bedenin okuması: oturma biçimi, ışık, sayfa kalınlığı.",
    ],
  },
  {
    slug: "uykunun-grameri",
    completedDaysAgo: 6,
    readMinutes: 19,
    highlights: [
      "Uyku bir dinlenme değil, bir yazma sürecidir.",
      "REM evrelerinde beyin gün boyu yaşadıklarımızı yeniden düzenler.",
      "Glymphatic sistem uyku sırasında beyni temizler.",
    ],
    notes: [
      "Uyku saatlerimi 23:00 - 07:00 arası sabitlemeyi deneyeceğim.",
      "Glymphatic sistem üzerine Nedergaard makalelerini ara.",
    ],
  },
  {
    slug: "siiri-cevirmek",
    completedDaysAgo: 7,
    readMinutes: 12,
    highlights: [
      "Bir şiiri çevirmek, başka bir dilde aynı sessizliği kurmaktır.",
      "Çeviri, ihanetin en zarif biçimidir derler.",
    ],
    notes: [
      "Celan'ın 'Atemwende'sinden iki şiiri kendi başıma çevirmeyi deneyeceğim.",
    ],
  },
  {
    slug: "sinemada-yavaslik",
    completedDaysAgo: 9,
    readMinutes: 13,
    highlights: [
      "Sinemanın hızı, dikkat ekonomisinin hızıdır.",
      "Béla Tarr ve Tsai Ming-liang gibi yönetmenler bu hıza karşı sessiz bir direniş örgütler.",
    ],
    notes: [
      "Tekrar izlenecek: 'Sátántangó' ve 'Stray Dogs'.",
      "Uzun plan üzerine kısa bir liste hazırlamak iyi olur.",
    ],
  },
  {
    slug: "ando-ve-isigin-kabi",
    completedDaysAgo: 11,
    readMinutes: 16,
    highlights: [
      "Ando için beton bir yüzey değil, ışığı tutan bir kaptır.",
      "Bu sıcaklık, ışığın o yüzeylere düşüş biçiminden geliyordu.",
    ],
    notes: [
      "Bir gün Naoshima'ya gitmek — bu yıl olmasa bile listede kalmalı.",
    ],
  },
  {
    slug: "mahallenin-sessiz-emegi",
    completedDaysAgo: 13,
    readMinutes: 18,
    highlights: [
      "Bir mahallenin gerçek ekonomisi, hiç para görmeyen ilişkilerdir.",
      "Bakım, komşuluk, ortak çocuk büyütme — bunlar görünmez ama ağır emeklerdir.",
    ],
    notes: [
      "Saha araştırması yöntemi ilgimi çekti — kendi sokağımda küçük bir gözlem günlüğü tutmayı deneyeceğim.",
    ],
  },
  {
    slug: "kitapcilarin-sessiz-direnisi",
    completedDaysAgo: 16,
    readMinutes: 9,
    highlights: [
      "Kâr değil, ısrar üzerine kurulan bir ekonomi.",
    ],
    notes: [
      "Kadıköy'deki Mephisto ve Minoa'ya hafta sonu uğramak.",
    ],
  },
  {
    slug: "ekran-kuslari",
    completedDaysAgo: 20,
    readMinutes: 8,
    highlights: [
      "YouTube ona kahkahanın ne olduğunu öğretmiş gibi.",
    ],
    notes: [
      "Yeğenimle birlikte ekran-dışı bir cumartesi ritüeli kurmak iyi olur.",
    ],
  },
];

function rid() {
  return Math.random().toString(36).slice(2, 10);
}

export async function seedDemoData(userId: string) {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(FLAG)) return;

  const validSlugs = new Set(articles.map((a) => a.slug));

  // 1) Seed localStorage highlights & notes
  for (const spec of SPECS) {
    if (!validSlugs.has(spec.slug)) continue;
    const hlKey = `hl:${spec.slug}`;
    const ntKey = `notes:${spec.slug}`;
    const existingHl = localStorage.getItem(hlKey);
    const existingNt = localStorage.getItem(ntKey);
    if (!existingHl || existingHl === "[]") {
      const now = Date.now();
      const arr = spec.highlights.map((text, i) => ({
        id: rid(),
        text,
        createdAt: now - (spec.highlights.length - i) * 60_000,
      }));
      localStorage.setItem(hlKey, JSON.stringify(arr));
    }
    if (!existingNt || existingNt === "[]") {
      const now = Date.now();
      const arr = spec.notes.map((text, i) => ({
        id: rid(),
        text,
        createdAt: now - (spec.notes.length - i) * 90_000,
      }));
      localStorage.setItem(ntKey, JSON.stringify(arr));
    }
  }

  // 2) Seed completed_articles in DB if user has none
  try {
    const { count } = await supabase
      .from("completed_articles")
      .select("article_slug", { count: "exact", head: true })
      .eq("user_id", userId);

    if ((count ?? 0) === 0) {
      const rows = SPECS.filter((s) => validSlugs.has(s.slug)).map((s) => {
        const d = new Date();
        d.setDate(d.getDate() - (s.completedDaysAgo ?? 1));
        return {
          user_id: userId,
          article_slug: s.slug,
          completed_at: d.toISOString(),
          read_minutes: s.readMinutes ?? 5,
        };
      });
      await supabase.from("completed_articles").insert(rows);
    }
  } catch (e) {
    // silent — demo seeding is best-effort
    console.warn("seedDemoData failed", e);
  }

  localStorage.setItem(FLAG, "1");
}