export type Module = { title: string; duration: string; content: string };
export type LocalizedContent = {
	title: string;
	description: string;
	topics: string[];
	modules: Module[];
};
export type Course = {
	slug: string;
	tag: string;
	duration: string;
	level: string;
	students: string;
	free: boolean;
	i18n: { en: LocalizedContent; fr: LocalizedContent; ar: LocalizedContent };
};

export const LANGUAGES = [
	{ code: "en", label: "EN", name: "English", dir: "ltr" },
	{ code: "fr", label: "FR", name: "Français", dir: "ltr" },
	{ code: "ar", label: "AR", name: "العربية", dir: "rtl" },
] as const;

export type LangCode = "en" | "fr" | "ar";

export const COURSES: Course[] = [
	{
		slug: "export-documentation",
		tag: "Free — Open Access",
		duration: "45 min",
		level: "Beginner",
		students: "1.2k",
		free: true,
		i18n: {
			en: {
				title: "Understanding Export Documentation",
				description:
					"Learn the essential paperwork behind every international shipment — commercial invoices, certificates of origin, packing lists, and how to prepare them correctly for EU and GCC markets.",
				topics: [
					"Commercial invoices",
					"Certificates of origin",
					"Packing lists",
					"Customs declarations",
				],
				modules: [
					{
						title: "What is export documentation and why it matters",
						duration: "8 min",
						content: `Every product that crosses an international border requires a set of official documents. These documents serve three purposes: they identify the goods, declare their value, and prove their origin. Without them, shipments are held at customs — sometimes for weeks.

As a Moroccan artisan selling to EU or GCC buyers, you will typically need to prepare four core documents for each order:

**1. Commercial Invoice**
This is the primary document in any export transaction. It acts as both a receipt and a declaration of value. Your commercial invoice must include:
- Full name and address of seller (you) and buyer
- Date of the invoice and a unique invoice number
- Description of goods (be specific: "Hand-knotted Berber wool rug, 200×300cm, natural dyes")
- Quantity and unit price
- Total value and currency (usually EUR or USD)
- Payment terms (e.g. 50% upfront, 50% on delivery)
- Incoterms (e.g. FOB Casablanca, CIF Marseille)

**2. Packing List**
The packing list supplements the commercial invoice. It gives customs officers a physical breakdown of the shipment — how many boxes, what is in each one, the weight and dimensions.

**3. Certificate of Origin**
This document certifies that your goods were made in Morocco. It unlocks preferential tariff rates for buyers in countries with trade agreements with Morocco — including the EU.

**4. Bill of Lading / Airway Bill**
Issued by your freight forwarder or shipping company, this acts as a receipt for the goods and a transport contract. Your logistics partner will issue it once the goods are loaded.`,
					},
					{
						title: "How to write a correct commercial invoice",
						duration: "12 min",
						content: `A poorly written commercial invoice is the single most common reason shipments are delayed at customs. EU buyers are especially strict — German and French customs officers will reject a vague or inconsistent invoice.

**Common mistakes to avoid:**

- Writing "Moroccan handicraft" instead of a specific description. Use Harmonized System (HS) codes. For handmade rugs: **5701.10** (knotted) or **5702.42** (woven).

- Using a round total without itemising. Always show: unit price × quantity = line total, then subtotal, then freight, then grand total.

- Mismatching the invoice value and the packing list.

- Not specifying Incoterms. Most common for small exporters:
  - **EXW** — buyer arranges everything from your workshop
  - **FOB** — you deliver to the port, buyer handles ocean freight
  - **CIF** — you cover freight and insurance to destination port

**Practical tip:** Create a template with your details pre-filled. Each new order only requires updating buyer details, product description, and value. Keep a numbered log of all invoices.`,
					},
					{
						title: "Getting your Certificate of Origin in Morocco",
						duration: "10 min",
						content: `The Certificate of Origin (CO) is issued by the **Chambre de Commerce, d'Industrie et de Services (CCIS)** in your region.

**Documents needed:**
- Copy of your commercial invoice
- Copy of your business or cooperative registration
- Written declaration that goods were produced in Morocco
- Application form (available at the chamber)

**Processing time:** 24–48 hours. Some chambers offer same-day service.

**Cost:** 150–300 MAD depending on the chamber and shipment value.

**EUR.1 Movement Certificate**
For EU buyers, you may also need a EUR.1 certificate — activating preferential duties under the EU-Morocco Association Agreement. It is issued by Moroccan customs (ADII). Ask your freight forwarder on your first shipment.`,
					},
					{
						title: "Preparing your packing list step by step",
						duration: "8 min",
						content: `The packing list is a physical inventory of your shipment. Customs uses it to verify that what is declared on the invoice matches what is physically in the boxes.

**Structure of a good packing list:**

| Box # | Contents | Qty | Net Weight | Gross Weight | Dimensions |
|-------|----------|-----|------------|--------------|------------|
| 1 | Hand-knotted rug, ref. BRB-001 | 1 | 4.2 kg | 5.1 kg | 220×320×8 cm |
| 2 | Hand-knotted rug, ref. BRB-002 | 1 | 3.8 kg | 4.7 kg | 200×300×7 cm |

**Key rules:**
- Each box must be numbered and correspond to a row in your packing list
- Net weight = goods only. Gross weight = goods + packaging
- Dimensions should be of the packed box, not the product
- Use consistent units (kg, cm)

**For artisan rugs:** Roll tightly, wrap in kraft paper, then polypropylene. Mark each roll with a reference number matching your packing list.`,
					},
				],
			},
			fr: {
				title: "Comprendre la Documentation d'Exportation",
				description:
					"Apprenez les documents essentiels pour chaque expédition internationale — factures commerciales, certificats d'origine, listes de colisage, et comment les préparer correctement pour les marchés européens et du Golfe.",
				topics: [
					"Factures commerciales",
					"Certificats d'origine",
					"Listes de colisage",
					"Déclarations en douane",
				],
				modules: [
					{
						title:
							"Qu'est-ce que la documentation d'exportation et pourquoi est-elle importante",
						duration: "8 min",
						content: `Tout produit qui franchit une frontière internationale doit être accompagné d'un ensemble de documents officiels. Ces documents remplissent trois fonctions : identifier les marchandises, déclarer leur valeur et prouver leur origine. Sans eux, les expéditions sont bloquées en douane — parfois pendant des semaines.

En tant qu'artisan marocain vendant à des acheteurs européens ou du Golfe, vous devrez préparer quatre documents essentiels pour chaque commande :

**1. La Facture Commerciale**
C'est le document principal de toute transaction d'exportation. Votre facture doit inclure :
- Nom et adresse complets du vendeur et de l'acheteur
- Date et numéro unique de facture
- Description précise des marchandises ("Tapis berbère noué à la main, 200×300cm, teintures naturelles")
- Quantité et prix unitaire
- Valeur totale et devise (EUR ou USD)
- Conditions de paiement (ex. 50% à la commande, 50% à la livraison)
- Incoterms (ex. FOB Casablanca, CIF Marseille)

**2. La Liste de Colisage**
Complète la facture commerciale en détaillant le contenu physique de chaque colis — nombre de cartons, poids et dimensions.

**3. Le Certificat d'Origine**
Certifie que vos marchandises ont été fabriquées au Maroc. Il permet de bénéficier des tarifs préférentiels dans les pays ayant des accords commerciaux avec le Maroc, notamment l'Union Européenne.

**4. Le Connaissement / Lettre de Transport Aérien**
Émis par votre transitaire, ce document sert de reçu et de contrat de transport. Votre partenaire logistique le délivrera une fois les marchandises chargées.`,
					},
					{
						title: "Comment rédiger une facture commerciale correcte",
						duration: "12 min",
						content: `Une facture commerciale mal rédigée est la principale cause de retard en douane. Les douaniers français et allemands rejettent systématiquement les factures vagues ou incohérentes.

**Erreurs fréquentes à éviter :**

- Écrire "artisanat marocain" au lieu d'une description précise. Utilisez les codes du Système Harmonisé (SH) : **5701.10** pour les tapis noués, **5702.42** pour les tapis tissés.

- Indiquer un total global sans détail. Affichez toujours : prix unitaire × quantité = total ligne, puis sous-total, frais de transport, total général.

- Incohérence entre la facture et la liste de colisage.

- Omettre les Incoterms. Les plus courants pour les petits exportateurs :
  - **EXW** — l'acheteur organise tout depuis votre atelier
  - **FOB** — vous livrez au port, l'acheteur gère le fret maritime
  - **CIF** — vous couvrez le fret et l'assurance jusqu'au port de destination

**Conseil pratique :** Créez un modèle avec vos coordonnées pré-remplies. Pour chaque commande, il suffit de mettre à jour les informations de l'acheteur, la description et la valeur.`,
					},
					{
						title: "Obtenir votre Certificat d'Origine au Maroc",
						duration: "10 min",
						content: `Le Certificat d'Origine (CO) est délivré par la **Chambre de Commerce, d'Industrie et de Services (CCIS)** de votre région.

**Documents nécessaires :**
- Copie de votre facture commerciale
- Copie de votre registre de commerce ou attestation de coopérative
- Déclaration écrite attestant que les marchandises ont été produites au Maroc
- Formulaire de demande (disponible à la chambre)

**Délai de traitement :** 24 à 48 heures. Certaines chambres proposent un service le jour même.

**Coût :** Entre 150 et 300 MAD selon la chambre et la valeur de l'expédition.

**Le Certificat EUR.1**
Pour les acheteurs dans l'UE, vous aurez probablement besoin d'un certificat EUR.1, qui active les droits de douane préférentiels dans le cadre de l'Accord d'Association UE-Maroc. Il est délivré par l'ADII (douane marocaine). Demandez à votre transitaire de vous accompagner pour votre premier envoi.`,
					},
					{
						title: "Préparer votre liste de colisage étape par étape",
						duration: "8 min",
						content: `La liste de colisage est un inventaire physique de votre expédition. Les douaniers l'utilisent pour vérifier que ce qui est déclaré sur la facture correspond à ce qui est physiquement dans les cartons.

**Structure d'une bonne liste de colisage :**

| Colis # | Contenu | Qté | Poids Net | Poids Brut | Dimensions |
|---------|---------|-----|-----------|------------|------------|
| 1 | Tapis noué, réf. BRB-001 | 1 | 4,2 kg | 5,1 kg | 220×320×8 cm |
| 2 | Tapis noué, réf. BRB-002 | 1 | 3,8 kg | 4,7 kg | 200×300×7 cm |

**Règles essentielles :**
- Chaque colis doit être numéroté et correspondre à une ligne de votre liste
- Poids net = marchandises uniquement. Poids brut = marchandises + emballage
- Les dimensions indiquées sont celles du colis emballé, pas du produit
- Utilisez des unités cohérentes (kg, cm)

**Pour les tapis artisanaux :** Roulez serré, enveloppez dans du papier kraft puis du film polypropylène. Marquez chaque rouleau avec un numéro de référence correspondant à votre liste de colisage.`,
					},
				],
			},
			ar: {
				title: "فهم وثائق التصدير",
				description:
					"تعلّم الوثائق الأساسية لكل شحنة دولية — الفواتير التجارية، شهادات المنشأ، قوائم التعبئة، وكيفية إعدادها بشكل صحيح للأسواق الأوروبية وأسواق الخليج.",
				topics: [
					"الفواتير التجارية",
					"شهادات المنشأ",
					"قوائم التعبئة",
					"التصاريح الجمركية",
				],
				modules: [
					{
						title: "ما هي وثائق التصدير ولماذا هي مهمة",
						duration: "8 دقائق",
						content: `كل منتج يعبر حدوداً دولية يحتاج إلى مجموعة من الوثائق الرسمية. تؤدي هذه الوثائق ثلاث وظائف: تحديد البضائع، الإعلان عن قيمتها، وإثبات منشئها. بدونها، تُحتجز الشحنات في الجمارك — أحياناً لأسابيع.

بوصفك حرفياً مغربياً تبيع لمشترين أوروبيين أو خليجيين، ستحتاج عادةً إلى إعداد أربع وثائق أساسية لكل طلبية:

**1. الفاتورة التجارية**
هي الوثيقة الرئيسية في أي معاملة تصديرية. تعمل كإيصال وإعلان للقيمة في آنٍ واحد. يجب أن تتضمن:
- الاسم والعنوان الكاملان للبائع (أنت) والمشتري
- تاريخ الفاتورة ورقمها الفريد
- وصف دقيق للبضائع ("سجادة بربرية مربوطة يدوياً، 200×300سم، أصباغ طبيعية")
- الكمية والسعر الوحدوي
- القيمة الإجمالية والعملة (عادةً EUR أو USD)
- شروط الدفع (مثلاً: 50% عند الطلب، 50% عند التسليم)
- مصطلحات الشحن Incoterms (مثل FOB الدار البيضاء، CIF مرسيليا)

**2. قائمة التعبئة**
تكمّل الفاتورة التجارية بتفصيل المحتوى المادي لكل طرد — عدد الصناديق ووزنها وأبعادها.

**3. شهادة المنشأ**
تُثبت أن بضائعك صُنعت في المغرب. تفتح أمامك أسعار الجمارك التفضيلية في الدول التي تربطها اتفاقيات تجارية بالمغرب، وأبرزها الاتحاد الأوروبي.

**4. سند الشحن / بوليصة النقل الجوي**
تُصدره شركة الشحن أو الوكيل اللوجستي. لن تُعدّه بنفسك — سيُصدره شريكك اللوجستي بمجرد تحميل البضائع.`,
					},
					{
						title: "كيفية كتابة فاتورة تجارية صحيحة",
						duration: "12 دقيقة",
						content: `الفاتورة التجارية المكتوبة بشكل خاطئ هي السبب الأكثر شيوعاً لتأخر الشحنات في الجمارك. الجمارك الأوروبية صارمة جداً — موظفو الجمارك الفرنسيون والألمان يرفضون أي فاتورة غامضة أو غير متسقة.

**الأخطاء الشائعة التي يجب تجنبها:**

- كتابة "مصنوعات يدوية مغربية" عوضاً عن وصف دقيق. استخدم رموز النظام المنسّق (HS): **5701.10** للسجاد المعقود، **5702.42** للسجاد المنسوج.

- إدراج مجموع إجمالي دون تفصيل. اعرض دائماً: السعر الوحدوي × الكمية = المجموع الجزئي، ثم تكاليف الشحن، ثم الإجمالي الكلي.

- عدم توافق الفاتورة مع قائمة التعبئة.

- إغفال مصطلحات Incoterms. الأكثر شيوعاً للمصدّرين الصغار:
  - **EXW** — المشتري يتولى كل شيء من ورشتك
  - **FOB** — أنت تسلّم للميناء، المشتري يتولى الشحن البحري
  - **CIF** — أنت تغطي الشحن والتأمين حتى ميناء الوصول

**نصيحة عملية:** أنشئ نموذجاً جاهزاً ببياناتك الثابتة. لكل طلبية جديدة، غيّر فقط بيانات المشتري والوصف والقيمة. احتفظ بسجل مُرقَّم لجميع فواتيرك.`,
					},
					{
						title: "الحصول على شهادة المنشأ في المغرب",
						duration: "10 دقائق",
						content: `تُصدر شهادة المنشأ من **غرفة التجارة والصناعة والخدمات (CCIS)** في منطقتك.

**الوثائق المطلوبة:**
- نسخة من فاتورتك التجارية
- نسخة من سجلك التجاري أو وثائق التسجيل التعاوني
- تصريح خطي بأن البضائع مُنتَجة في المغرب
- استمارة الطلب (متوفرة في الغرفة أو موقعها الإلكتروني)

**مدة المعالجة:** 24 إلى 48 ساعة. تقدّم بعض الغرف خدمة في نفس اليوم.

**التكلفة:** بين 150 و300 درهم حسب الغرفة وقيمة الشحنة.

**شهادة EUR.1**
إذا كان مشتروك في الاتحاد الأوروبي، قد تحتاج أيضاً إلى شهادة EUR.1 التي تُفعّل الرسوم الجمركية التفضيلية بموجب اتفاقية الشراكة بين المغرب والاتحاد الأوروبي. تُصدرها إدارة الجمارك المغربية (ADII). اطلب من وكيلك الجمركي مرافقتك في أول شحنة.`,
					},
					{
						title: "إعداد قائمة التعبئة خطوة بخطوة",
						duration: "8 دقائق",
						content: `قائمة التعبئة هي جرد مادي لشحنتك. تستخدمها الجمارك للتحقق من أن ما هو مُعلَن في الفاتورة يطابق ما هو موجود فعلياً في الصناديق.

**هيكل قائمة التعبئة الجيدة:**

| رقم الطرد | المحتوى | الكمية | الوزن الصافي | الوزن الإجمالي | الأبعاد |
|-----------|---------|--------|--------------|----------------|---------|
| 1 | سجادة مربوطة، مرجع BRB-001 | 1 | 4.2 كغ | 5.1 كغ | 220×320×8 سم |
| 2 | سجادة مربوطة، مرجع BRB-002 | 1 | 3.8 كغ | 4.7 كغ | 200×300×7 سم |

**القواعد الأساسية:**
- يجب ترقيم كل طرد ليقابل سطراً في قائمتك
- الوزن الصافي = البضائع فقط. الوزن الإجمالي = البضائع + التغليف
- الأبعاد تُقاس على الطرد المعبّأ، لا على المنتج نفسه
- استخدم وحدات موحدة (كغ، سم)

**للسجاد الحرفي:** لفّه بإحكام، غلّفه بورق الكرافت ثم بالبولي بروبيلين. ضع على كل رول رقم مرجعي يطابق قائمتك.`,
					},
				],
			},
		},
	},
	{
		slug: "packaging-international-markets",
		tag: "Free — Open Access",
		duration: "30 min",
		level: "Beginner",
		students: "980",
		free: true,
		i18n: {
			en: {
				title: "Packaging for International Markets",
				description:
					"Discover how packaging decisions affect your product's chances of clearing customs and impressing buyers. Covers labelling standards, material requirements, and presentation for global retail.",
				topics: [
					"EU labelling standards",
					"Material compliance",
					"Retail packaging",
					"Barcode & traceability",
				],
				modules: [
					{
						title: "Why packaging is part of your export strategy",
						duration: "6 min",
						content: `Packaging is not just protection — for international buyers, it is part of the product. A beautifully crafted Moroccan rug that arrives in a damaged or unmarked roll signals that you are not ready for professional trade.

International buyers evaluate three things:

**1. Condition on arrival**
Was the product protected during transit? Handmade textiles are vulnerable to humidity, compression, and friction. Poor packaging causes fading, deformation, and smell — all of which trigger returns.

**2. Compliance**
Does the packaging and labelling meet the import country's requirements? EU regulations are particularly strict. Missing labels can cause customs to hold or return the entire shipment at your expense.

**3. Presentation**
Does the packaging reflect the value of the product? Premium buyers — galleries, interior designers, boutique retailers — sell the story of your craft alongside the product. A well-presented package reinforces that story.`,
					},
					{
						title: "EU labelling requirements for textile products",
						duration: "10 min",
						content: `If you are selling to any EU country, your textile products must comply with **EU Regulation No 1007/2011** on textile fibre names and labelling.

**What must appear on the label:**

1. **Fibre composition** — Declare the exact percentage of each fibre: "65% pure new wool, 35% cotton".

2. **Country of origin** — "Made in Morocco". Mandatory for textiles sold in the EU.

3. **Care instructions** — Standard ISO symbols (wash, bleach, iron, dry-clean icons).

4. **Importer or EU representative** — Name and address of the EU-based entity responsible for the product.

**Labels must be:**
- Permanently attached
- Written in the official language of the destination country
- Legible and durable — they must survive washing

**Common violation:** Writing "100% wool" when the product contains 10% synthetic binding threads. Customs labs can test fibre content. Always have your materials tested before your first export.`,
					},
					{
						title: "Protective packaging for handmade textiles",
						duration: "8 min",
						content: `Handmade rugs, blankets, and woven textiles require specific packaging to survive ocean freight or air cargo without damage.

**Recommended method for rugs:**

1. **Roll, do not fold** — Folding creates permanent creases in wool rugs. Always roll around a cardboard or PVC tube with the pile facing inward.

2. **Wrap in acid-free kraft paper** — Protects against humidity and prevents colour transfer.

3. **Overwrap in polypropylene film** — A final moisture barrier for ocean shipments.

4. **Label each roll** — Attach a hang tag with: your name, product reference, fibre content, country of origin.

5. **Box or pallet** — Use double-wall corrugated cardboard boxes. For large orders (10+ rugs), palletise and wrap with stretch film.

**Humidity warning:** If your workshop is near the Atlantic coast, condition packaged goods in a dry room for 48 hours before shipping.`,
					},
					{
						title: "Barcodes, traceability & retail-ready packaging",
						duration: "6 min",
						content: `If your buyer sells in a retail store or on e-commerce, they may require "retail ready" packaging that can go directly on a shelf.

**EAN Barcodes**
Retail buyers require a GS1 EAN-13 barcode on each product unit. To get barcodes:
1. Register with GS1 Morocco (gs1.org.ma) — approx. 2,000–5,000 MAD/year
2. Each unique product (different size, colour, reference) gets its own barcode
3. Print barcodes on your hang tags or adhesive labels

**Traceability tags**
nevali provides a digital certificate for verified artisans that buyers can link to your products — a significant competitive advantage over mass-produced alternatives.

**QR codes**
Add a QR code linking to your nevali artisan profile. This lets end consumers discover your story and craft process. Buyers love this — it adds perceived value without adding cost.`,
					},
				],
			},
			fr: {
				title: "L'Emballage pour les Marchés Internationaux",
				description:
					"Découvrez comment vos décisions d'emballage influencent vos chances de passer la douane et d'impressionner les acheteurs. Couvre les normes d'étiquetage, les exigences matérielles et la présentation pour la vente au détail mondiale.",
				topics: [
					"Normes d'étiquetage UE",
					"Conformité des matériaux",
					"Emballage retail",
					"Code-barres & traçabilité",
				],
				modules: [
					{
						title:
							"Pourquoi l'emballage fait partie de votre stratégie d'exportation",
						duration: "6 min",
						content: `L'emballage n'est pas seulement une protection — pour les acheteurs internationaux, il fait partie intégrante du produit. Un tapis marocain magnifiquement réalisé qui arrive dans un rouleau endommagé ou sans marquage indique que vous n'êtes pas prêt pour le commerce professionnel.

Les acheteurs internationaux évaluent trois points :

**1. L'état à la réception**
Le produit a-t-il été protégé pendant le transport ? Les textiles artisanaux sont vulnérables à l'humidité, à la compression et aux frottements. Un mauvais emballage provoque décoloration, déformation et odeurs — autant de raisons de retour.

**2. La conformité**
L'emballage et l'étiquetage respectent-ils les exigences du pays importateur ? Les réglementations européennes sont particulièrement strictes. Des étiquettes manquantes peuvent bloquer toute l'expédition à vos frais.

**3. La présentation**
L'emballage reflète-t-il la valeur du produit ? Les acheteurs premium — galeries, décorateurs d'intérieur, boutiques — vendent l'histoire de votre savoir-faire en même temps que le produit. Un emballage soigné renforce ce récit.`,
					},
					{
						title: "Exigences d'étiquetage UE pour les produits textiles",
						duration: "10 min",
						content: `Si vous vendez dans un pays de l'UE, vos produits textiles doivent être conformes au **Règlement UE n° 1007/2011** sur la dénomination et l'étiquetage des fibres textiles.

**Ce qui doit figurer sur l'étiquette :**

1. **Composition des fibres** — Déclarez le pourcentage exact de chaque fibre : "65% laine vierge, 35% coton".

2. **Pays d'origine** — "Fabriqué au Maroc". Obligatoire pour les textiles vendus dans l'UE.

3. **Conseils d'entretien** — Symboles ISO normalisés (lavage, blanchiment, repassage, nettoyage à sec).

4. **Importateur ou représentant UE** — Nom et adresse de l'entité européenne responsable du produit.

**Les étiquettes doivent être :**
- Fixées de façon permanente
- Rédigées dans la langue officielle du pays de destination
- Lisibles et durables — elles doivent résister au lavage

**Infraction courante :** Écrire "100% laine" alors que le produit contient 10% de fils synthétiques de liaison. Les laboratoires douaniers peuvent analyser la composition. Faites tester vos matériaux avant votre première exportation.`,
					},
					{
						title: "Emballage protecteur pour les textiles artisanaux",
						duration: "8 min",
						content: `Les tapis, couvertures et textiles tissés à la main nécessitent un emballage spécifique pour résister au fret maritime ou aérien sans dommage.

**Méthode recommandée pour les tapis :**

1. **Roulez, ne pliez pas** — Le pliage crée des plis permanents dans les tapis en laine. Roulez toujours autour d'un tube en carton ou PVC, poils vers l'intérieur.

2. **Enveloppez dans du papier kraft sans acide** — Protège contre l'humidité et empêche le transfert de couleurs.

3. **Suremballez avec un film polypropylène** — Barrière finale contre l'humidité pour les envois maritimes.

4. **Étiquetez chaque rouleau** — Attachez une étiquette avec : votre nom, référence produit, composition, pays d'origine.

5. **Cartons ou palette** — Utilisez des cartons en double cannelure. Pour les grandes commandes (+10 tapis), palettisez et filmez.

**Attention à l'humidité :** Si votre atelier est près de la côte atlantique, conditionnez vos produits emballés dans une pièce sèche pendant 48 heures avant l'expédition.`,
					},
					{
						title: "Codes-barres, traçabilité et emballage prêt pour la vente",
						duration: "6 min",
						content: `Si votre acheteur vend en magasin ou sur une plateforme e-commerce, il peut exiger un emballage "prêt à vendre" pouvant aller directement en rayon.

**Codes-barres EAN**
Les acheteurs retail exigent un code-barres GS1 EAN-13 sur chaque unité produit :
1. Inscrivez-vous auprès de GS1 Maroc (gs1.org.ma) — environ 2 000 à 5 000 MAD/an
2. Chaque produit unique (taille, couleur ou référence différente) a son propre code-barres
3. Imprimez les codes-barres sur vos étiquettes suspendues ou vos autocollants

**Étiquettes de traçabilité**
nevali fournit un certificat numérique aux artisans vérifiés que les acheteurs peuvent associer à vos produits — un avantage concurrentiel majeur face aux produits de masse.

**QR codes**
Ajoutez un QR code renvoyant vers votre profil artisan nevali. Les consommateurs finaux peuvent ainsi découvrir votre histoire et votre processus. Les acheteurs adorent cela — cela ajoute de la valeur perçue sans coût supplémentaire.`,
					},
				],
			},
			ar: {
				title: "التغليف للأسواق الدولية",
				description:
					"اكتشف كيف تؤثر قرارات التغليف على فرص اجتياز الجمارك وإعجاب المشترين. يشمل معايير الوسم، متطلبات المواد، وعرض المنتجات في تجارة التجزئة العالمية.",
				topics: [
					"معايير الوسم الأوروبية",
					"مطابقة المواد",
					"تغليف التجزئة",
					"الباركود والتتبع",
				],
				modules: [
					{
						title: "لماذا يُعدّ التغليف جزءاً من استراتيجية التصدير",
						duration: "6 دقائق",
						content: `التغليف ليس مجرد حماية — بالنسبة للمشترين الدوليين، هو جزء لا يتجزأ من المنتج نفسه. سجادة مغربية جميلة تصل في رول تالف أو غير مُوسوم تعطي انطباعاً بأنك لست مستعداً للتجارة الاحترافية.

يُقيّم المشترون الدوليون ثلاثة جوانب:

**1. حالة المنتج عند الاستلام**
هل حُمي المنتج أثناء النقل؟ المنسوجات اليدوية عرضة للرطوبة والضغط والاحتكاك. التغليف الرديء يُسبب الأضرار والروائح — وهذا يؤدي إلى الإرجاع.

**2. المطابقة للمعايير**
هل يستوفي التغليف والوسم متطلبات بلد الاستيراد؟ الأنظمة الأوروبية صارمة بشكل خاص. الوسم الناقص قد يؤدي إلى احتجاز الشحنة بالكامل على نفقتك.

**3. طريقة العرض**
هل يعكس التغليف قيمة المنتج؟ المشترون المتميزون — الغاليريات، المصممون، المحلات الراقية — يبيعون قصة حرفتك مع المنتج. التغليف الأنيق يُعزز هذه القصة.`,
					},
					{
						title: "متطلبات وسم منتجات النسيج في الاتحاد الأوروبي",
						duration: "10 دقائق",
						content: `إذا كنت تبيع في أي دولة أوروبية، يجب أن تمتثل منسوجاتك **للائحة الأوروبية رقم 1007/2011** المتعلقة بتسمية وسم ألياف المنسوجات.

**ما يجب أن يظهر على الوسم:**

1. **تركيب الألياف** — أعلن النسبة الدقيقة لكل ليف: "65% صوف خالص، 35% قطن".

2. **بلد المنشأ** — "صُنع في المغرب". إلزامي للمنسوجات المباعة في الاتحاد الأوروبي.

3. **تعليمات العناية** — الرموز القياسية ISO (الغسيل، التبييض، الكي، التنظيف الجاف).

4. **المستورد أو الممثل الأوروبي** — اسم وعنوان الجهة الأوروبية المسؤولة عن المنتج.

**يجب أن تكون الوسوم:**
- مثبتة بشكل دائم
- مكتوبة بلغة الدولة المستوردة
- واضحة ومتينة — يجب أن تتحمل الغسيل

**مخالفة شائعة:** كتابة "100% صوف" بينما المنتج يحتوي على 10% خيوط تثبيت صناعية. مختبرات الجمارك يمكنها تحليل تركيب الألياف. اختبر مواداك قبل أول تصدير.`,
					},
					{
						title: "التغليف الواقي للمنسوجات اليدوية",
						duration: "8 دقائق",
						content: `السجاد والبطانيات والمنسوجات المصنوعة يدوياً تحتاج تغليفاً خاصاً لتصل سليمة عبر الشحن البحري أو الجوي.

**الطريقة الموصى بها للسجاد:**

1. **اللف لا الطي** — الطي يخلق تجاعيد دائمة في سجاد الصوف. الفّ دائماً حول أنبوب كرتوني أو PVC مع توجيه الخيوط للداخل.

2. **التغليف بورق الكرافت غير الحمضي** — يحمي من الرطوبة ويمنع انتقال الألوان.

3. **التغليف الخارجي بفيلم البولي بروبيلين** — حاجز رطوبة إضافي للشحنات البحرية.

4. **وسم كل رول** — أرفق بطاقة تحتوي: اسمك، مرجع المنتج، التركيب، بلد المنشأ.

5. **الصناديق أو البالية** — استخدم كراتين مزدوجة الجدار. للطلبيات الكبيرة (+10 سجادات)، رتّب على بالية وغلّفها.

**تنبيه الرطوبة:** إذا كانت ورشتك قرب الساحل الأطلسي، أبقِ المنتجات المُغلَّفة في غرفة جافة 48 ساعة قبل الشحن.`,
					},
					{
						title: "الباركود والتتبع والتغليف الجاهز للبيع بالتجزئة",
						duration: "6 دقائق",
						content: `إذا كان مشتروك يبيع في متجر أو على منصة إلكترونية، قد يطلب تغليفاً "جاهزاً للعرض" يمكن وضعه مباشرة على الرف.

**الباركود EAN**
يُشترط من قبل مشتري التجزئة وجود باركود GS1 EAN-13 على كل وحدة منتج:
1. سجّل في GS1 المغرب (gs1.org.ma) — حوالي 2000 إلى 5000 درهم سنوياً
2. كل منتج فريد (حجم، لون، أو مرجع مختلف) يحصل على باركود خاص به
3. اطبع الباركود على بطاقات التعليق أو الملصقات

**وسوم التتبع**
توفر nevali شهادة رقمية للحرفيين الموثقين يمكن للمشترين ربطها بمنتجاتك — ميزة تنافسية كبيرة مقارنة بالمنتجات المصنّعة بكميات كبيرة.

**رموز QR**
أضف رمز QR يُحيل إلى ملفك الحرفي على nevali. يتيح ذلك للمستهلكين النهائيين اكتشاف قصتك وأسلوب عملك. المشترون يحبون هذا — يضيف قيمة مدركة دون تكلفة إضافية.`,
					},
				],
			},
		},
	},
];

