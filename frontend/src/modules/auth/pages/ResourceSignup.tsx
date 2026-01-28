import { useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, User, Building2, Phone, Mail, Eye, EyeOff, DollarSign, Tag, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import type { ResourceCategory, ResourceSignupData, ResourceSubType } from "@/types";

const ResourceSignup = () => {
    const navigate = useNavigate();
    const { category } = useParams<{ category: string }>();
    const [searchParams] = useSearchParams();
    const { signup, isLoading } = useAuthStore();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    // Get sub-type from URL query parameter
    const subType = searchParams.get("type") as ResourceSubType | null;

    // Convert URL param to ResourceCategory
    const resourceCategory: ResourceCategory =
        (category ? category.charAt(0).toUpperCase() + category.slice(1) : "Tenders") as ResourceCategory;

    const [formData, setFormData] = useState({
        name: "",
        organizationName: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        // Category-specific fields
        investmentAmount: "",
        investmentSector: [] as string[],
        equipmentTypes: [] as string[],
        machineryTypes: [] as string[],
        vehicleTypes: [] as string[],
        serviceArea: "",
        projectExperience: 0,
        certifications: [] as string[],
        tenderValue: "",
        tenderCategory: [] as string[],
    });

    const [tagInput, setTagInput] = useState("");

    const categoryConfig: Record<string, { title: string; fields: string[] }> = {
        investor: {
            title: subType === "want-to-invest" ? "Investor Signup" : "Seeking Investment",
            fields: ["investmentAmount", "investmentSector"],
        },
        tenders: {
            title: subType === "provide-tenders" ? "Post Tenders" : "Apply for Tenders",
            fields: subType === "provide-tenders"
                ? ["tenderValue", "tenderCategory"]
                : ["certifications", "projectExperience"],
        },
        equipments: {
            title: subType === "rent-out-equipment" ? "Rent Out Equipment" : "Rent Equipment",
            fields: ["equipmentTypes"],
        },
        machinery: {
            title: subType === "provide-machinery" ? "Provide Machinery" : "Need Machinery",
            fields: subType === "provide-machinery" ? ["machineryTypes"] : ["machineryTypes"],
        },
        pmc: {
            title: subType === "offer-pmc-services" ? "Offer PMC Services" : "Hire PMC",
            fields: ["projectExperience", "certifications"],
        },
        csm: {
            title: subType === "offer-csm-services" ? "Offer CSM Services" : "Hire CSM",
            fields: ["projectExperience", "certifications"],
        },
        logistics: {
            title: subType === "provide-logistics" ? "Provide Logistics" : "Need Logistics",
            fields: ["serviceArea", "vehicleTypes"],
        },
        vehicles: {
            title: subType === "rent-out-vehicles" ? "Rent Out Vehicles" : "Rent Vehicles",
            fields: ["vehicleTypes"],
        },
    };

    const config = categoryConfig[category?.toLowerCase() || ""] || { title: "Resource Signup", fields: [] };

    const handleAddTag = (field: "investmentSector" | "equipmentTypes" | "machineryTypes" | "vehicleTypes" | "certifications" | "tenderCategory") => {
        if (tagInput.trim()) {
            setFormData({
                ...formData,
                [field]: [...formData[field], tagInput.trim()],
            });
            setTagInput("");
        }
    };

    const handleRemoveTag = (field: "investmentSector" | "equipmentTypes" | "machineryTypes" | "vehicleTypes" | "certifications" | "tenderCategory", index: number) => {
        setFormData({
            ...formData,
            [field]: formData[field].filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.name || !formData.organizationName || !formData.phoneNumber || !formData.email) {
            setError("Please fill in all required fields");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!formData.password || formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const signupData: ResourceSignupData = {
                name: formData.name,
                organizationName: formData.organizationName,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                category: resourceCategory,
                // Store the appropriate sub-type based on category
                investorType: category === "investor" ? (subType as any) : undefined,
                tenderType: category === "tenders" ? (subType as any) : undefined,
                equipmentType: category === "equipments" ? (subType as any) : undefined,
                machineryType: category === "machinery" ? (subType as any) : undefined,
                pmcType: category === "pmc" ? (subType as any) : undefined,
                csmType: category === "csm" ? (subType as any) : undefined,
                logisticsType: category === "logistics" ? (subType as any) : undefined,
                vehicleType: category === "vehicles" ? (subType as any) : undefined,
                // Category-specific fields
                investmentAmount: formData.investmentAmount || undefined,
                investmentSector: formData.investmentSector.length > 0 ? formData.investmentSector : undefined,
                equipmentTypes: formData.equipmentTypes.length > 0 ? formData.equipmentTypes : undefined,
                machineryTypes: formData.machineryTypes.length > 0 ? formData.machineryTypes : undefined,
                vehicleTypes: formData.vehicleTypes.length > 0 ? formData.vehicleTypes : undefined,
                serviceArea: formData.serviceArea || undefined,
                projectExperience: formData.projectExperience || undefined,
                certifications: formData.certifications.length > 0 ? formData.certifications : undefined,
                tenderValue: formData.tenderValue || undefined,
                tenderCategory: formData.tenderCategory.length > 0 ? formData.tenderCategory : undefined,
                password: formData.password,
            };

            await signup(signupData, "resource");
            navigate("/resources");
        } catch (err) {
            setError("Failed to create account. Please try again.");
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-background flex flex-col justify-center p-6">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-full h-[400px] bg-gradient-to-b from-blue-500/10 to-transparent rounded-bl-[4rem] -z-10" />
            <div className="absolute bottom-20 -left-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />

            <div className="w-full max-w-[430px] mx-auto space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate(`/resources/${category}`)}
                    className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                    <div className="size-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
                        <ArrowLeft className="size-4" />
                    </div>
                    <span className="text-sm font-semibold">Back</span>
                </button>

                {/* Header */}
                <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="inline-flex items-center justify-center size-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl shadow-blue-500/20 mb-4 transform hover:scale-105 transition-transform duration-300">
                        <Building2 className="size-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{config.title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">
                        Create your account to access resources
                    </p>
                </div>

                {/* Form Card */}
                <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none p-6 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards delay-100">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Basic Fields */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Organization Name</label>
                            <div className="relative group">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    type="text"
                                    placeholder="Your Company/Organization"
                                    value={formData.organizationName}
                                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                                    className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    type="tel"
                                    placeholder="+91 987..."
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    type="email"
                                    placeholder="contact@organization.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        {/* Category-Specific Fields */}
                        {config.fields.includes("investmentAmount") && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    {subType === "want-to-invest" ? "Investment Budget" : "Funding Required"}
                                </label>
                                <div className="relative group">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <Input
                                        type="text"
                                        placeholder="₹10L - ₹50L"
                                        value={formData.investmentAmount}
                                        onChange={(e) => setFormData({ ...formData, investmentAmount: e.target.value })}
                                        className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        )}

                        {config.fields.includes("investmentSector") && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    {subType === "want-to-invest" ? "Investment Sectors" : "Business Sectors"}
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1 group">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                        <Input
                                            type="text"
                                            placeholder="e.g., Technology, Real Estate"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag("investmentSector"))}
                                            className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                        />
                                    </div>
                                    <Button type="button" onClick={() => handleAddTag("investmentSector")} className="h-14 px-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90">
                                        Add
                                    </Button>
                                </div>
                                {formData.investmentSector.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.investmentSector.map((sector, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold uppercase tracking-wider animate-in zoom-in-50"
                                            >
                                                {sector}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag("investmentSector", index)}
                                                    className="hover:text-red-500 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {config.fields.includes("tenderValue") && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Tender Value Range
                                </label>
                                <div className="relative group">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <Input
                                        type="text"
                                        placeholder="₹1Cr - ₹5Cr"
                                        value={formData.tenderValue}
                                        onChange={(e) => setFormData({ ...formData, tenderValue: e.target.value })}
                                        className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        )}

                        {config.fields.includes("tenderCategory") && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Tender Categories
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1 group">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                        <Input
                                            type="text"
                                            placeholder="e.g., Construction, IT"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag("tenderCategory"))}
                                            className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                        />
                                    </div>
                                    <Button type="button" onClick={() => handleAddTag("tenderCategory")} className="h-14 px-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90">
                                        Add
                                    </Button>
                                </div>
                                {formData.tenderCategory.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.tenderCategory.map((cat, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold uppercase tracking-wider animate-in zoom-in-50"
                                            >
                                                {cat}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag("tenderCategory", index)}
                                                    className="hover:text-red-500 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {config.fields.includes("machineryTypes") && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Machinery Types
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1 group">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                        <Input
                                            type="text"
                                            placeholder="e.g., Bulldozer, Loader"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag("machineryTypes"))}
                                            className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                        />
                                    </div>
                                    <Button type="button" onClick={() => handleAddTag("machineryTypes")} className="h-14 px-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90">
                                        Add
                                    </Button>
                                </div>
                                {formData.machineryTypes.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.machineryTypes.map((type, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold uppercase tracking-wider animate-in zoom-in-50"
                                            >
                                                {type}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag("machineryTypes", index)}
                                                    className="hover:text-red-500 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {config.fields.includes("equipmentTypes") && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Equipment/Machinery Types
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1 group">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                        <Input
                                            type="text"
                                            placeholder="e.g., Excavator, Crane"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag("equipmentTypes"))}
                                            className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                        />
                                    </div>
                                    <Button type="button" onClick={() => handleAddTag("equipmentTypes")} className="h-14 px-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90">
                                        Add
                                    </Button>
                                </div>
                                {formData.equipmentTypes.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.equipmentTypes.map((type, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold uppercase tracking-wider animate-in zoom-in-50"
                                            >
                                                {type}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag("equipmentTypes", index)}
                                                    className="hover:text-red-500 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {config.fields.includes("vehicleTypes") && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Vehicle Types
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1 group">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                        <Input
                                            type="text"
                                            placeholder="e.g., Truck, Tempo"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag("vehicleTypes"))}
                                            className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                        />
                                    </div>
                                    <Button type="button" onClick={() => handleAddTag("vehicleTypes")} className="h-14 px-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90">
                                        Add
                                    </Button>
                                </div>
                                {formData.vehicleTypes.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.vehicleTypes.map((type, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold uppercase tracking-wider animate-in zoom-in-50"
                                            >
                                                {type}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag("vehicleTypes", index)}
                                                    className="hover:text-red-500 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {config.fields.includes("serviceArea") && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Service Area
                                </label>
                                <div className="relative group">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <Input
                                        type="text"
                                        placeholder="e.g., Pan India, Maharashtra"
                                        value={formData.serviceArea}
                                        onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                                        className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        )}

                        {config.fields.includes("projectExperience") && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Years of Project Experience
                                </label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <Input
                                        type="number"
                                        placeholder="5"
                                        value={formData.projectExperience || ""}
                                        onChange={(e) => setFormData({ ...formData, projectExperience: parseInt(e.target.value) || 0 })}
                                        className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                        min="0"
                                        max="50"
                                    />
                                </div>
                            </div>
                        )}

                        {config.fields.includes("certifications") && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Certifications
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1 group">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                        <Input
                                            type="text"
                                            placeholder="e.g., ISO 9001, Safety Certified"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag("certifications"))}
                                            className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                        />
                                    </div>
                                    <Button type="button" onClick={() => handleAddTag("certifications")} className="h-14 px-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90">
                                        Add
                                    </Button>
                                </div>
                                {formData.certifications.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.certifications.map((cert, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold uppercase tracking-wider animate-in zoom-in-50"
                                            >
                                                {cert}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag("certifications", index)}
                                                    className="hover:text-red-500 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Password Fields */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <Eye className="size-5" />
                                </div>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 6 characters"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="pl-12 pr-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Confirm Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <Eye className="size-5" />
                                </div>
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Re-enter password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="pl-12 pr-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in zoom-in-95 duration-200">
                                <p className="text-sm text-red-600 dark:text-red-400 font-bold text-center">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 mt-4 rounded-2xl text-base font-bold tracking-wide bg-gradient-to-r from-blue-500 to-cyan-600 hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating Account...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </Button>

                        {/* Login Link */}
                        <div className="text-center pt-2 mt-4">
                            <p className="text-sm font-medium text-slate-500">
                                Already have an account?{" "}
                                <Link to="/login/resource" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ResourceSignup;
