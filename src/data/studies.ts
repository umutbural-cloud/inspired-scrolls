export type Study = {
  slug: string;
  title: string;
  authors: string[];
  year: number;
  journal: string;
  findings: string;
  abstract: string;
  neverfapReview: string;
  categories: string[];
  topics: string[];
};

export const studies: Study[] = [
  {
    slug: "porn-consumption-sexual-choking",
    title: "Pornografi Tüketimi ve Cinsel Boğma: Teorik Mekanizmaların Bir Değerlendirmesi",
    authors: ["Wright, Paul J.", "Herbenick, Debby", "Tokunaga, Robert S."],
    year: 2021,
    journal: "Health Communication",
    findings:
      "Pornografi tüketiminin, cinsel partneri boğma olasılığını öngördüğü; bunun pornografide boğma davranışının normalleştirilmesinden kaynaklandığı düşünülüyor.",
    abstract:
      "Bu çalışma, ABD'deki yetişkin örnekleminde pornografi tüketim sıklığı ile partneri boğma davranışı arasındaki ilişkiyi incelemiştir. Çalışmacılar, pornografide yaygınlaşan boğma sahnelerinin izleyicilerin senaryo bilgisini şekillendirdiğini ve bunun gerçek hayattaki cinsel davranışlara aktarıldığını öne sürmektedir. Sonuçlar, üç teorik mekanizmayı (senaryo edinimi, normalleşme, taklit) destekler niteliktedir.",
    neverfapReview:
      "Bu çalışma, pornografinin sadece bireysel zihinsel etkisini değil; partner ilişkilerine aktarılan somut, tehlikeli davranışsal sonuçlarını da gösteriyor. Topluluğumuzda sıkça bahsedilen 'pornografinin cinsel beklentileri ve davranışları çarpıttığı' tezini güçlü biçimde destekliyor. Toparlanma sürecinde özellikle ilişki kalitesi ve sağlıklı yakınlık üzerine düşünenler için kritik bir referans.",
    categories: ["İlişkiler", "Toplum"],
    topics: ["Saldırı Kültürü", "Cinsiyet Eşitsizliği", "Riskli Cinsel Davranış", "Cinsel Saldırganlık"],
  },
  {
    slug: "porn-vs-sexual-science",
    title: "Pornografi ve Cinsel Bilim: ABD'deki Gençlerin Cinsel Cehaletinde Pornografi Kullanımının Rolü",
    authors: ["Wright, Paul J.", "Tokunaga, Robert S.", "Herbenick, Debby", "Paul, Bryant"],
    year: 2021,
    journal: "Communication Monographs",
    findings:
      "Pornografi tüketimi cinsel yanlış bilgilere inanmayla ilişkili; pornografi gençleri cinsel olarak daha bilgisiz hale getiriyor.",
    abstract:
      "Çalışma, gençlerin pornografi tüketimi ile cinsellik hakkındaki bilimsel olmayan inançları arasındaki ilişkiyi araştırmıştır. Pornografiyi bilgi kaynağı olarak gören gençlerde anatomi, rıza ve cinsel sağlık konularında belirgin yanlış bilgilenme tespit edilmiştir.",
    neverfapReview:
      "Pornografinin 'zararsız bir eğitim aracı' olduğu yanılgısını çürüten önemli bir çalışma. Özellikle genç yaşta bu içeriklerle tanışan kullanıcılarımızın deneyimleriyle birebir örtüşüyor: yanlış beklentiler, çarpık beden algısı, ilişkilerde hayal kırıklığı.",
    categories: ["Bireyler", "İlişkiler", "Toplum"],
    topics: ["Riskli Cinsel Davranış", "Cinsel Tutumlar", "Gençler"],
  },
  {
    slug: "dehumanization-sexual-aggression",
    title: "Pornografi Kullanımı, İki Tür İnsanlıktan Çıkarma ve Cinsel Saldırganlık",
    authors: ["Zhou, Yanyan", "Liu, Tuo", "Yan, Yaojun", "Paul, Bryant"],
    year: 2021,
    journal: "Journal of Sex & Marital Therapy",
    findings:
      "Pornografi tüketimi hem hayvansal hem mekanik insanlıktan çıkarma ile ilişkili; bunlar saldırgan cinsel tutum ve davranışları öngörüyor.",
    abstract:
      "Bu araştırma, pornografi tüketiminin kadınları hem hayvansal (içgüdüsel, akılsız) hem mekanik (nesne, araç) biçimde insanlıktan çıkarma ile ilişkili olduğunu ortaya koymaktadır. Bu iki insanlıktan çıkarma biçiminin saldırgan cinsel tutumlar ve davranışlar üzerinde aracı bir rol oynadığı bulunmuştur.",
    neverfapReview:
      "Pornografinin empati ve insan algısını nasıl deforme ettiğini bilimsel olarak gösteren temel kaynaklardan biri. Bağımlılıktan kurtulma yolculuğunda 'neden ilişkilerim bozuluyor', 'neden insanlara karşı duyarsızlaşıyorum' sorularına yanıt arayanlar için zorunlu okuma.",
    categories: ["Toplum"],
    topics: ["Saldırı Kültürü", "Nesneleştirme", "Cinsel Saldırganlık"],
  },
  {
    slug: "motivational-basis-of-porn-use",
    title: "İnsanlar Neden Pornografi İzler? Pornografi Kullanımının Motivasyon Temelleri",
    authors: ["Bőthe, Beáta", "Tóth-Király, István", "Potenza, Marc N.", "Demetrovics, Zsolt"],
    year: 2021,
    journal: "Psychology of Addictive Behaviors",
    findings:
      "Stres azaltma, duygu bastırma, can sıkıntısından kaçınma ve fantezi motivasyonları Problemli Pornografi Kullanımı ile ilişkili. Stres en güçlü öngörücü.",
    abstract:
      "Büyük örneklemli bu çalışma, pornografi tüketiminin ardında yatan motivasyonları sınıflandırmış ve hangilerinin problemli kullanıma dönüştüğünü incelemiştir. Stres yönetimi ve kaçınma motivasyonları, hazza dayalı motivasyonlardan çok daha güçlü biçimde patolojik kullanımla ilişkili bulunmuştur.",
    neverfapReview:
      "Topluluğumuzdaki en yaygın deneyimi doğruluyor: pornografi çoğu zaman bir 'haz arayışı' değil, duygu düzenleme aracıdır. Bu çalışma, gerçek tetikleyiciyi (stres, can sıkıntısı, kaçınma) hedef almadan yapılan bırakma denemelerinin neden başarısız olduğunu açıklıyor.",
    categories: ["Bireyler"],
    topics: ["Davranışsal Bağımlılık", "Mental Sağlık", "Cinsel Tutumlar"],
  },
  {
    slug: "adolescent-pornography-exposure",
    title: "ABD Gençlerinde Pornografiye Maruz Kalma, Medya Psikolojisi ve Cinsel Saldırganlık",
    authors: ["Wright, Paul J.", "Paul, Bryant", "Herbenick, Debby"],
    year: 2021,
    journal: "Journal of Health Communication",
    findings:
      "14-18 yaş arası erkeklerin %84,4'ü, kızların %57,1'i pornografi izlemiş. Pornografiye maruz kalma cinsel saldırganlıkla anlamlı şekilde ilişkili.",
    abstract:
      "Ulusal düzeyde temsili bir örneklemde gerçekleştirilen bu çalışma, ergenlerde pornografi maruziyetinin yaygınlığını ve cinsel saldırganlık davranışları ile ilişkisini belgelemiştir. Maruziyet sıklığı arttıkça hem mağdur hem fail olma olasılığı artmaktadır.",
    neverfapReview:
      "Sorunun bireysel değil, toplumsal ölçekte ne kadar büyük olduğunu kanıtlayan bir çalışma. Çocuk ve ergen koruma politikalarına dair savunuculuk yapanlar için sağlam bir veri kaynağı.",
    categories: ["Toplum"],
    topics: ["Yaygınlık", "Cinsel Saldırganlık", "Cinsel Tutumlar", "Gençler"],
  },
  {
    slug: "ppu-and-mental-health",
    title: "Problemli Pornografi Kullanımı, Depresyon ve Anksiyete Arasındaki İlişki",
    authors: ["Camilleri, Christian", "Perry, John T.", "Sammut, Stephen"],
    year: 2021,
    journal: "Frontiers in Psychology",
    findings:
      "Problemli pornografi kullanımı; depresyon, anksiyete ve düşük yaşam doyumu ile güçlü şekilde ilişkili bulundu.",
    abstract:
      "Üniversite örnekleminde yapılan bu çalışma, problemli pornografi kullanımının depresyon, anksiyete ve genel ruh sağlığı bozulması ile yüksek korelasyon gösterdiğini ortaya koymuştur. İlişki çift yönlüdür: kötüleşen ruh sağlığı kullanımı tetiklemekte, kullanım da ruh sağlığını bozmaktadır.",
    neverfapReview:
      "Bağımlılık ve depresyon arasındaki kısır döngüyü en net açıklayan çalışmalardan biri. Topluluğumuzda 'önce bunu mu bırakmalıyım, önce mi tedavi olmalıyım' sorusuna verilen yanıt: ikisi birlikte ele alınmalı.",
    categories: ["Bireyler"],
    topics: ["Davranışsal Bağımlılık", "Mental Sağlık", "Depresyon"],
  },
  {
    slug: "social-media-addiction-teens",
    title: "Ergenlerde Sosyal Medya Bağımlılığı ve Akademik Performans",
    authors: ["Andreassen, Cecilie S.", "Pallesen, Ståle"],
    year: 2020,
    journal: "Computers in Human Behavior",
    findings:
      "Yoğun sosyal medya kullanımı akademik performansta düşüş, uyku bozukluğu ve dikkat eksikliği ile ilişkili.",
    abstract:
      "Bu çalışma, ergenlerde sosyal medya kullanım yoğunluğu ile akademik performans arasındaki ilişkiyi boylamsal olarak incelemiştir. Günde 3 saatten fazla kullanımın not ortalamasında belirgin düşüşle, uyku süresinde kısalmayla ve odaklanma sorunlarıyla ilişkili olduğu bulunmuştur.",
    neverfapReview:
      "Bağımlılığın sadece pornografiyle sınırlı olmadığını hatırlatan değerli bir çalışma. Dijital ortamın tasarımı (sonsuz kaydırma, bildirimler) hepimizi aynı dopamin tuzağına çekiyor. Toparlanma sürecinde dijital hijyenin önemini gösteriyor.",
    categories: ["Bireyler", "Toplum"],
    topics: ["Davranışsal Bağımlılık", "Dikkat", "Gençler"],
  },
  {
    slug: "smartphone-dopamine-loop",
    title: "Akıllı Telefon Kullanımı, Dopamin Döngüleri ve Ödül Sistemleri",
    authors: ["Lembke, Anna"],
    year: 2021,
    journal: "Dopamine Nation Reviews",
    findings:
      "Sürekli bildirim ve sonsuz kaydırma mekanizmaları, beynin ödül sistemini bağımlılık benzeri kalıplara sokuyor.",
    abstract:
      "Lembke, modern akıllı telefonların nasıl tasarlandığını ve bu tasarımın beynin dopamin sistemini nasıl manipüle ettiğini özetlemektedir. Sürekli ödül beklentisi, anlık tatmin ve uyaran çeşitliliği; hazza karşı toleransı artırıp temel mutluluk seviyesini düşürmektedir.",
    neverfapReview:
      "Pornografi bağımlılığını anlamak isteyen herkes için temel okuma. 'Dopamin orucu' ve 'yeniden başlatma' yaklaşımlarının bilimsel temelini sunuyor; topluluğumuzdaki nofap pratiklerinin neden işe yaradığını açıklıyor.",
    categories: ["Bireyler"],
    topics: ["Davranışsal Bağımlılık", "Dikkat", "Mental Sağlık"],
  },
  {
    slug: "neuroscience-of-internet-pornography",
    title: "İnternet Pornografisinin Sinirbilimi: Sistematik Bir Derleme",
    authors: ["Love, Todd", "Laier, Christian", "Brand, Matthias", "Hatch, Linda", "Hajela, Raju"],
    year: 2015,
    journal: "Behavioral Sciences",
    findings:
      "Sürekli pornografi tüketimi, beynin ön korteks ve ödül devrelerinde madde bağımlılığına benzer değişiklikler yaratıyor.",
    abstract:
      "Bu sistematik derleme, internet pornografisinin nörobiyolojik etkilerine dair mevcut literatürü taramıştır. Bulgular, ön frontal kortekste hipoaktivite, striatumda yapısal değişiklikler ve ödül duyarsızlaşması gibi madde bağımlılığında görülen örüntülerin pornografi bağımlılığında da gözlemlendiğini göstermektedir.",
    neverfapReview:
      "Pornografi bağımlılığının 'gerçek bir bağımlılık' olduğunu kanıtlayan dönüm noktası niteliğinde bir çalışma. Hâlâ 'irade meselesi' diyenlere karşı en güçlü bilimsel yanıt. Beyninizin değişebileceğini bilmek, hem umut hem sorumluluk veriyor.",
    categories: ["Bireyler"],
    topics: ["Davranışsal Bağımlılık", "Beyin Plastisitesi", "Mental Sağlık"],
  },
  {
    slug: "porn-and-relationship-satisfaction",
    title: "Pornografi Kullanımı ve İlişki Doyumu: Boylamsal Bir Çalışma",
    authors: ["Perry, Samuel L."],
    year: 2020,
    journal: "Archives of Sexual Behavior",
    findings:
      "Pornografi tüketiminin zaman içinde evlilik kalitesi ve ilişki doyumunda belirgin düşüşle ilişkili olduğu bulundu.",
    abstract:
      "Beş yıl boyunca takip edilen evli çiftlerde, pornografi tüketim sıklığının ilişki doyumu, cinsel doyum ve evliliğe bağlılık üzerinde olumsuz etkileri olduğu gösterilmiştir. Etki, kullanımı bırakanlar lehine kısmen tersine dönmektedir.",
    neverfapReview:
      "İlişkisinde sorun yaşayan ya da yakınlık kurmakta zorlananlar için yol gösterici. Bırakma kararının sadece bireysel değil, ilişkisel bir yatırım olduğunu hatırlatıyor.",
    categories: ["İlişkiler"],
    topics: ["İlişki Doyumu", "Partner Etkileri"],
  },
  {
    slug: "gaming-disorder-who",
    title: "Oyun Bozukluğu: DSÖ Sınıflandırması ve Klinik Sonuçları",
    authors: ["Pontes, Halley M.", "Griffiths, Mark D."],
    year: 2020,
    journal: "International Journal of Mental Health and Addiction",
    findings:
      "DSÖ tarafından tanınan oyun bozukluğu; uyku, akademik başarı ve sosyal işlevsellikte ciddi bozulmalarla ilişkili.",
    abstract:
      "DSÖ'nün ICD-11'de oyun bozukluğunu resmi tanı olarak kabul etmesinin ardından yapılan bu derleme; oyun bozukluğunun klinik kriterlerini, yaygınlığını ve eşlik eden bozuklukları özetlemektedir.",
    neverfapReview:
      "Davranışsal bağımlılığın bilimsel olarak tanındığını gösteren önemli bir adım. Pornografi bağımlılığının da benzer mekanizmalarla işlediğini düşündüğümüzde, gelecekte resmi tanı kazanması için emsal teşkil ediyor.",
    categories: ["Bireyler"],
    topics: ["Davranışsal Bağımlılık", "Mental Sağlık", "Gençler"],
  },
  {
    slug: "porn-recovery-self-report",
    title: "Pornografi Kullanımını Bırakmaya Çalışan Bireylerde Toparlanma Süreci",
    authors: ["Fernandez, David P.", "Tee, Eugene Y. J.", "Fernandez, Elaine F."],
    year: 2017,
    journal: "Sexual Addiction & Compulsivity",
    findings:
      "Bırakma girişimleri sırasında geri tepme döngüleri yaygın; sosyal destek ve farkındalık temelli yaklaşımlar başarıyı artırıyor.",
    abstract:
      "Nitel bir desende yürütülen bu çalışma, bırakmaya çalışan bireylerin deneyimlerini analiz etmiştir. Geri tepmenin başarısızlık değil sürecin bir parçası olduğu; topluluk desteği, farkındalık temelli pratikler ve tetikleyicilerin tanınmasının uzun vadeli başarıyı artırdığı bulunmuştur.",
    neverfapReview:
      "Topluluğumuzun varlık nedenini bilimsel olarak doğrulayan çalışma. 'Yalnız başarılamaz' tezini destekliyor; geri tepmeyi bir yenilgi değil, öğrenme fırsatı olarak görmemizi öneriyor.",
    categories: ["Bireyler"],
    topics: ["Davranışsal Bağımlılık", "Toparlanma", "Mental Sağlık"],
  },
];
