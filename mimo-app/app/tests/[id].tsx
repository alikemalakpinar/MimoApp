// app/tests/[id].tsx - ORA DYNAMIC TEST SCREEN
// Comprehensive psychological test implementation with scoring
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// All test definitions with questions and scoring
const TEST_DATA: Record<string, TestDefinition> = {
  // SCHEMA TESTS
  'schema-abandonment': {
    id: 'schema-abandonment',
    name: 'Terk Edilme Şeması',
    description: 'Bu test, terk edilme korkusu ve bağımlılık eğilimlerinizi ölçer.',
    category: 'schema',
    hashtags: ['#TerkEdilme', '#Bağımlılık', '#İlişkiKorkuları'],
    questions: [
      'Bana yakın hissettiğim kişilerin beni terk edeceğinden çok endişe duyuyorum.',
      'Yakınlarımın beni bir gün terk edecekleri korkusuyla yaşıyorum.',
      'Sevdiklerim aniden kaybolabilir diye düşünürüm.',
      'İnsanlar bir gün beni yalnız bırakır.',
      'Kimsenin benim için kalmayacağını düşünürüm.',
      'Yakınlarımı kaybetme korkusu sık sık aklıma gelir.',
      'İnsanlar sonunda benden uzaklaşır.',
      'Güvendiğim kişiler bile beni terk edebilir.',
      'Sevdiğim insanlar her an gidebilir.',
      'Sonunda herkes beni terk eder.',
    ],
    options: [
      { label: 'Beni hiç tanımlamıyor', value: 1 },
      { label: 'Çoğunlukla tanımlamıyor', value: 2 },
      { label: 'Biraz beni tanımlıyor', value: 3 },
      { label: 'Çoğunlukla tanımlıyor', value: 4 },
      { label: 'Orta derecede tanımlıyor', value: 5 },
      { label: 'Beni tam olarak tanımlıyor', value: 6 },
    ],
    scoring: {
      type: 'schema',
      ranges: [
        { min: 10, max: 19, level: 'Çok Düşük', description: 'Terk edilme şemanız çok düşük seviyede. İlişkilerinizde güvenli bir bağlanma stiliniz var.' },
        { min: 20, max: 29, level: 'Düşük', description: 'Terk edilme şemanız düşük seviyede. Genel olarak ilişkilerinizde güvende hissediyorsunuz.' },
        { min: 30, max: 39, level: 'Orta', description: 'Terk edilme şemanız orta seviyede. Bazı durumlarda ilişkilerinizde güvensizlik hissedebilirsiniz. Bir uzmanla çalışmak faydalı olabilir.' },
        { min: 40, max: 49, level: 'Yüksek', description: 'Terk edilme şemanız yüksek seviyede. İlişkilerinizde sık sık terk edilme korkusu yaşıyor olabilirsiniz. Profesyonel destek almanızı öneririz.' },
        { min: 50, max: 60, level: 'Çok Yüksek', description: 'Terk edilme şemanız çok yüksek seviyede. Bu şema günlük yaşamınızı ve ilişkilerinizi olumsuz etkiliyor olabilir. Şema terapi alanında uzman bir psikolog ile çalışmanız önerilir.' },
      ],
      specialCase: {
        threshold: 29,
        highItemValues: [5, 6],
        description: 'Toplam puanınız düşük olsa da, bazı sorulara yüksek puan verdiniz. Bu, bu şemanın belirli durumlarda aktif olabileceğini gösterir. Bir uzmanla değerlendirme yapmanız faydalı olabilir.',
      },
    },
  },
  'schema-emotional-deprivation': {
    id: 'schema-emotional-deprivation',
    name: 'Duygusal Yoksunluk Şeması',
    description: 'Bu test, duygusal ihtiyaçların karşılanmadığı hissini ölçer.',
    category: 'schema',
    hashtags: ['#DuygusalYoksunluk', '#DuygusalDestek', '#İlişkiler'],
    questions: [
      'Kimse benim duygusal ihtiyaçlarımı anlamıyor.',
      'Yeterince sevilmiyorum.',
      'İnsanlar bana gerçekten yakın değil.',
      'Kimse beni gerçekten anlamıyor.',
      'Duygusal olarak yalnız hissediyorum.',
      'İhtiyacım olan ilgiyi görmüyorum.',
      'İnsanlar duygularımı önemsemiyor.',
      'Yakınlık ihtiyacım karşılanmıyor.',
      'Beni gerçekten seven kimse yok.',
      'Duygusal açıdan desteklenmiyorum.',
    ],
    options: [
      { label: 'Beni hiç tanımlamıyor', value: 1 },
      { label: 'Çoğunlukla tanımlamıyor', value: 2 },
      { label: 'Biraz beni tanımlıyor', value: 3 },
      { label: 'Çoğunlukla tanımlıyor', value: 4 },
      { label: 'Orta derecede tanımlıyor', value: 5 },
      { label: 'Beni tam olarak tanımlıyor', value: 6 },
    ],
    scoring: {
      type: 'schema',
      ranges: [
        { min: 10, max: 19, level: 'Çok Düşük', description: 'Duygusal yoksunluk şemanız çok düşük. Duygusal ihtiyaçlarınızın karşılandığını hissediyorsunuz.' },
        { min: 20, max: 29, level: 'Düşük', description: 'Duygusal yoksunluk şemanız düşük seviyede. Genel olarak duygusal destek aldığınızı hissediyorsunuz.' },
        { min: 30, max: 39, level: 'Orta', description: 'Duygusal yoksunluk şemanız orta seviyede. Bazen duygusal ihtiyaçlarınızın karşılanmadığını hissediyor olabilirsiniz.' },
        { min: 40, max: 49, level: 'Yüksek', description: 'Duygusal yoksunluk şemanız yüksek. Sıklıkla duygusal olarak desteklenmediğinizi hissedebilirsiniz. Profesyonel destek almanız önerilir.' },
        { min: 50, max: 60, level: 'Çok Yüksek', description: 'Duygusal yoksunluk şemanız çok yüksek. Bu derin bir duygusal boşluk hissi yaratıyor olabilir. Şema terapi ile çalışmanız şiddetle önerilir.' },
      ],
      specialCase: {
        threshold: 29,
        highItemValues: [5, 6],
        description: 'Toplam puanınız düşük olsa da, bazı sorulara yüksek puan verdiniz. Bu şema belirli durumlarda aktif olabilir.',
      },
    },
  },
  'schema-mistrust': {
    id: 'schema-mistrust',
    name: 'Güvensizlik/Kötüye Kullanılma Şeması',
    description: 'Bu test, başkalarına duyulan güvensizlik ve kötüye kullanılma beklentisini ölçer.',
    category: 'schema',
    hashtags: ['#Güvensizlik', '#Travma', '#İlişkiSorunları'],
    questions: [
      'İnsanlar beni kullanır.',
      'Başkalarının niyetlerine güvenmiyorum.',
      'İnsanlar fırsat buldukça beni aldatır.',
      'Başkaları beni incitebilir.',
      'İnsanların iyi niyetli olmadığını düşünürüm.',
      'Güvendiğim kişiler bile beni kandırabilir.',
      'İnsanlar çıkarları için beni kullanır.',
      'Başkalarından zarar görme ihtimalim yüksek.',
      'İnsanlara güvenmek tehlikelidir.',
      'Başkaları bana kötü davranabilir.',
    ],
    options: [
      { label: 'Beni hiç tanımlamıyor', value: 1 },
      { label: 'Çoğunlukla tanımlamıyor', value: 2 },
      { label: 'Biraz beni tanımlıyor', value: 3 },
      { label: 'Çoğunlukla tanımlıyor', value: 4 },
      { label: 'Orta derecede tanımlıyor', value: 5 },
      { label: 'Beni tam olarak tanımlıyor', value: 6 },
    ],
    scoring: {
      type: 'schema',
      ranges: [
        { min: 10, max: 19, level: 'Çok Düşük', description: 'Güvensizlik şemanız çok düşük. İnsanlara kolayca güvenebiliyorsunuz.' },
        { min: 20, max: 29, level: 'Düşük', description: 'Güvensizlik şemanız düşük. Genel olarak insanlara güvenme konusunda rahatınsınız.' },
        { min: 30, max: 39, level: 'Orta', description: 'Güvensizlik şemanız orta seviyede. Bazı durumlarda insanlara güvenmekte zorlanabilirsiniz.' },
        { min: 40, max: 49, level: 'Yüksek', description: 'Güvensizlik şemanız yüksek. Sıklıkla insanların size zarar verebileceğini düşünüyor olabilirsiniz.' },
        { min: 50, max: 60, level: 'Çok Yüksek', description: 'Güvensizlik şemanız çok yüksek. Bu ilişkilerinizi ciddi şekilde etkileyebilir. Travma odaklı terapi almanız önerilir.' },
      ],
      specialCase: {
        threshold: 29,
        highItemValues: [5, 6],
        description: 'Bazı sorulara yüksek puan verdiniz. Bu şema belirli durumlar veya kişilerle tetiklenebilir.',
      },
    },
  },
  'schema-social-isolation': {
    id: 'schema-social-isolation',
    name: 'Sosyal İzolasyon Şeması',
    description: 'Bu test, sosyal ortamlarda kendinizi farklı veya dışlanmış hissetme eğiliminizi ölçer.',
    category: 'schema',
    hashtags: ['#SosyalİZolasyon', '#Yabancılaşma', '#AitOlamama'],
    questions: [
      'Hiçbir gruba ait değilim.',
      'Diğer insanlardan farklıyım.',
      'Topluma uyum sağlayamıyorum.',
      'Kendimi yabancı hissediyorum.',
      'İnsanlarla aramda mesafe var.',
      'Sosyal ortamlarda dışlanmış hissediyorum.',
      'Kimseyle ortak noktam yok.',
      'Dünyaya ait değilim.',
      'Gruplardan kopuk hissediyorum.',
      'Sosyal hayattan uzaktayım.',
    ],
    options: [
      { label: 'Beni hiç tanımlamıyor', value: 1 },
      { label: 'Çoğunlukla tanımlamıyor', value: 2 },
      { label: 'Biraz beni tanımlıyor', value: 3 },
      { label: 'Çoğunlukla tanımlıyor', value: 4 },
      { label: 'Orta derecede tanımlıyor', value: 5 },
      { label: 'Beni tam olarak tanımlıyor', value: 6 },
    ],
    scoring: {
      type: 'schema',
      ranges: [
        { min: 10, max: 19, level: 'Çok Düşük', description: 'Sosyal izolasyon şemanız çok düşük. Sosyal ortamlarda kendinizi rahat hissediyorsunuz.' },
        { min: 20, max: 29, level: 'Düşük', description: 'Sosyal izolasyon şemanız düşük. Genel olarak sosyal gruplarla bağlantı kurabiliyorsunuz.' },
        { min: 30, max: 39, level: 'Orta', description: 'Sosyal izolasyon şemanız orta seviyede. Bazen kendinizi dışarıda hissedebilirsiniz.' },
        { min: 40, max: 49, level: 'Yüksek', description: 'Sosyal izolasyon şemanız yüksek. Sıklıkla toplumdan kopuk hissedebilirsiniz.' },
        { min: 50, max: 60, level: 'Çok Yüksek', description: 'Sosyal izolasyon şemanız çok yüksek. Bu ciddi yalnızlık hissine yol açıyor olabilir. Profesyonel destek önerilir.' },
      ],
      specialCase: {
        threshold: 29,
        highItemValues: [5, 6],
        description: 'Belirli sorularda yüksek puanlarınız var. Bazı sosyal bağlamlarda kendinizi dışlanmış hissediyor olabilirsiniz.',
      },
    },
  },
  'schema-vulnerability': {
    id: 'schema-vulnerability',
    name: 'Hastalık ve Tehditler Karşısında Dayanıksızlık',
    description: 'Bu test, felaket ve hastalık korkularınızı ölçer.',
    category: 'schema',
    hashtags: ['#Dayanıksızlık', '#Kaygı', '#SağlıkKaygısı'],
    questions: [
      'Her an kötü bir şey olabilir.',
      'Hastalanmaktan çok korkuyorum.',
      'Felaketler karşısında çaresiz kalırım.',
      'Başıma kötü şeyler geleceğini düşünürüm.',
      'Sağlığım hakkında sürekli endişelenirim.',
      'Tehlikelerden korunamam.',
      'Kazalar ve hastalıklar beni bulur.',
      'Dünya tehlikeli bir yer.',
      'Bir gün ciddi hastalanacağım.',
      'Kontrol edemediğim şeylerden korkuyorum.',
    ],
    options: [
      { label: 'Beni hiç tanımlamıyor', value: 1 },
      { label: 'Çoğunlukla tanımlamıyor', value: 2 },
      { label: 'Biraz beni tanımlıyor', value: 3 },
      { label: 'Çoğunlukla tanımlıyor', value: 4 },
      { label: 'Orta derecede tanımlıyor', value: 5 },
      { label: 'Beni tam olarak tanımlıyor', value: 6 },
    ],
    scoring: {
      type: 'schema',
      ranges: [
        { min: 10, max: 19, level: 'Çok Düşük', description: 'Dayanıksızlık şemanız çok düşük. Tehditler karşısında kendinizi güçlü hissediyorsunuz.' },
        { min: 20, max: 29, level: 'Düşük', description: 'Dayanıksızlık şemanız düşük. Genel olarak kaygı seviyelerniz normal.' },
        { min: 30, max: 39, level: 'Orta', description: 'Dayanıksızlık şemanız orta seviyede. Bazen aşırı endişelenebilirsiniz.' },
        { min: 40, max: 49, level: 'Yüksek', description: 'Dayanıksızlık şemanız yüksek. Kaygı hayatınızı etkileyebilir. Profesyonel destek düşünün.' },
        { min: 50, max: 60, level: 'Çok Yüksek', description: 'Dayanıksızlık şemanız çok yüksek. Ciddi kaygı problemleri yaşıyor olabilirsiniz. Anksiyete için terapi önerilir.' },
      ],
      specialCase: {
        threshold: 29,
        highItemValues: [5, 6],
        description: 'Bazı sorularda yüksek puanlarınız var. Belirli tehditlerle ilgili yoğun kaygı yaşıyor olabilirsiniz.',
      },
    },
  },
  'schema-defectiveness': {
    id: 'schema-defectiveness',
    name: 'Kusurluluk/Utanç Şeması',
    description: 'Bu test, kendinizi kusurlu veya değersiz hissetme eğiliminizi ölçer.',
    category: 'schema',
    hashtags: ['#Kusurluluk', '#Utanç', '#ÖzDeğer'],
    questions: [
      'İnsanlar gerçek benliğimi görse benden uzaklaşır.',
      'Temelde kusurlu biriyim.',
      'Sevilmeye layık değilim.',
      'Utanç verici özellikleriı var.',
      'Gerçek benliğimi saklıyorum.',
      'Bende yanlış bir şeyler var.',
      'Başkalarının önünde kendimden utanıyorum.',
      'İnsanlar beni tanısaydı beğenmezlerdi.',
      'İçimdeki kusurlaru saklıyorum.',
      'Değersiz olduğumu hissediyorum.',
    ],
    options: [
      { label: 'Beni hiç tanımlamıyor', value: 1 },
      { label: 'Çoğunlukla tanımlamıyor', value: 2 },
      { label: 'Biraz beni tanımlıyor', value: 3 },
      { label: 'Çoğunlukla tanımlıyor', value: 4 },
      { label: 'Orta derecede tanımlıyor', value: 5 },
      { label: 'Beni tam olarak tanımlıyor', value: 6 },
    ],
    scoring: {
      type: 'schema',
      ranges: [
        { min: 10, max: 19, level: 'Çok Düşük', description: 'Kusurluluk şemanız çok düşük. Kendinize değer veriyorsunuz.' },
        { min: 20, max: 29, level: 'Düşük', description: 'Kusurluluk şemanız düşük. Genel olarak kendinizi kabul edebiliyorsunuz.' },
        { min: 30, max: 39, level: 'Orta', description: 'Kusurluluk şemanız orta seviyede. Bazen kendinizi yetersiz hissedebilirsiniz.' },
        { min: 40, max: 49, level: 'Yüksek', description: 'Kusurluluk şemanız yüksek. Düşük öz değer duygusu yaşıyor olabilirsiniz.' },
        { min: 50, max: 60, level: 'Çok Yüksek', description: 'Kusurluluk şemanız çok yüksek. Ciddi öz değer problemleri yaşıyor olabilirsiniz. Terapi şiddetle önerilir.' },
      ],
      specialCase: {
        threshold: 29,
        highItemValues: [5, 6],
        description: 'Bazı sorularda yüksek puanlar var. Belirli alanlarda kendinizi yetersiz hissediyor olabilirsiniz.',
      },
    },
  },
  'schema-subjugation': {
    id: 'schema-subjugation',
    name: 'Boyun Eğicilik Şeması',
    description: 'Bu test, başkalarının ihtiyaçlarını kendi ihtiyaçlarınızın önüne koyma eğiliminizi ölçer.',
    category: 'schema',
    hashtags: ['#BoyunEğme', '#ÖzFeda', '#Sınırlar'],
    questions: [
      'Başkalarını memnun etmek için kendi isteklerimden vazgeçerim.',
      'Hayır demekte zorlanıyorum.',
      'Başkalarının ihtiyaçları benimkinden önemli.',
      'Kendi fikirlerimi ifade edemiyorum.',
      'Başkalarının beklentilerine göre yaşıyorum.',
      'İnsanları kırmaktan çok korkuyorum.',
      'Kendi isteklerimi bastırıyorum.',
      'Başkalarının kararlarına uyum sağlarım.',
      'Kendim için sınır koyamıyorum.',
      'İnsanların benden istediğini yapıyorum.',
    ],
    options: [
      { label: 'Beni hiç tanımlamıyor', value: 1 },
      { label: 'Çoğunlukla tanımlamıyor', value: 2 },
      { label: 'Biraz beni tanımlıyor', value: 3 },
      { label: 'Çoğunlukla tanımlıyor', value: 4 },
      { label: 'Orta derecede tanımlıyor', value: 5 },
      { label: 'Beni tam olarak tanımlıyor', value: 6 },
    ],
    scoring: {
      type: 'schema',
      ranges: [
        { min: 10, max: 19, level: 'Çok Düşük', description: 'Boyun eğicilik şemanız çok düşük. Sınırlarınızı koruyabiliyorsunuz.' },
        { min: 20, max: 29, level: 'Düşük', description: 'Boyun eğicilik şemanız düşük. Genel olarak kendi ihtiyaçlarınızı ifade edebiliyorsunuz.' },
        { min: 30, max: 39, level: 'Orta', description: 'Boyun eğicilik şemanız orta seviyede. Bazen kendinizi feda edebilirsiniz.' },
        { min: 40, max: 49, level: 'Yüksek', description: 'Boyun eğicilik şemanız yüksek. Sınır koymakta zorlanıyor olabilirsiniz.' },
        { min: 50, max: 60, level: 'Çok Yüksek', description: 'Boyun eğicilik şemanız çok yüksek. Kendi ihtiyaçlarınızı ihmal ediyor olabilirsiniz. Asertiflik eğitimi önerilir.' },
      ],
      specialCase: {
        threshold: 29,
        highItemValues: [5, 6],
        description: 'Bazı sorularda yüksek puanlar var. Belirli ilişkilerde sınır koymakta zorlanıyor olabilirsiniz.',
      },
    },
  },
  'schema-unrelenting-standards': {
    id: 'schema-unrelenting-standards',
    name: 'Yüksek Standartlar/Aşırı Eleştiricilik',
    description: 'Bu test, kendinizden aşırı beklenti ve mükemmeliyetçilik eğiliminizi ölçer.',
    category: 'schema',
    hashtags: ['#YüksekStandartlar', '#Mükemmeliyetçilik', '#ÖzEleştiri'],
    questions: [
      'Her zaman en iyisini yapmak zorundayım.',
      'Hatalarım kabul edilemez.',
      'Yetersiz kalmak beni çok rahatsız eder.',
      'Başarısızlık benim için felaket demek.',
      'Kendimden çok şey bekliyorum.',
      'Her şey mükemmel olmalı.',
      'Hatalarımı affetmekte zorlanıyorum.',
      'Yaptığım işler asla yeterince iyi değil.',
      'Sürekli daha iyi olmaya çalışıyorum.',
      'Kendimi çok eleştiriyorum.',
    ],
    options: [
      { label: 'Beni hiç tanımlamıyor', value: 1 },
      { label: 'Çoğunlukla tanımlamıyor', value: 2 },
      { label: 'Biraz beni tanımlıyor', value: 3 },
      { label: 'Çoğunlukla tanımlıyor', value: 4 },
      { label: 'Orta derecede tanımlıyor', value: 5 },
      { label: 'Beni tam olarak tanımlıyor', value: 6 },
    ],
    scoring: {
      type: 'schema',
      ranges: [
        { min: 10, max: 19, level: 'Çok Düşük', description: 'Yüksek standartlar şemanız çok düşük. Kendinize karşı hoşgörülüsünüz.' },
        { min: 20, max: 29, level: 'Düşük', description: 'Yüksek standartlar şemanız düşük. Dengeli beklentileriniz var.' },
        { min: 30, max: 39, level: 'Orta', description: 'Yüksek standartlar şemanız orta seviyede. Bazen kendinize karşı sert olabilirsiniz.' },
        { min: 40, max: 49, level: 'Yüksek', description: 'Yüksek standartlar şemanız yüksek. Mükemmeliyetçilik stres kaynağı olabilir.' },
        { min: 50, max: 60, level: 'Çok Yüksek', description: 'Yüksek standartlar şemanız çok yüksek. Aşırı mükemmeliyetçilik tükenmişliğe yol açabilir. Terapi önerilir.' },
      ],
      specialCase: {
        threshold: 29,
        highItemValues: [5, 6],
        description: 'Bazı alanlarda aşırı mükemmeliyetçi olabilirsiniz.',
      },
    },
  },
  'schema-entitlement': {
    id: 'schema-entitlement',
    name: 'Hak Görme/Büyüklenmecilik Şeması',
    description: 'Bu test, özel muamele beklentisi ve ayrıcalıklı hissetme eğiliminizi ölçer.',
    category: 'schema',
    hashtags: ['#HakGörme', '#Narsisizm', '#AyrıcalıkBeklentisi'],
    questions: [
      'Kurallar benim için esnetilebilir.',
      'Diğerlerinden daha fazlasını hak ediyorum.',
      'Başkalarının bana özel davranması gerekir.',
      'İstediğimi almak için uğraşırım.',
      'Sıradan kurallar beni bağlamaz.',
      'Diğerlerinden üstünüm.',
      'İsteklerim öncelikli olmalı.',
      'Başkalarından farklı muamele görmeliyim.',
      'Haklarım başkalarınınkinden önemli.',
      'Her zaman istediğimi elde etmeliyim.',
    ],
    options: [
      { label: 'Beni hiç tanımlamıyor', value: 1 },
      { label: 'Çoğunlukla tanımlamıyor', value: 2 },
      { label: 'Biraz beni tanımlıyor', value: 3 },
      { label: 'Çoğunlukla tanımlıyor', value: 4 },
      { label: 'Orta derecede tanımlıyor', value: 5 },
      { label: 'Beni tam olarak tanımlıyor', value: 6 },
    ],
    scoring: {
      type: 'schema',
      ranges: [
        { min: 10, max: 19, level: 'Çok Düşük', description: 'Hak görme şemanız çok düşük. Dengeli beklentileriniz var.' },
        { min: 20, max: 29, level: 'Düşük', description: 'Hak görme şemanız düşük. Makul sınırlar içindesiniz.' },
        { min: 30, max: 39, level: 'Orta', description: 'Hak görme şemanız orta seviyede. Bazı durumlarda fazla talepkar olabilirsiniz.' },
        { min: 40, max: 49, level: 'Yüksek', description: 'Hak görme şemanız yüksek. Bu ilişkilerinizi etkileyebilir.' },
        { min: 50, max: 60, level: 'Çok Yüksek', description: 'Hak görme şemanız çok yüksek. Bu ciddi ilişki sorunlarına yol açabilir. Profesyonel destek önerilir.' },
      ],
      specialCase: {
        threshold: 29,
        highItemValues: [5, 6],
        description: 'Bazı alanlarda aşırı hak beklentisi olabilir.',
      },
    },
  },
  // BECK DEPRESSION INVENTORY
  'beck-depression': {
    id: 'beck-depression',
    name: 'Beck Depresyon Envanteri',
    description: 'Bu test, depresyon belirtilerinizin şiddetini ölçer.',
    category: 'mood',
    hashtags: ['#Depresyon', '#RuhSağlığı', '#DuyguDurum'],
    questions: [
      'Kendinizi üzgün hissediyor musunuz?',
      'Gelecek hakkında umutsuz mu hissediyorsunuz?',
      'Kendinizi başarısız hissediyor musunuz?',
      'Hayattan zevk alamıyor musunuz?',
      'Kendinizi suçlu hissediyor musunuz?',
      'Cezalandırılmayı hak ettiğinizi düşünüyor musunuz?',
      'Kendinizden hayal kırıklığına mı uğradınız?',
      'Kendinizi eleştiriyor musunuz?',
      'Kendinize zarar vermeyi düşünüyor musunuz?',
      'Normalden daha fazla ağlıyor musunuz?',
      'Sinirli mi hissediyorsunuz?',
      'İnsanlara ilginizi kaybettiniz mi?',
      'Karar vermekte zorlanıyor musunuz?',
      'Görünümünüzden memnun değil misiniz?',
      'Çalışmak sizin için zorlaştı mı?',
      'Uyku probleminiz var mı?',
      'Yorgun mu hissediyorsunuz?',
      'İştahınız değişti mi?',
      'Kilo kaybettiniz mi?',
      'Sağlığınız hakkında endişeli misiniz?',
      'Cinsel ilginiz azaldı mı?',
    ],
    options: [
      { label: 'Hayır / Hiç', value: 0 },
      { label: 'Hafif', value: 1 },
      { label: 'Orta', value: 2 },
      { label: 'Şiddetli', value: 3 },
    ],
    scoring: {
      type: 'sum',
      ranges: [
        { min: 0, max: 9, level: 'Minimal', description: 'Depresyon belirtileriniz minimal düzeyde. Genel olarak iyi bir ruh hali içindesiniz.' },
        { min: 10, max: 16, level: 'Hafif', description: 'Hafif depresyon belirtileri gösteriyorsunuz. Öz bakım ve yaşam tarzı değişiklikleri faydalı olabilir.' },
        { min: 17, max: 29, level: 'Orta', description: 'Orta düzeyde depresyon belirtileri var. Profesyonel destek almanız önerilir.' },
        { min: 30, max: 63, level: 'Şiddetli', description: 'Şiddetli depresyon belirtileri gösteriyorsunuz. Acil olarak bir ruh sağlığı uzmanına başvurmanız önerilir.' },
      ],
    },
  },
  // PERCEIVED STRESS SCALE
  'perceived-stress': {
    id: 'perceived-stress',
    name: 'Algılanan Stres Ölçeği',
    description: 'Bu test, son bir ayda yaşadığınız stres düzeyini ölçer.',
    category: 'mood',
    hashtags: ['#Stres', '#Kaygı', '#RuhSağlığı'],
    questions: [
      'Son bir ayda, beklenmedik bir şey olduğunda ne kadar üzüldünüz?',
      'Hayatınızdaki önemli şeyleri kontrol edemediğinizi ne kadar hissettiniz?',
      'Sinirli ve stresli olduğunuzu ne kadar hissettiniz?',
      'Günlük sorunlarla ne kadar başarıyla başa çıktınız?',
      'Hayatınızdaki önemli değişikliklerle etkili şekilde başa çıktığınızı ne kadar hissettiniz?',
      'Kişisel sorunlarınızla başa çıkma yeteneğinize ne kadar güvendiniz?',
      'İşlerin yolunda gittiğini ne kadar hissettiniz?',
      'Yapmanız gereken şeylerle başa çıkamadığınızı ne kadar hissettiniz?',
      'Hayatınızdaki rahatsız edici şeyleri ne kadar kontrol edebildiniz?',
      'Her şeyin kontrolünüzde olduğunu ne kadar hissettiniz?',
      'Kontrolünüz dışında olan şeyler yüzünden ne kadar öfke duydunuz?',
      'Üstesinden gelmeniz gereken şeyleri düşünerek ne kadar vakit geçirdiniz?',
      'Zamanınızı nasıl geçireceğinizi ne kadar kontrol edebildiniz?',
      'Zorlukların üstesinden gelemeyeceğiniz kadar biriktiğini ne kadar hissettiniz?',
    ],
    options: [
      { label: 'Hiçbir zaman', value: 0 },
      { label: 'Neredeyse hiçbir zaman', value: 1 },
      { label: 'Bazen', value: 2 },
      { label: 'Oldukça sık', value: 3 },
      { label: 'Çok sık', value: 4 },
    ],
    scoring: {
      type: 'perceived-stress',
      reverseItems: [3, 4, 5, 6, 8, 9, 12],
      ranges: [
        { min: 0, max: 13, level: 'Düşük Stres', description: 'Stres düzeyiniz düşük. Stresle başa çıkma becerileriniz güçlü görünüyor.' },
        { min: 14, max: 26, level: 'Orta Stres', description: 'Orta düzeyde stres yaşıyorsunuz. Gevşeme teknikleri ve stres yönetimi öğrenmek faydalı olabilir.' },
        { min: 27, max: 40, level: 'Yüksek Stres', description: 'Yüksek stres düzeyindesiniz. Profesyonel destek ve stres yönetim programları önerilir.' },
      ],
    },
  },
  // BIG FIVE PERSONALITY TEST
  'big-five': {
    id: 'big-five',
    name: 'Big Five Kişilik Testi',
    description: 'Bu test, beş temel kişilik özelliğinizi ölçer: Dışadönüklük, Uyumluluk, Sorumluluk, Duygusal Denge ve Deneyime Açıklık.',
    category: 'personality',
    hashtags: ['#Kişilik', '#BigFive', '#KendiniTanı'],
    questions: [
      // Dışadönüklük (1-10)
      'Partilerde birçok farklı insanla konuşurum.',
      'Dikkat çekmekten rahatsız olmam.',
      'Sosyal ortamlarda konuşmayı başlatan genellikle ben olurum.',
      'İnsanların arasında olmayı severim.',
      'Yabancılarla konuşmaktan çekinmem.',
      'Kalabalık ortamları tercih ederim.',
      'Toplantılarda söz almaktan hoşlanırım.',
      'Enerjik ve hareketli biriyimdir.',
      'Kolayca arkadaş edinirim.',
      'Sosyal etkinliklere katılmayı severim.',
      // Uyumluluk (11-20)
      'Başkalarının duygularıyla ilgilenirim.',
      'Yumuşak kalpli biriyimdir.',
      'İnsanlara yardım etmekten zevk alırım.',
      'Başkalarını mutlu etmeye çalışırım.',
      'Empati kurmakta iyiyimdir.',
      'Anlayışlı ve hoşgörülü biriyimdir.',
      'İnsanlara güvenirim.',
      'İşbirliği yapmayı tercih ederim.',
      'Çatışmalardan kaçınırım.',
      'Affedici biriyimdir.',
      // Sorumluluk (21-30)
      'Her zaman hazırlıklıyımdır.',
      'Detaylara dikkat ederim.',
      'İşleri hemen hallederim.',
      'Düzeni severim.',
      'Bir programa bağlı kalırım.',
      'Görevlerimi eksiksiz yerine getiririm.',
      'Hedeflerime ulaşmak için çalışırım.',
      'Dakik biriyimdir.',
      'Verdiğim sözleri tutarım.',
      'Disiplinli biriyimdir.',
      // Duygusal Denge (31-40) - ters puanlama
      'Kolayca strese girerim.',
      'Sık sık endişelenirim.',
      'Duygusal dalgalanmalar yaşarım.',
      'Kolay öfkelenirim.',
      'Çabuk üzülürüm.',
      'Karamsar düşüncelere kapılırım.',
      'Duygularım kolayca incinir.',
      'Gergin biriyimdir.',
      'Kendimi sık sık mutsuz hissederim.',
      'Panik yapma eğilimim var.',
      // Deneyime Açıklık (41-50)
      'Hayal gücüm zengindir.',
      'Soyut fikirlerle ilgilenirim.',
      'Sanatla ilgilenirim.',
      'Yeni şeyler denemeyi severim.',
      'Felsefi konuları düşünürüm.',
      'Yaratıcı biriyimdir.',
      'Farklı kültürleri merak ederim.',
      'Kitap okumayı severim.',
      'Yenilikçi çözümler ararım.',
      'Entelektüel tartışmaları severim.',
    ],
    options: [
      { label: 'Kesinlikle Katılmıyorum', value: 1 },
      { label: 'Katılmıyorum', value: 2 },
      { label: 'Kararsızım', value: 3 },
      { label: 'Katılıyorum', value: 4 },
      { label: 'Kesinlikle Katılıyorum', value: 5 },
    ],
    scoring: {
      type: 'big-five',
      dimensions: [
        { name: 'Dışadönüklük', items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], reverse: [] },
        { name: 'Uyumluluk', items: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], reverse: [] },
        { name: 'Sorumluluk', items: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29], reverse: [] },
        { name: 'Duygusal Denge', items: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39], reverse: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39] },
        { name: 'Deneyime Açıklık', items: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49], reverse: [] },
      ],
    },
  },
  // LOVE LANGUAGES
  'love-languages': {
    id: 'love-languages',
    name: 'Beş Sevgi Dili Testi',
    description: 'Bu test, sevgiyi nasıl ifade ettiğinizi ve almayı tercih ettiğinizi belirler.',
    category: 'relationship',
    hashtags: ['#SevgiDilleri', '#İlişkiler', '#Romantik'],
    questions: [
      // Her bir soruda iki seçenek - A veya B
      'Partnerimden övgü almayı | Partnerimle vakit geçirmeyi',
      'Sarılmayı | Teşekkür edilmeyi',
      'Hediye almayı | Birlikte aktivite yapmayı',
      'Yardım edilmesini | Dokunulmayı',
      'Övülmeyi | Hediye almayı',
      'El ele tutuşmayı | Yardım edilmesini',
      'Takdir edilmeyi | Beraber zaman geçirmeyi',
      'Sürpriz hediye almayı | Fiziksel yakınlığı',
      'Destekleyici sözler duymayı | İşlerimin yapılmasını',
      'Beraber seyahat etmeyi | Öpülmeyi',
      'Teşekkür edilmesini | Beraber yemek yemeyi',
      'Kucaklanmayı | Güzel sözler duymayı',
      'Düşünceli hediyeler almayı | Ev işlerinde yardım almayı',
      'Beraber yürüyüşe çıkmayı | Masaj yapılmasını',
      'Cesaretlendirici mesajlar almayı | Anlamlı hediyeler almayı',
      'Birlikte hobi yapmayı | Fiziksel şefkat gösterilmesini',
      'Takdir edilmeyi | Günlük işlerde yardım almayı',
      'Romantik hediyeler almayı | Kaliteli vakit geçirmeyi',
      'Dokunulmayı | Desteklenmeyi',
      'Sadece ikimizin olduğu zamanları | Yardımsever davranışları',
      'Kompliman almayı | Sarılmayı',
      'Hediye sürprizlerini | İşlerimin halledilmesini',
      'Konuşarak vakit geçirmeyi | El tutmayı',
      'Minnettarlık ifadelerini | Birlikte film izlemeyi',
      'Fiziksel yakınlığı | Hediyeyi',
      'Beraber alışverişe çıkmayı | Masaj yapılmasını',
      'Özür dilendiğinde | Beraber oyun oynandığında',
      'Özel bir hediye aldığımda | Yardım edildiğinde',
      'Gülümsenerek bakıldığında | Sarıldığımda',
      'Teşvik edildiğimde | Birlikte yemek yapıldığında',
    ],
    options: [
      { label: 'A', value: 1 },
      { label: 'B', value: 2 },
    ],
    scoring: {
      type: 'love-languages',
      mapping: [
        // [A seçeneği dili, B seçeneği dili]
        ['words', 'quality'], ['touch', 'words'], ['gifts', 'quality'], ['service', 'touch'], ['words', 'gifts'],
        ['touch', 'service'], ['words', 'quality'], ['gifts', 'touch'], ['words', 'service'], ['quality', 'touch'],
        ['words', 'quality'], ['touch', 'words'], ['gifts', 'service'], ['quality', 'touch'], ['words', 'gifts'],
        ['quality', 'touch'], ['words', 'service'], ['gifts', 'quality'], ['touch', 'words'], ['quality', 'service'],
        ['words', 'touch'], ['gifts', 'service'], ['quality', 'touch'], ['words', 'quality'], ['touch', 'gifts'],
        ['quality', 'touch'], ['words', 'quality'], ['gifts', 'service'], ['words', 'touch'], ['words', 'quality'],
      ],
      languages: {
        words: 'Onaylayıcı Sözler',
        quality: 'Kaliteli Vakit',
        gifts: 'Hediye Alma',
        service: 'Hizmet Etme',
        touch: 'Fiziksel Dokunuş',
      },
    },
  },
  // ECR ATTACHMENT STYLE
  'ecr-attachment': {
    id: 'ecr-attachment',
    name: 'Yetişkin Bağlanma Stili (ECR)',
    description: 'Bu test, romantik ilişkilerdeki bağlanma stilinizi ölçer.',
    category: 'relationship',
    hashtags: ['#Bağlanma', '#İlişki', '#Yakınlık'],
    questions: [
      'Partnerime yakın olmaktan hoşlanırım.',
      'Partnerime bağımlı olmaktan rahatsızlık duyarım.',
      'Partnerimin benden uzaklaşmasından korkarım.',
      'Duygusal olarak yakınlaşmak beni rahatsız eder.',
      'Partnerime güveniyorum.',
      'Partnerimin beni sevmediğinden endişelenirim.',
      'İlişkilerde mesafeli kalmayı tercih ederim.',
      'Terk edilmekten korkuyorum.',
      'Partnerimle her şeyi paylaşırım.',
      'Çok yakınlaşmaktan kaçınırım.',
      'Partnerimin bana olan sevgisinden şüphe ederim.',
      'İlişkide bağımsız kalmak isterim.',
      'Partnerime tamamen güvenirim.',
      'Reddedilmekten çok korkarım.',
      'Duygularımı açmakta zorlanırım.',
      'Partnerim olmadan yapamam.',
      'İlişkide rahat hissederim.',
      'Değersiz olduğumu hissederim.',
      'Partnerimle derin bağ kurarım.',
      'Yakınlık beni bunaltır.',
      'Partnerimin sadakatinden eminimdir.',
      'Sevilmediğimden korkarım.',
      'Duygusal mesafe korurum.',
      'Partnerime çok bağlıyım.',
      'İlişkide güvende hissederim.',
      'Terkedilme korkum yoğundur.',
      'Yakınlıktan kaçınırım.',
      'Partnerime ihtiyaç duyarım.',
      'İlişkimden memnunum.',
      'Yeterince sevilmediğimi hissederim.',
      'Bağımsızlığımı korumak isterim.',
      'Partnerim beni incitir diye korkarım.',
      'Açılmaktan çekinirim.',
      'Partnerimle çok vakit geçirmek isterim.',
      'Güvenli bir ilişkim var.',
      'İlgisizlik beni endişelendirir.',
    ],
    options: [
      { label: 'Kesinlikle Katılmıyorum', value: 1 },
      { label: 'Katılmıyorum', value: 2 },
      { label: 'Biraz Katılmıyorum', value: 3 },
      { label: 'Kararsızım', value: 4 },
      { label: 'Biraz Katılıyorum', value: 5 },
      { label: 'Katılıyorum', value: 6 },
      { label: 'Kesinlikle Katılıyorum', value: 7 },
    ],
    scoring: {
      type: 'ecr',
      anxietyItems: [2, 5, 7, 10, 13, 15, 17, 21, 25, 29, 31, 35],
      avoidanceItems: [1, 3, 6, 9, 11, 14, 19, 22, 26, 30, 32],
      reverseItems: [0, 4, 8, 12, 16, 18, 20, 24, 28, 34],
    },
  },
};

