const Brand = require("../models/brandModel");
const Perfume = require("../models/perfumeModel");
exports.getAllPerfumes = async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const allPerfumes = await Perfume.find({
      perfumeName: { $regex: searchQuery, $options: "i" },
    }).populate("brand");

    // const perfumes = await Perfume.find().populate("brand");
    res.status(200).json(allPerfumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPerfumeById = async (req, res) => {
  try {
    const perfume = await Perfume.findById(req.params.perfumeId)
      .populate("brand")
      .populate("comments.author");

    if (!perfume) {
      return res.status(404).json({ message: "Perfume not found" });
    }
    res.status(200).json(perfume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePerfumeById = async (req, res) => {
  try {
    const perfume = await Perfume.findByIdAndDelete(req.params.perfumeId);
    if (!perfume) {
      return res.status(404).json({ message: "Perfume not found" });
    }
    res.status(200).json({ message: "Perfume deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addPerfume = async (req, res) => {
  try {
    const {
      perfumeName,
      uri,
      price,
      concentration,
      ingredients,
      description,
      volume,
      targetAudience,
      brandId,
    } = req.body;
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    const newPerfume = new Perfume({
      perfumeName,
      uri,
      price,
      concentration,
      ingredients,
      description,
      volume,
      targetAudience,
      brand: brandId,
    });
    await newPerfume.save();

    brand.perfumes.push(newPerfume._id);
    await brand.save();

    res.status(201).json(newPerfume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePerfumeById = async (req, res) => {
  try {
    const {
      perfumeName,
      uri,
      price,
      concentration,
      ingredients,
      description,
      volume,
      targetAudience,
      brandId,
    } = req.body;
    const perfume = await Perfume.findById(req.params.perfumeId);
    if (!perfume) {
      return res.status(404).json({ message: "Perfume not found" });
    }
    const brand = await Brand.findById(brandId);
    if (brandId && brandId !== perfume.brand.toString()) {
      const oldBrand = await Brand.findById(perfume.brand);
      const newBrand = await Brand.findById(brandId);
      if (!newBrand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      oldBrand.perfumes.pull(perfume._id);
      await oldBrand.save();

      newBrand.perfumes.push(perfume._id);
      await newBrand.save();

      perfume.brand = brandId;
    }

    perfume.perfumeName = perfumeName;
    perfume.uri = uri;
    perfume.price = price;
    perfume.concentration = concentration;
    perfume.ingredients = ingredients;
    perfume.description = description;
    perfume.volume = volume;
    perfume.targetAudience = targetAudience;

    await perfume.save();
    res.status(200).json(perfume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.postCommentRatingOnPerfume = async (req, res) => {
  try {
    const { userId } = req.body;
    const perfume = await Perfume.findById(req.params.perfumeId);
    if (!perfume) {
      return res.status(404).send("Perfume not found");
    }

    // Check if the member has already commented on this perfume
    const existingComment = perfume.comments.find((comment) =>
      comment.author.equals(userId)
    );
    if (existingComment) {
      return res.status(400).send("You have already commented on this perfume");
    }
    // Add the new comment
    const newComment = {
      rating: req.body.rating,
      content: req.body.content,
      author: userId,
    };
    perfume.comments.push(newComment);
    await perfume.save();

    return res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
