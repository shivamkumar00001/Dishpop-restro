import React, { useState, memo, useRef } from "react";
import { Edit2, Trash2, Link as LinkIcon, RefreshCw, Loader2 } from "lucide-react";
import { STATUS_COLORS } from "../../utils/constants";

const DishCard = ({
  dish,
  onToggleAvailability,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  if (!dish) return null;

  const {
    name,
    description,
    imageUrl,
    category,
    price,
    available,
    status,
    preparationTime,
    tags,
    _id,
  } = dish;

  const safeTags = Array.isArray(tags) ? tags : [];
  const safeStatus = status || "Ready";
  const safeCategory = category || "Uncategorized";
  const safePrice = typeof price === "number" ? price : 0;

  const statusColor = STATUS_COLORS[safeStatus] || STATUS_COLORS["Ready"];

  /* ================= TOGGLE STATE ================= */
  const [toggling, setToggling] = useState(false);
  const [rollback, setRollback] = useState(false);
  const debounceRef = useRef(null);

  const handleToggle = () => {
    if (toggling) return;

    // debounce click
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setToggling(true);
      setRollback(false);

      try {
        await onToggleAvailability(_id);
      } catch {
        // rollback animation
        setRollback(true);
        setTimeout(() => setRollback(false), 300);
      } finally {
        setTimeout(() => setToggling(false), 300);
      }
    }, 150);
  };

  return (
    <div
      className={`bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 border 
      ${rollback ? "border-red-500 shake" : "border-gray-800"}
      transition-all`}
    >
      <div className="flex items-center gap-6">
        {/* IMAGE */}
        <div className="w-32 h-32 bg-gray-700 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* INFO */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-1">{name}</h3>
          <p className="text-gray-400 text-sm mb-2">{safeCategory}</p>
          <p className="text-gray-500 text-xs mb-3 line-clamp-2">
            {description || "No description"}
          </p>

          <div className="flex gap-2 flex-wrap">
            {safeTags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* PRICE + ACTIONS */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-500">
              ₹{safePrice.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {preparationTime ? `${preparationTime} mins` : "N/A"}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={onEdit} className="icon-btn">
              <Edit2 />
            </button>
            <button onClick={() => onDelete(_id)} className="icon-btn text-red-400">
              <Trash2 />
            </button>
            <button className="icon-btn">
              <LinkIcon />
            </button>
            <button onClick={() => onRefresh(_id)} className="icon-btn">
              <RefreshCw />
            </button>
          </div>

          <div
            className={`px-4 py-2 rounded-lg text-sm font-semibold 
            ${statusColor.bg} ${statusColor.text}`}
          >
            {safeStatus}
          </div>
        </div>

        {/* TOGGLE */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-gray-400">Available</span>

          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`relative w-14 h-7 rounded-full transition-all
              ${available ? "bg-blue-600" : "bg-gray-700"}
              ${toggling ? "opacity-70" : ""}`}
          >
            <div
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all
                ${available ? "translate-x-[28px]" : ""}
              `}
            />

            {toggling && (
              <Loader2 className="absolute inset-0 m-auto w-4 h-4 animate-spin text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(DishCard);
