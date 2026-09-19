const SavedPlan = require('../models/mysql/SavedPlan');

exports.createSavedPlan = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, planData } = req.body;

        if (!planData) {
            return res.status(400).json({ message: "Missing plan data" });
        }

        const savedPlan = await SavedPlan.create({
            userId,
            title: title || `Plan - ${new Date().toLocaleDateString()}`,
            planData,
        });

        return res.status(201).json(savedPlan);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to save plan" });
    }
};

exports.getMySavedPlans = async (req, res) => {
    try {
        const userId = req.user.id;

        const plans = await SavedPlan.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json(plans);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to fetch saved plans" });
    }
};

exports.deleteSavedPlan = async (req, res) => {
    try {
        const userId = req.user.id;
        const isAdmin = req.user.role === "admin";
        const { id } = req.params;

        const plan = await SavedPlan.findByPk(id);

        if (!plan) return res.status(404).json({ message: "Saved plan not found" });

        if (plan.userId !== userId && !isAdmin)
            return res.status(403).json({ message: "Not your saved plan" });

        await plan.destroy();

        return res.status(200).json({ message: "Saved plan deleted" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to delete saved plan" });
    }
};
