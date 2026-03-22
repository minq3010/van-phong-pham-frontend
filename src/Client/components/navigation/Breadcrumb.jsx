import { Link } from "react-router-dom";

const Breadcrumb = ({ items = [] }) => {
  if (!items.length) {
    return null;
  }

  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-blue-600">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.to && !isLast ? (
                <Link to={item.to} className="hover:text-blue-800">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-blue-900" : ""}>{item.label}</span>
              )}
              {!isLast && <i className="fa-solid fa-chevron-right text-[10px]" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
