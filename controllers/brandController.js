const Brand = require("../models/brandModel");
const Perfume = require("../models/perfumeModel");
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().populate("perfumes");
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.brandId).populate("perfumes");
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addBrand = async (req, res) => {
  try {
    const { brandName } = req.body;
    if (!brandName) {
      return res.status(400).json({ message: "Brand name is required" });
    }
    const newBrand = new Brand({ brandName });
    await newBrand.save();
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.brandId);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    const updateBrand = await Brand.findByIdAndUpdate(
      req.params.brandId,
      req.body
    );
    res.status(200).json(updateBrand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBrandById = async (req, res) => {
  try {
    const perfumes = await Perfume.find({ brand: req.params.brandId });
    if (perfumes.length > 0) {
      return res.status(400).json({
        message: "Cannot delete brand with associated perfumes",
      });
    }

    const brand = await Brand.findByIdAndDelete(req.params.brandId);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
