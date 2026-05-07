export const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8 items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-30 mx-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
      >
        Anterior
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[40px] h-10 rounded-lg text-sm font-medium transition-all ${page === currentPage
                ? "bg-primary text-white shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-30 mx-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
      >
        Siguiente
      </button>
    </div>
  )
}

export default Pagination;