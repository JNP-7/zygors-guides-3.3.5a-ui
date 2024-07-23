import { Button, Dropdown, Pagination } from "react-bootstrap";

const MAX_PAGE_BUTTONS: number = 5;

export interface PaginatorProps {
  onSelectPage: (selectedPage: number) => void;
  currentPage: number;
  totalPages: number;
}

function Paginator({ totalPages, onSelectPage, currentPage }: PaginatorProps) {
  function buildPageItems(): JSX.Element[] {
    let pageElements: JSX.Element[] = [];

    if (totalPages <= MAX_PAGE_BUTTONS) {
      for (let i = 1; i <= totalPages; i++) {
        pageElements.push(
          <Pagination.Item
            as={Button}
            key={i}
            onClick={() => onSelectPage(i)}
            active={i === currentPage}
          >
            {i}
          </Pagination.Item>
        );
      }
    } else {
      let pageButtons: JSX.Element[] = [];
      for (
        let nextPageNumber = 1;
        nextPageNumber <= totalPages;
        nextPageNumber++
      ) {
        pageButtons.push(
          <Dropdown.Item
            on
            key={nextPageNumber}
            as={Button}
            onClick={() => onSelectPage(nextPageNumber)}
            active={currentPage === nextPageNumber}
          >
            {nextPageNumber}
          </Dropdown.Item>
        );
      }
      let dropdownElement: JSX.Element = (
        <Dropdown key="pageDropdownSelector">
          <Dropdown.Toggle>{currentPage}</Dropdown.Toggle>
          <Dropdown.Menu>{pageButtons}</Dropdown.Menu>
        </Dropdown>
      );
      pageElements.push(dropdownElement);
    }

    return pageElements;
  }

  return (
    <div className="row align-items-center steps-paginator">
      <p className="col-auto mb-0">
        Page {currentPage} of {totalPages}
      </p>
      <Pagination className="col-auto mb-0">
        <Pagination.First
          key={"first"}
          as={Button}
          onClick={() => {
            onSelectPage(1);
          }}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          key={"previous"}
          as={Button}
          disabled={currentPage === 1}
          onClick={() => {
            onSelectPage(currentPage - 1);
          }}
        />
        {buildPageItems()}
        <Pagination.Next
          key={"next"}
          as={Button}
          disabled={currentPage === totalPages}
          onClick={() => {
            onSelectPage(currentPage + 1);
          }}
        />
        <Pagination.Last
          key={"last"}
          as={Button}
          onClick={() => {
            onSelectPage(totalPages);
          }}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
}

export default Paginator;
