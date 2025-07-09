import Products from "../models/product.model.js";
import Categories from "../models/categorie.model.js";

export const getProducts = async (req, res) => {
  const { category, size, colors, gender, tags, minPrice, maxPrice } =
    req.query;

  try {
    const query = {};

    // Filter by category (one or more)
    if (category) {
      const categoryArray = category.split(",").map((id) => id.trim());
      query.category =
        categoryArray.length > 1 ? { $in: categoryArray } : categoryArray[0];
    }

    // Filter by size
    if (size) {
      query.size = { $in: size.split(",").map((s) => s.trim()) };
    }

    // Filter by colors inside variants
    if (colors) {
      query["variants.color"] = { $in: colors.split(",").map((c) => c.trim()) };
    }

    // Filter by tags
    if (tags) {
      query.tag = { $in: tags.split(",").map((t) => t.trim()) };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.$or = [
        {
          discountedPrice: {
            $gte: Number(minPrice) || 0,
            $lte: Number(maxPrice) || Infinity,
          },
        },
        {
          discountedPrice: null,
          price: {
            $gte: Number(minPrice) || 0,
            $lte: Number(maxPrice) || Infinity,
          },
        },
      ];
    }

    // Filter by gender (case-insensitive)
    if (gender) {
      const genderRegexArray = gender
        .split(",")
        .map((g) => new RegExp(`^${g.trim()}$`, "i"));

      const categories = await Categories.find({
        gender: { $in: genderRegexArray },
      }).select("_id");

      const genderCategoryIds = categories.map((cat) => cat._id);

      if (genderCategoryIds.length === 0) {
        return res.status(200).json([]);
      }

      // If category is also provided, intersect both
      if (query.category) {
        const selectedCategoryIds = Array.isArray(query.category?.$in)
          ? query.category.$in
          : [query.category];

        const filteredCategoryIds = selectedCategoryIds.filter((id) =>
          genderCategoryIds.some((genId) => genId.equals(id))
        );

        if (filteredCategoryIds.length === 0) {
          return res.status(200).json([]);
        }

        query.category = { $in: filteredCategoryIds };
      } else {
        // If no category provided, use all gender-matched categories
        query.category = { $in: genderCategoryIds };
      }
    }

    // Fetch final filtered products
    const products = await Products.find(query).populate("category");
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getProducts:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    discountedPrice,
    category,
    variants,
    size,
    tag,
  } = req.body;
  try {
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      throw new Error("At least one variant is required");
    }
    const processedVariants = variants.map((variant) => {
      if (
        !variant.color ||
        !Array.isArray(variant.images) ||
        variant.images.length === 0
      ) {
        throw new Error(
          "Each variant must have a color and at least one image"
        );
      }
      return {
        color: variant.color,
        images: variant.images.map((img) => ({
          url: img.url,
          publicId: img.publicId || null,
        })),
      };
    });

    const newProduct = new Products({
      name,
      description,
      price,
      discountedPrice,
      category,
      variants: processedVariants,
      size,
      tag,
    });
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    discountedPrice,
    category,
    variants,
    size,
    tag,
  } = req.body;
  try {
    const existingProduct = await Products.findById(id);
    if (!existingProduct)
      return res.status(404).json({ message: "Product not found" });

    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      throw new Error("At least one variant is required");
    }
    const processedVariants = variants.map((variant) => {
      if (
        !variant.color ||
        !Array.isArray(variant.images) ||
        variant.images.length === 0
      ) {
        throw new Error(
          "Each variant must have a color and at least one image"
        );
      }
      return {
        color: variant.color,
        images: variant.images.map((img) => ({
          url: img.url,
          publicId: img.publicId || null,
        })),
      };
    });

    const updatedProduct = await Products.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        discountedPrice,
        category,
        variants: processedVariants,
        size,
        tag,
      },
      { new: true, runValidators: true }
    ).populate("category");

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Products.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Note: Skipping Cloudinary image deletion due to missing API secret
    await Products.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteImage = async (req, res) => {
  const { productId, publicId } = req.body;
  try {
    await Products.updateOne(
      { _id: productId },
      { $pull: { "variants.$[].images": { publicId } } }
    );
    // Note: Skipping Cloudinary image deletion due to missing API secret
    res.status(200).json({ message: "Image reference removed from product" });
  } catch (error) {
    console.error("Error in deleteImage:", error);
    res.status(400).json({ message: error.message });
  }
};