export const FREE_COURSES = COURSES.filter((c) => c.free);

export const LOCKED_COURSES_DATA = [
	{
		slug: "eu-compliance-labelling",
		duration: "1h 10min",
		level: "Intermediate",
		title: "EU Compliance & Labelling Requirements",
		description:
			"REACH, GPSR, and cosmetics labelling basics for Moroccan brands exporting to France, Germany, and the UK—claims, INCI, and responsible documentation.",
	},
	{
		slug: "pricing-strategy-global-buyers",
		duration: "55 min",
		level: "Intermediate",
		title: "Pricing Strategy for Global Buyers",
		description:
			"How to price finished cosmetics for export, understand Incoterms, and protect margin when selling direct or through nevali checkout.",
	},
	{
		slug: "responding-to-rfqs",
		duration: "40 min",
		level: "Intermediate",
		title: "Fulfilling catalog orders on nevali",
		description:
			"Operate the partner workspace—read COD vs card rules, confirm stock, communicate shipping timelines, and keep buyers informed after checkout.",
	},
	{
		slug: "artisan-profile-brand-story",
		duration: "1h 20min",
		level: "Advanced",
		title: "Building your public brand & product story",
		description:
			"Turn heritage, formulation notes, and rituals into PDP copy buyers trust—photography, certifications, and tone for Moroccan cosmetics.",
	},
];
