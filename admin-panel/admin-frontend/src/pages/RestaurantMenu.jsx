// src/pages/RestaurantMenu.jsx

import { useEffect, useState, useMemo } from "react";
import adminApi from "../api/adminApi";

import DishCard from "../components/DishCard";
import DishFilterBar from "../components/DishFilter";
import ModelUploadModal from "../components/ModelUploadModal.jsx";
import EditDishModal from "../components/EditDishModal";

export default function RestaurantMenu({ username, onBack }) {
  const [dishes, setDishes] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // GLB Upload
  const [selectedGlbDish, setSelectedGlbDish] = useState(null);
  const [glbFile, setGlbFile] = useState(null);
  const [uploadingGlb, setUploadingGlb] = useState(false);
  const [uploadProgressGlb, setUploadProgressGlb] = useState(0);

  // iOS Upload
  const [selectedIosDish, setSelectedIosDish] = useState(null);
  const [iosFile, setIosFile] = useState(null);
  const [uploadingIos, setUploadingIos] = useState(false);
  const [uploadProgressIos, setUploadProgressIos] = useState(0);

  // Edit / Delete
  const [editingDish, setEditingDish] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingDish, setDeletingDish] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* --------------------------------------
   * Load Menu using USERNAME
   -------------------------------------- */
  async function loadMenu() {
    try {
      const res = await adminApi.getMenuByUsername(username);

      setDishes(res.data?.dishes || []);
      setRestaurant(res.data?.restaurant || null);
    } catch (err) {
      console.error("Menu load failed:", err);
      alert("Failed to load menu.");
    }
  }

  useEffect(() => {
    loadMenu();
  }, [username]);

  /* --------------------------------------
   * Categories
   -------------------------------------- */
  const categories = useMemo(() => {
    const setCat = new Set();
    dishes.forEach((d) => d.category && setCat.add(d.category));
    return ["all", ...setCat];
  }, [dishes]);

  /* --------------------------------------
   * Filter + Sort
   -------------------------------------- */
  const filteredDishes = useMemo(() => {
    let data = [...dishes];

    if (selectedCategory !== "all") {
      data = data.filter((d) => d.category === selectedCategory);
    }

    switch (sortBy) {
      case "priceLow":
        data.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        data.sort((a, b) => b.price - a.price);
        break;
      case "category":
        data.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
        break;
      default:
        data.sort((a, b) => a.name.localeCompare(b.name));
    }

    return data;
  }, [dishes, selectedCategory, sortBy]);

  /* --------------------------------------
   * Upload GLB
   -------------------------------------- */
  async function handleUploadGlb() {
    if (!glbFile || !selectedGlbDish) return;

    try {
      setUploadingGlb(true);
      setUploadProgressGlb(0);

      await adminApi.uploadGLB(selectedGlbDish, glbFile);

      setUploadProgressGlb(100);

      setTimeout(() => {
        alert("GLB uploaded successfully!");
        setSelectedGlbDish(null);
        setGlbFile(null);
        loadMenu();
      }, 300);
    } catch (err) {
      console.error("GLB upload failed:", err);
      alert("GLB upload failed");
    } finally {
      setUploadingGlb(false);
    }
  }

  /* --------------------------------------
   * Upload iOS (USDZ)
   -------------------------------------- */
  async function handleUploadIos() {
    if (!iosFile || !selectedIosDish) return;

    try {
      setUploadingIos(true);
      setUploadProgressIos(0);

      await adminApi.uploadIOS(selectedIosDish, iosFile);

      setUploadProgressIos(100);

      setTimeout(() => {
        alert("iOS USDZ uploaded successfully!");
        setSelectedIosDish(null);
        setIosFile(null);
        loadMenu();
      }, 300);
    } catch (err) {
      console.error("iOS upload failed:", err);
      alert("iOS upload failed");
    } finally {
      setUploadingIos(false);
    }
  }

  /* --------------------------------------
   * Save Dish
   -------------------------------------- */
  async function handleSaveDish(updatedFields) {
    if (!editingDish) return;

    try {
      setSavingEdit(true);

      const res = await adminApi.updateDish(editingDish._id, updatedFields);

      if (res.data?.dish) {
        setDishes((prev) =>
          prev.map((d) => (d._id === res.data.dish._id ? res.data.dish : d))
        );
      }

      setEditingDish(null);
    } catch (err) {
      console.error("Dish update failed:", err);
      alert("Failed to update dish.");
    } finally {
      setSavingEdit(false);
    }
  }

  /* --------------------------------------
   * Delete Dish
   -------------------------------------- */
  async function handleConfirmDelete() {
    if (!deletingDish) return;

    try {
      setDeleting(true);

      await adminApi.deleteDish(deletingDish._id);

      setDishes((prev) => prev.filter((d) => d._id !== deletingDish._id));

      setDeletingDish(null);
    } catch (err) {
      console.error("Dish delete failed:", err);
      alert("Failed to delete dish.");
    } finally {
      setDeleting(false);
    }
  }

  /* --------------------------------------
   * Render UI
   -------------------------------------- */
  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-4">
        Menu for {restaurant?.restaurantName || username}
      </h2>

      <DishFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="space-y-3 mt-4">
        {filteredDishes.length === 0 && (
          <p className="text-gray-400">No dishes found.</p>
        )}

        {filteredDishes.map((dish) => (
          <DishCard
            key={dish._id}
            dish={dish}
            onUploadGlbClick={() => {
              setSelectedGlbDish(dish._id);
              setGlbFile(null);
            }}
            onUploadIosClick={() => {
              setSelectedIosDish(dish._id);
              setIosFile(null);
            }}
            onEditClick={() => setEditingDish(dish)}
            onDeleteClick={() => setDeletingDish(dish)}
          />
        ))}
      </div>

      {/* GLB Upload Modal */}
      {selectedGlbDish && (
        <ModelUploadModal
          title="Upload GLB Model"
          accept=".glb"
          uploading={uploadingGlb}
          uploadProgress={uploadProgressGlb}
          setFile={setGlbFile}
          onUpload={handleUploadGlb}
          onClose={() => {
            setSelectedGlbDish(null);
            setGlbFile(null);
          }}
        />
      )}

      {/* iOS Upload Modal */}
      {selectedIosDish && (
        <ModelUploadModal
          title="Upload iOS Model (.usdz)"
          accept=".usdz"
          uploading={uploadingIos}
          uploadProgress={uploadProgressIos}
          setFile={setIosFile}
          onUpload={handleUploadIos}
          onClose={() => {
            setSelectedIosDish(null);
            setIosFile(null);
          }}
        />
      )}

      {/* Edit Modal */}
      {editingDish && (
        <EditDishModal
          dish={editingDish}
          onClose={() => setEditingDish(null)}
          onSave={handleSaveDish}
          saving={savingEdit}
        />
      )}

      {/* Delete Confirmation */}
      {deletingDish && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded shadow-lg w-80 border border-zinc-700">
            <h3 className="text-lg font-bold mb-3">Delete Dish?</h3>
            <p className="text-sm mb-4">
              Are you sure you want to delete "{deletingDish.name}"?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingDish(null)}
                className="px-3 py-2 bg-zinc-700 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-3 py-2 bg-red-600 rounded disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
