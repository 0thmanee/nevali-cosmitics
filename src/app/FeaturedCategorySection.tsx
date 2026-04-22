import { listFeaturedHomeProductSamplesByCategoryRepo } from "~/app/api/products/repo/products.repo";
import { FeaturedCategorySectionClient } from "./FeaturedCategorySectionClient";

export default async function FeaturedCategorySection() {
  const samples = await listFeaturedHomeProductSamplesByCategoryRepo().catch(
    () => ({}),
  );
  return <FeaturedCategorySectionClient samples={samples} />;
}
