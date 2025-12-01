import "./sidebar.style.css";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockList = [
  {
    id: "patrimonios",
    name: "Patrimônios",
    items: [
      { id: "item-mesa", name: "mesa" },
      { id: "item-cadeira", name: "cadeira" },
    ],
  },
  {
    id: "almoxarifado",
    name: "Almoxarifado",
    items: [
      { id: "item-arroz", name: "arroz" },
      { id: "item-feijao", name: "feijao" },
    ],
  },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState([]);
  const navigate = useNavigate();

  const sidebarRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleExpand = (categoryId) => {
    setExpanded((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="container">
      <button
        className="hamburger"
        ref={buttonRef}
        onClick={() => setOpen(!open)}
      >
        <Menu size={24} />
      </button>

      <nav ref={sidebarRef} className={`sidebar ${open ? "open" : ""}`}>
        <ul>
          {mockList.map((cat) => (
            <li key={cat.id} className="category">
              <div
                className="category-header"
                onClick={() => navigate(`/${cat.id}`)}
              >
                <span>{cat.name}</span>
                <button
                  className="expand-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(cat.id);
                  }}
                >
                  {expanded.includes(cat.id) ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
              </div>

              {expanded.includes(cat.id) && (
                <ul className="sub-items">
                  {cat.items.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => navigate(`/${cat.id}/${item.id}`)}
                      className="sub-item"
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
