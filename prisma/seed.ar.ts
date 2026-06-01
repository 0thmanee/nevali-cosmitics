/**
 * Arabic seed wrapper:
 * 1) runs the default seed to create the full demo dataset
 * 2) localizes seeded copy fields to Arabic
 *
 * Run: pnpm tsx prisma/seed.ar.ts
 */

import "dotenv/config";
import { execSync } from "node:child_process";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString }),
	log: ["error", "warn"],
});

const ORG_SLUG = "nevali-cosmetics";
const PARTNER_EMAIL = "studio@nevali-cosmetics.local";

const PRODUCT_COPY: Record<
	string,
	{ name: string; category: string; description: string }
> = {
	"Cold-pressed argan oil — signature": {
		name: "زيت الأرغان المعصور على البارد — الإصدار المميز",
		category: "زيوت نباتية",
		description:
			"زيت أرغان أحادي المصدر من سوس، بعصر بارد بطيء واختبارات مخبرية. مناسب للاستخدام اليومي للوجه وأطراف الشعر والعناية بالجلد المحيط بالأظافر.",
	},
	"Prickly pear seed oil": {
		name: "زيت بذور التين الشوكي",
		category: "زيوت نباتية",
		description:
			"تركيبة دهنية نادرة تساعد على دعم حاجز البشرة ومنحها إشراقة. يُستخدم مساءً كسيروم أو يُمزج مع الكريم.",
	},
	"Damask rose water mist": {
		name: "رذاذ ماء الورد الدمشقي",
		category: "العناية بالبشرة",
		description:
			"ماء ورد مقطر بالبخار لإنعاش البشرة، تثبيت المكياج، أو الترطيب السريع خلال اليوم.",
	},
	"Ghassoul clay mask — weekly reset": {
		name: "قناع الغاسول — تجديد أسبوعي",
		category: "الحمام والعناية بالجسم",
		description:
			"مزيج من الطين البركاني لفروة الرأس والجسم. يُخلط مع ماء الورد للحصول على قوام ناعم.",
	},
	"Beldi black soap — eucalyptus": {
		name: "الصابون البلدي الأسود — الأوكالبتوس",
		category: "الحمام والعناية بالجسم",
		description:
			"صابون تقليدي بعجينة الزيتون للتقشير في الحمام المغربي. يُستخدم مع قفاز الكيسة.",
	},
	"Argan & rhassoul hair mask": {
		name: "ماسك الشعر بالأرغان والغاسول",
		category: "العناية بالشعر",
		description:
			"علاج أسبوعي للشعر الجاف والمصبوغ. يُشطف جيدًا ويُترك ليجف طبيعيًا.",
	},
	"Neroli night serum": {
		name: "سيروم النيرولي الليلي",
		category: "العناية بالبشرة",
		description: "سيروم زيتي خفيف بالنيرولي والسكوالان لإشراقة ليلية.",
	},
	"SPF 50 mineral day cream": {
		name: "كريم نهاري معدني SPF 50",
		category: "العناية بالبشرة",
		description:
			"حماية واسعة الطيف بتركيبة معدنية مع لمسة لونية خفيفة تناسب الدرجات الفاتحة إلى المتوسطة.",
	},
	"Kessa exfoliating glove": {
		name: "قفاز الكيسة للتقشير",
		category: "أدوات وإكسسوارات",
		description: "نسيج تقليدي أصيل لتقشير الحمام المغربي بعد الصابون البلدي.",
	},
	"Kohl pencil — mineral brown": {
		name: "قلم كحل — بني معدني",
		category: "المكياج",
		description: "قلم ناعم مستوحى من الكحل التقليدي ومختبر من ناحية السلامة.",
	},
	"Orange blossom eau fraîche": {
		name: "ماء زهر منعش",
		category: "العطور",
		description: "رذاذ زهري حمضي للشعر ومنطقة الرقبة بتركيبة خالية من الكحول.",
	},
	"Rhassoul volumizing shampoo": {
		name: "شامبو الغاسول لتكثيف الشعر",
		category: "العناية بالشعر",
		description:
			"تنظيف لطيف خالٍ من السلفات مع الغاسول والبانثينول للشعر الخفيف.",
	},
	"Prickly pear day cream": {
		name: "كريم نهاري بالتين الشوكي",
		category: "العناية بالبشرة",
		description: "كريم نهاري بملمس مطفي مع مستخلص التين الشوكي وسيراميد NP.",
	},
	"Amber & musk hair perfume": {
		name: "عطر الشعر بالعنبر والمسك",
		category: "الشعر والعطور",
		description: "رذاذ شعر خالٍ من السيليكون بنفحات عنبر دافئة ومسك ناعم.",
	},
	"Shea & argan body butter": {
		name: "زبدة الجسم بالشيا والأرغان",
		category: "العناية بالجسم",
		description:
			"تركيبة غنية للمناطق الجافة مثل المرفقين والركبتين وبعد التعرض للشمس.",
	},
	"Vitamin C radiance serum": {
		name: "سيروم فيتامين C للإشراقة",
		category: "العناية بالبشرة",
		description:
			"15% فيتامين C مشتق بقاعدة مرطبة. يُستخدم صباحًا قبل واقي الشمس.",
	},
	"Argan lip balm — mint": {
		name: "مرطب شفاه بالأرغان — نعناع",
		category: "المكياج",
		description: "مرطب شفاف بزيت الأرغان المعصور على البارد ولمسة نعناع.",
	},
	"Jasmine hair veil": {
		name: "رذاذ شعر بالياسمين",
		category: "الشعر والعطور",
		description: "رذاذ خفيف للأطوال يمكن تنسيقه مع ماء زهر البرتقال.",
	},
	"Rose ghassoul body paste": {
		name: "معجون جسم بالغاسول والورد",
		category: "الحمام والعناية بالجسم",
		description: "معجون جاهز مع خلاصة الورد لتجربة حمام سريعة في المنزل.",
	},
	"Biotin beauty gummies": {
		name: "علكات بيوتين للجمال",
		category: "المكملات",
		description: "بيوتين وزنك بنكهة التوت — عبوة تكفي لمدة 30 يومًا.",
	},
	"Shimmer dry oil — golden": {
		name: "زيت جاف لامع — ذهبي",
		category: "العناية بالجسم",
		description: "زيت جاف حريري بلمعة خفيفة للساقين والكتفين.",
	},
	"Micellar cleansing water": {
		name: "ماء ميسيلار للتنظيف",
		category: "العناية بالبشرة",
		description: "يزيل واقي الشمس والمكياج الخفيف بلطف دون فرك قوي.",
	},
	"Brow gel — clear": {
		name: "جل حواجب — شفاف",
		category: "المكياج",
		description: "ثبات مرن للحواجب دون تقشر.",
	},
	"Amlou spread — argan & almond": {
		name: "أملو بالأرغان واللوز",
		category: "زيوت نباتية",
		description: "مزيج تقليدي من الأرغان واللوز والعسل بإنتاج محدود.",
	},
};

