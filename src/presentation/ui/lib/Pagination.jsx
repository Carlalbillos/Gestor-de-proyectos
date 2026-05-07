export const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <div className="flex justify-center mt-4 items-center gap-2">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="bg-primary mx-1 px-3 py-1 rounded disabled:opacity-50">
        Atrás
      </button>
      {pages.map((page) => (
        <button className={`mx-1 px-3 py-1 rounded-full ${page === currentPage ? "bg-primary" : "bg-gray-100"}`} key={page} onClick={() => onPageChange(page)} >
          {page}
        </button>
      ))}
      <button className="bg-primary mx-1 px-3 py-1 rounded disabled:opacity-50" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Adelante
      </button>
    </div>
  )
}

export default Pagination;