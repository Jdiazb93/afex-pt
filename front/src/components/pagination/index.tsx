import React from "react";
import { motion } from "motion/react";
import Next from "@assets/icons/next.svg";
import Last from "@assets/icons/last.svg";

interface PaginationProps {
  page: number;
  totalPage: number;
  onChange?: (newPage: number) => void;
  disabled?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPage,
  onChange,
  disabled,
}) => {
  const goToPage = (newPage: number) => {
    if (onChange && newPage >= 1 && newPage <= totalPage) {
      onChange(newPage);
    }
  };

  const renderPages = () => {
    const pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPage, page + 2);

    if (page <= 3) {
      start = 1;
      end = Math.min(5, totalPage);
    } else if (page >= totalPage - 2) {
      end = totalPage;
      start = Math.max(1, totalPage - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: i === page ? 1.1 : 0.8 }}
          whileHover={{ scale: 1.1 }}
          key={i}
          className={`px-3 py-1 mx-1 rounded disabled:opacity-50 ${
            i === page
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:cursor-pointer"
          }`}
          onClick={() => goToPage(i)}
          disabled={disabled}
        >
          {i}
        </motion.button>
      );
    }

    return pages;
  };

  if (!totalPage) {
    return;
  }

  return (
    <div className="flex items-center justify-center space-x-1 mt-8">
      {/* Ir a la primera página */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 0.8 }}
        whileHover={{ scale: page === 1 || disabled ? 0.8 : 1.1 }}
        onClick={() => goToPage(1)}
        disabled={page === 1 || disabled}
        className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50 enabled:hover:cursor-pointer"
      >
        <img src={Last} alt="" className="rotate-180" />
      </motion.button>

      {/* Página anterior */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 0.8 }}
        whileHover={{ scale: page === 1 || disabled ? 0.8 : 1.1 }}
        onClick={() => goToPage(page - 1)}
        disabled={page === 1 || disabled}
        className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50 enabled:hover:cursor-pointer"
      >
        <img src={Next} alt="" className="rotate-180" />
      </motion.button>

      {/* Números de página */}
      {renderPages()}

      {/* Página siguiente */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 0.8 }}
        whileHover={{ scale: page === totalPage || disabled ? 0.8 : 1.1 }}
        onClick={() => goToPage(page + 1)}
        disabled={page === totalPage || disabled}
        className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50 enabled:hover:cursor-pointer"
      >
        <img src={Next} alt="" />
      </motion.button>

      {/* Ir a la última página */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 0.8 }}
        whileHover={{ scale: page === totalPage || disabled ? 0.8 : 1.1 }}
        onClick={() => goToPage(totalPage)}
        disabled={page === totalPage || disabled}
        className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50 enabled:hover:cursor-pointer"
      >
        <img src={Last} alt="" />
      </motion.button>
    </div>
  );
};