async function main() {
	console.log("→ Running base seed first...");
	execSync("pnpm tsx prisma/seed.ts", { stdio: "inherit" });

	const org = await prisma.organization.findUnique({
		where: { slug: ORG_SLUG },
	});
	if (!org) throw new Error("Seed org not found after base seed run.");

	await prisma.organization.update({
		where: { id: org.id },
		data: { name: "نيفالي" },
	});

	await prisma.user.update({
		where: { email: PARTNER_EMAIL },
		data: { name: "زينب بدر" },
	});

	const partner = await prisma.user.findUnique({
		where: { email: PARTNER_EMAIL },
	});
	if (partner) {
		await prisma.profile.updateMany({
			where: { userId: partner.id },
			data: {
				firstName: "ياسمين",
				lastName: "الإدريسي",
				entityType: "شركة حرفية",
				region: "الدار البيضاء - سطات",
				city: "الدار البيضاء",
				publicTagline:
					"مختبر مغربي بمعايير عالمية — تركيبات قابلة للتتبع من الدار البيضاء.",
				businessDescription:
					"نيفالي تطور وتعبئ منتجات العناية بالبشرة والشعر والجسم بمكونات مغربية فعالة مثل الأرغان والغاسول والورد والتين الشوكي.",
				exportMarkets:
					"الاتحاد الأوروبي، المملكة المتحدة، دول الخليج، أمريكا الشمالية",
				valuesHighlight:
					"بحث وتطوير تقوده النساء · إنتاج متوافق مع HACCP · شفافية المكونات",
			},
		});
	}

	for (const [englishName, ar] of Object.entries(PRODUCT_COPY)) {
		await prisma.product.updateMany({
			where: { organizationId: org.id, name: englishName },
			data: {
				name: ar.name,
				category: ar.category,
				description: ar.description,
			},
		});
	}

	await prisma.producerArticle.updateMany({
		where: { organizationId: org.id },
		data: { tag: "محتوى" },
	});

	await prisma.productReview.updateMany({
		where: { product: { organizationId: org.id } },
		data: {
			title: "منتج ممتاز",
			body: "جودة رائعة وتجربة استخدام مريحة جدًا.",
		},
	});

	console.log("✓ Arabic seed overlay complete");
	console.log("  Products and key profile/content fields localized to Arabic.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => {
		void prisma.$disconnect();
	});
