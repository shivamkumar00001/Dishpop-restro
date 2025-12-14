// import {
//   HomeIcon,
//   CubeIcon,
//   ClipboardDocumentListIcon,
//   BellIcon,
//   XMarkIcon,
//   Cog6ToothIcon,
//   QrCodeIcon,
// } from "@heroicons/react/24/outline";
// import { useState, useEffect } from "react";
// import { Link, useParams, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Sidebar() {
//   const [open, setOpen] = useState(false);
//   const { username } = useParams();
//   const location = useLocation();

//   const { owner } = useAuth();
//   const ownerName = owner?.ownerName || "Loading...";

//   const getInitials = (name) =>
//     name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase();

//   const initials = owner ? getInitials(ownerName) : "…";

//   useEffect(() => {
//     const handleOpenSidebar = () => setOpen(true);
//     document.addEventListener("openSidebar", handleOpenSidebar);
//     return () =>
//       document.removeEventListener("openSidebar", handleOpenSidebar);
//   }, []);

//   const base = `/${username}`;

//   const menuItems = [
//     { name: "Dashboard", icon: HomeIcon, path: `${base}/dashboard` },
//     { name: "Digital Menu", icon: CubeIcon, path: `${base}/dishes` },
//     { name: "Orders", icon: ClipboardDocumentListIcon, path: `${base}/orders` },
//     { name: "Get QR", icon: QrCodeIcon, path: `${base}/qr` },
//     { name: "Subscribe", icon: BellIcon, path: `${base}/subscribe` },
//     { name: "Settings", icon: Cog6ToothIcon, path: `/settings` },
//   ];

//   return (
//     <>
//       {/* Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 w-60 bg-[#11151c]
//         min-h-screen h-auto
//         p-4 flex flex-col z-50
//         transition-transform duration-300
//         ${open ? "translate-x-0" : "-translate-x-full"}
//         lg:static lg:translate-x-0`}
//       >
//         {/* Mobile Close */}
//         <button
//           className="lg:hidden text-white mb-4 self-end"
//           onClick={() => setOpen(false)}
//         >
//           <XMarkIcon className="w-6 h-6" />
//         </button>

//         {/* Menu */}
//         <ul className="space-y-2 flex-1 overflow-y-auto">
//           {menuItems.map(({ name, icon: Icon, path }) => {
//             const isActive = location.pathname === path;
//             return (
//               <Link to={path} key={name}>
//                 <li
//                   className={`flex items-center gap-3 p-3 rounded-lg
//                   text-sm cursor-pointer transition-colors
//                   ${
//                     isActive
//                       ? "bg-[#3B82F6] text-white"
//                       : "text-gray-300 hover:bg-[#293042]"
//                   }`}
//                 >
//                   <Icon className="w-5 h-5" />
//                   {name}
//                 </li>
//               </Link>
//             );
//           })}
//         </ul>

//         {/* Owner Info */}
//         <div className="flex items-center gap-3 p-3 bg-[#293042] rounded-lg mt-4">
//           <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
//             {initials}
//           </div>
//           <div>
//             <p className="text-sm font-medium text-white">{ownerName}</p>
//             <p className="text-xs text-gray-400">Restaurant Owner</p>
//           </div>
//         </div>
//       </aside>

//       {/* Mobile Overlay */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-black/50 lg:hidden z-40"
//           onClick={() => setOpen(false)}
//         />
//       )}
//     </>
//   );
// }
import {
  HomeIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  XMarkIcon,
  Cog6ToothIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { username } = useParams();
  const location = useLocation();

  const { owner } = useAuth() || {};
  const ownerName = owner?.ownerName ?? "Restaurant";

  /* ------------------ UTIL FUNCTIONS ------------------ */
  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "R";

  /* ------------------ OPEN SIDEBAR EVENT ------------------ */
  useEffect(() => {
    const openHandler = () => setOpen(true);
    document.addEventListener("openSidebar", openHandler);
    return () => document.removeEventListener("openSidebar", openHandler);
  }, []);

  /* ------------------ MENU CONFIG ------------------ */
  const basePath = username ? `/${username}` : "";

  const menuItems = [
    { label: "Dashboard", icon: HomeIcon, path: `${basePath}/dashboard` },
    { label: "Digital Menu", icon: CubeIcon, path: `${basePath}/dishes` },
    { label: "Orders", icon: ClipboardDocumentListIcon, path: `${basePath}/orders` },
    { label: "Get QR", icon: QrCodeIcon, path: `${basePath}/qr` },
    { label: "Subscribe", icon: BellIcon, path: `${basePath}/subscribe` },
    { label: "Settings", icon: Cog6ToothIcon, path: `/settings` },
  ];

  /* ------------------ RENDER ------------------ */
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 bg-[#11151c]
        min-h-screen h-auto
        p-4 flex flex-col
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0`}
      >
        {/* Mobile Close */}
        <button
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
          className="lg:hidden mb-4 self-end text-white"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map(({ label, icon: Icon, path }) => {
              const active = location.pathname === path;
              return (
                <li key={label}>
                  <Link
                    to={path}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-lg p-3 text-sm
                    transition-colors
                    ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-[#293042]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer / Owner Info */}
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-[#293042] p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
            {getInitials(ownerName)}
          </div>
          <div className="truncate">
            <p className="text-sm font-medium text-white truncate">
              {ownerName}
            </p>
            <p className="text-xs text-gray-400">Restaurant Owner</p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