// Type definitions
interface TestOption {
  label: string;
  value: number;
}

interface ScoringRange {
  min: number;
  max: number;
  level: string;
  description: string;
}

interface TestScoring {
  type: string;
  ranges?: ScoringRange[];
  specialCase?: {
    threshold: number;
    highItemValues: number[];
    description: string;
  };
  reverseItems?: number[];
  dimensions?: Array<{
    name: string;
    items: number[];
    reverse: number[];
  }>;
  mapping?: string[][];
  languages?: Record<string, string>;
  anxietyItems?: number[];
  avoidanceItems?: number[];
}

interface TestDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  hashtags: string[];
  questions: string[];
  options: TestOption[];
  scoring: TestScoring;
}

interface TestResult {
  score: number;
  level: string;
  description: string;
  specialCaseTriggered?: boolean;
  specialCaseDescription?: string;
  dimensions?: Array<{
    name: string;
    score: number;
    percentage: number;
  }>;
  primaryLanguage?: string;
  languageScores?: Record<string, number>;
  attachmentStyle?: string;
  anxietyScore?: number;
  avoidanceScore?: number;
}

export default function TestScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const test = TEST_DATA[id || ''];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentQuestion + 1) / (test?.questions.length || 1),
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestion, test]);

  if (!test) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color={Colors.light.accent} />
          <Text style={styles.errorText}>Test bulunamadı</Text>
          <TouchableOpacity style={styles.backButtonLarge} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);

    if (currentQuestion < test.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 200);
    } else {
      setTimeout(() => {
        calculateResults(newAnswers);
      }, 300);
    }
  };

  const calculateResults = (finalAnswers: Record<number, number>) => {
    const scoring = test.scoring;
    let testResult: TestResult;

    if (scoring.type === 'schema' || scoring.type === 'sum') {
      const totalScore = Object.values(finalAnswers).reduce((sum, val) => sum + val, 0);
      const range = scoring.ranges?.find(r => totalScore >= r.min && totalScore <= r.max);

      testResult = {
        score: totalScore,
        level: range?.level || 'Bilinmiyor',
        description: range?.description || '',
      };

      // Check for special case (schema tests)
      if (scoring.specialCase && totalScore <= scoring.specialCase.threshold) {
        const hasHighItems = Object.values(finalAnswers).some(
          val => scoring.specialCase!.highItemValues.includes(val)
        );
        if (hasHighItems) {
          testResult.specialCaseTriggered = true;
          testResult.specialCaseDescription = scoring.specialCase.description;
        }
      }
    } else if (scoring.type === 'perceived-stress') {
      let totalScore = 0;
      Object.entries(finalAnswers).forEach(([idx, val]) => {
        const questionIndex = parseInt(idx);
        if (scoring.reverseItems?.includes(questionIndex)) {
          totalScore += (4 - val);
        } else {
          totalScore += val;
        }
      });
      const range = scoring.ranges?.find(r => totalScore >= r.min && totalScore <= r.max);
      testResult = {
        score: totalScore,
        level: range?.level || 'Bilinmiyor',
        description: range?.description || '',
      };
    } else if (scoring.type === 'big-five') {
      const dimensions = scoring.dimensions?.map(dim => {
        let score = 0;
        dim.items.forEach(itemIdx => {
          let value = finalAnswers[itemIdx] || 3;
          if (dim.reverse.includes(itemIdx)) {
            value = 6 - value;
          }
          score += value;
        });
        const maxScore = dim.items.length * 5;
        const percentage = Math.round((score / maxScore) * 100);
        return { name: dim.name, score, percentage };
      }) || [];

      testResult = {
        score: 0,
        level: 'Kişilik Profili',
        description: 'Aşağıda beş temel kişilik boyutundaki profilinizi görebilirsiniz.',
        dimensions,
      };
    } else if (scoring.type === 'love-languages') {
      const languageScores: Record<string, number> = {
        words: 0, quality: 0, gifts: 0, service: 0, touch: 0,
      };

      Object.entries(finalAnswers).forEach(([idx, val]) => {
        const questionIndex = parseInt(idx);
        const mapping = scoring.mapping?.[questionIndex];
        if (mapping) {
          const selectedLanguage = val === 1 ? mapping[0] : mapping[1];
          languageScores[selectedLanguage]++;
        }
      });

      const primaryLanguage = Object.entries(languageScores).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0];

      testResult = {
        score: 0,
        level: scoring.languages?.[primaryLanguage] || '',
        description: `Ana sevgi diliniz: ${scoring.languages?.[primaryLanguage]}`,
        primaryLanguage,
        languageScores,
      };
    } else if (scoring.type === 'ecr') {
      let anxietyScore = 0;
      let avoidanceScore = 0;

      scoring.anxietyItems?.forEach(idx => {
        anxietyScore += finalAnswers[idx] || 4;
      });
      scoring.avoidanceItems?.forEach(idx => {
        let val = finalAnswers[idx] || 4;
        if (scoring.reverseItems?.includes(idx)) {
          val = 8 - val;
        }
        avoidanceScore += val;
      });

      const avgAnxiety = anxietyScore / (scoring.anxietyItems?.length || 1);
      const avgAvoidance = avoidanceScore / (scoring.avoidanceItems?.length || 1);

      let attachmentStyle = 'Güvenli';
      if (avgAnxiety > 4 && avgAvoidance > 4) attachmentStyle = 'Korkulu-Kaçıngan';
      else if (avgAnxiety > 4) attachmentStyle = 'Kaygılı-Saplantılı';
      else if (avgAvoidance > 4) attachmentStyle = 'Kayıtsız-Kaçıngan';

      testResult = {
        score: 0,
        level: attachmentStyle,
        description: `Bağlanma stiliniz: ${attachmentStyle}`,
        attachmentStyle,
        anxietyScore: Math.round(avgAnxiety * 10) / 10,
        avoidanceScore: Math.round(avgAvoidance * 10) / 10,
      };
    } else {
      testResult = {
        score: 0,
        level: 'Bilinmiyor',
        description: 'Sonuç hesaplanamadı.',
      };
    }

    setResult(testResult);
    setShowResults(true);
  };

  const progress = ((currentQuestion + 1) / test.questions.length) * 100;

  if (showResults && result) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />

        {/* Results View */}
        <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.resultsHeader}>
            <LinearGradient
              colors={Colors.gradients.primary as [string, string]}
              style={styles.resultsBadge}
            >
              <Feather name="check-circle" size={32} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.resultsTitle}>Test Tamamlandı!</Text>
            <Text style={styles.testName}>{test.name}</Text>
          </View>

          {/* Score Card */}
          <View style={styles.scoreCard}>
            {result.score > 0 && (
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreValue}>{result.score}</Text>
                <Text style={styles.scoreLabel}>puan</Text>
              </View>
            )}
            <Text style={styles.levelText}>{result.level}</Text>
            <Text style={styles.descriptionText}>{result.description}</Text>

            {result.specialCaseTriggered && (
              <View style={styles.specialCaseCard}>
                <Feather name="alert-circle" size={20} color={Colors.light.accent} />
                <Text style={styles.specialCaseText}>{result.specialCaseDescription}</Text>
              </View>
            )}
          </View>

          {/* Big Five Dimensions */}
          {result.dimensions && (
            <View style={styles.dimensionsCard}>
              <Text style={styles.dimensionsTitle}>Kişilik Boyutlarınız</Text>
              {result.dimensions.map((dim, index) => (
                <View key={index} style={styles.dimensionItem}>
                  <View style={styles.dimensionHeader}>
                    <Text style={styles.dimensionName}>{dim.name}</Text>
                    <Text style={styles.dimensionPercent}>{dim.percentage}%</Text>
                  </View>
                  <View style={styles.dimensionBarBg}>
                    <View
                      style={[
                        styles.dimensionBarFill,
                        { width: `${dim.percentage}%` }
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Love Languages */}
          {result.languageScores && (
            <View style={styles.dimensionsCard}>
              <Text style={styles.dimensionsTitle}>Sevgi Dili Skorlarınız</Text>
              {Object.entries(result.languageScores).map(([lang, score], index) => (
                <View key={index} style={styles.dimensionItem}>
                  <View style={styles.dimensionHeader}>
                    <Text style={styles.dimensionName}>
                      {test.scoring.languages?.[lang]}
                    </Text>
                    <Text style={styles.dimensionPercent}>{score}</Text>
                  </View>
                  <View style={styles.dimensionBarBg}>
                    <View
                      style={[
                        styles.dimensionBarFill,
                        { width: `${(score / 12) * 100}%` }
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Attachment Style */}
          {result.attachmentStyle && (
            <View style={styles.attachmentCard}>
              <Text style={styles.attachmentTitle}>Bağlanma Stiliniz</Text>
              <Text style={styles.attachmentStyle}>{result.attachmentStyle}</Text>
              <View style={styles.attachmentScores}>
                <View style={styles.attachmentScoreItem}>
                  <Text style={styles.attachmentScoreLabel}>Kaygı</Text>
                  <Text style={styles.attachmentScoreValue}>{result.anxietyScore}</Text>
                </View>
                <View style={styles.attachmentScoreItem}>
                  <Text style={styles.attachmentScoreLabel}>Kaçınma</Text>
                  <Text style={styles.attachmentScoreValue}>{result.avoidanceScore}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Hashtags */}
          <View style={styles.hashtagsContainer}>
            {test.hashtags.map((tag, index) => (
              <View key={index} style={styles.hashtag}>
                <Text style={styles.hashtagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.resultsActions}>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => setShowShareModal(true)}
            >
              <LinearGradient
                colors={Colors.gradients.secondary as [string, string]}
                style={styles.shareButtonGradient}
              >
                <Feather name="share-2" size={20} color="#FFFFFF" />
                <Text style={styles.shareButtonText}>Sonuçları Paylaş</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.consultButton}
              onPress={() => router.push('/tests')}
            >
              <Feather name="message-circle" size={20} color={Colors.light.primary} />
              <Text style={styles.consultButtonText}>Uzman ile Değerlendir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => router.push('/tests')}
            >
              <Text style={styles.homeButtonText}>Testlere Dön</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Share Modal */}
        <Modal
          visible={showShareModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowShareModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Sonuçları Paylaş</Text>
                <TouchableOpacity onPress={() => setShowShareModal(false)}>
                  <Feather name="x" size={24} color={Colors.light.textPrimary} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.shareOption}>
                <View style={[styles.shareOptionIcon, { backgroundColor: Colors.light.primary + '15' }]}>
                  <Feather name="edit-3" size={20} color={Colors.light.primary} />
                </View>
                <View style={styles.shareOptionContent}>
                  <Text style={styles.shareOptionTitle}>My Journey'de Paylaş</Text>
                  <Text style={styles.shareOptionSubtitle}>Deneyimini toplulukla paylaş</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareOption}>
                <View style={[styles.shareOptionIcon, { backgroundColor: Colors.light.secondary + '15' }]}>
                  <Feather name="user-check" size={20} color={Colors.light.secondary} />
                </View>
                <View style={styles.shareOptionContent}>
                  <Text style={styles.shareOptionTitle}>Uzmanla Paylaş</Text>
                  <Text style={styles.shareOptionSubtitle}>Psikologunla güvenle paylaş</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareOption}>
                <View style={[styles.shareOptionIcon, { backgroundColor: Colors.light.accent + '15' }]}>
                  <Feather name="lock" size={20} color={Colors.light.accent} />
                </View>
                <View style={styles.shareOptionContent}>
                  <Text style={styles.shareOptionTitle}>Sadece Kaydet</Text>
                  <Text style={styles.shareOptionSubtitle}>Sonuçları gizli tut</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="x" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <Animated.View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  })
                }
              ]}
            />
          </Animated.View>
          <Text style={styles.progressText}>
            {currentQuestion + 1} / {test.questions.length}
          </Text>
        </View>
      </View>

      {/* Question */}
      <ScrollView
        style={styles.questionContainer}
        contentContainerStyle={styles.questionContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.testTitle}>{test.name}</Text>
          <Text style={styles.questionText}>{test.questions[currentQuestion]}</Text>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {test.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  answers[currentQuestion] === option.value && styles.optionButtonActive,
                ]}
                onPress={() => handleAnswer(option.value)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.optionText,
                  answers[currentQuestion] === option.value && styles.optionTextActive,
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        {currentQuestion > 0 && (
          <TouchableOpacity
            style={styles.prevButton}
            onPress={() => setCurrentQuestion(prev => prev - 1)}
          >
            <Feather name="arrow-left" size={20} color={Colors.light.textSecondary} />
            <Text style={styles.prevButtonText}>Önceki</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },

  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.light.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
  },

  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    minWidth: 50,
    textAlign: 'right',
  },

  questionContainer: {
    flex: 1,
  },

  questionContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.huge,
  },

  testTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
    marginBottom: Spacing.md,
  },

  questionText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    lineHeight: 32,
    marginBottom: Spacing.xl,
    letterSpacing: -0.5,
  },

  optionsContainer: {
    gap: Spacing.md,
  },

  optionButton: {
    backgroundColor: Colors.light.surface,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.sm,
  },

  optionButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },

  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    textAlign: 'center',
  },

  optionTextActive: {
    color: '#FFFFFF',
  },

  navigation: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },

  prevButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },

  prevButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },

  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },

  backButtonLarge: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.button,
  },

  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Results
  resultsContainer: {
    flex: 1,
  },

  resultsHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },

  resultsBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  resultsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.sm,
  },

  testName: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },

  scoreCard: {
    marginHorizontal: Spacing.xl,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.md,
  },

  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  scoreValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.primary,
  },

  scoreLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },

  levelText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.sm,
  },

  descriptionText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  specialCaseCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.light.accent + '10',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },

  specialCaseText: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.accent,
    lineHeight: 18,
  },

  dimensionsCard: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.sm,
  },

  dimensionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.lg,
  },

  dimensionItem: {
    marginBottom: Spacing.md,
  },

  dimensionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },

  dimensionName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  dimensionPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.primary,
  },

  dimensionBarBg: {
    height: 8,
    backgroundColor: Colors.light.border,
    borderRadius: 4,
    overflow: 'hidden',
  },

  dimensionBarFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
  },

  attachmentCard: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.sm,
  },

  attachmentTitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
  },

  attachmentStyle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.lg,
  },

  attachmentScores: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },

  attachmentScoreItem: {
    alignItems: 'center',
  },

  attachmentScoreLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },

  attachmentScoreValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.primary,
  },

  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },

  hashtag: {
    backgroundColor: Colors.light.primary + '15',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.pill,
  },

  hashtagText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary,
  },

  resultsActions: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },

  shareButton: {
    borderRadius: BorderRadius.button,
    overflow: 'hidden',
    ...Shadows.primary,
  },

  shareButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },

  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  consultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary + '15',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.button,
    gap: Spacing.sm,
  },

  consultButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
  },

  homeButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },

  homeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: BorderRadius.bottomSheet,
    borderTopRightRadius: BorderRadius.bottomSheet,
    padding: Spacing.xl,
    paddingBottom: Spacing.huge,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },

  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    gap: Spacing.lg,
  },

  shareOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  shareOptionContent: {
    flex: 1,
  },

  shareOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 2,
  },

  shareOptionSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
});
