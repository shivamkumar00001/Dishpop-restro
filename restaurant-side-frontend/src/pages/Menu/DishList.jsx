import React, { useState } from "react";
import { Plus, Menu, ChefHat, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import DishCard from "../../components/menu/DishCard.jsx";
import DishFilterBar from "../../components/menu/DishFilterBar.jsx";
import useMenu from "../../hooks/useMenu.js";
import Sidebar from "../../components/Sidebar.jsx";

const DishList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const { username } = useParams();

  const {
    dishes,
    filteredDishes,
    categories,
    statuses,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    toggleAvailability,
    deleteDish,
    clearFilters,
  } = useMenu();

  const handleAddNewDish = () => {
    navigate(`/${username}/menu/add`);
  };

  const handleEdit = (dish) => {
    navigate(`/${username}/dish/${dish._id}/edit`);
  };

  const handleRefresh = () => {
    alert("Refresh feature coming soon");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="border-b border-gray-800 sticky top-0 bg-black z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-blue-500">
                ARMenu Manager
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <div
          className={`fixed lg:static inset-y-0 left-0 z-50 transform
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="relative h-full">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white lg:hidden"
            >
              <X className="w-6 h-6" />
            </button>
            <Sidebar />
          </div>
        </div>

        {/* MAIN */}
        <main className="flex-1 p-4 md:p-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Dish List</h2>
            <button
              onClick={handleAddNewDish}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Dish
            </button>
          </div>

          {/* FILTERS */}
          <DishFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            statuses={statuses}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
            clearFilters={clearFilters}
            dishCount={filteredDishes.length}
            totalCount={dishes.length}
          />

          {/* LIST */}
          <div className="space-y-4">
            {filteredDishes.length === 0 ? (
              <div className="text-center py-16 bg-gray-900 rounded-xl border border-gray-800">
                <p className="text-gray-400">No dishes found</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-gray-700 rounded-lg"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredDishes.map((dish) => (
                <DishCard
                  key={dish._id}
                  dish={dish}
                  onToggleAvailability={toggleAvailability}
                  onEdit={() => handleEdit(dish)}
                  onDelete={deleteDish}
                  onRefresh={() => handleRefresh(dish._id)}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DishList;
