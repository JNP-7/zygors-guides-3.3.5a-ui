import { Button, Pagination } from "react-bootstrap";

const SHOW_DROPDOWN_ELLIPSIS_BREAKPOINT: number = 4;

export interface PaginatorProps {
  onSelectPage: (selectedPage: number) => void;
  currentPage: number;
  totalPages: number;
}

function Paginator({ totalPages, onSelectPage, currentPage }: PaginatorProps) {
  function buildPageItems(): JSX.Element[] {
    let pageElements: JSX.Element[] = [];
    let showDropdowns: boolean =
      totalPages > SHOW_DROPDOWN_ELLIPSIS_BREAKPOINT * 2 + 1;
    let showLeftDropdown: boolean =
      showDropdowns && currentPage - SHOW_DROPDOWN_ELLIPSIS_BREAKPOINT > 1;
    let showRightDropdown: boolean =
      showDropdowns &&
      currentPage + SHOW_DROPDOWN_ELLIPSIS_BREAKPOINT < totalPages;

    pageElements.push(
      <Pagination.First
        key={"first"}
        as={Button}
        onClick={() => {
          onSelectPage(1);
        }}
        disabled={currentPage === 1}
      />
    );
    pageElements.push(
      <Pagination.Prev
        key={"previous"}
        as={Button}
        disabled={currentPage < 2}
        onClick={() => {
          onSelectPage(currentPage - 1);
        }}
      />
    );

    let leftEllipsisAdded = false;
    let rightEllipsisAdded = false;
    for (let i = 1; i <= totalPages; i++) {
      if (
        showLeftDropdown &&
        !leftEllipsisAdded &&
        i > 1 &&
        i < currentPage - 2
      ) {
        pageElements.push(<Pagination.Ellipsis as={Button} key={i} />);
        leftEllipsisAdded = true;
        i += currentPage - 2 - i;
      } else if (
        showRightDropdown &&
        !rightEllipsisAdded &&
        i < totalPages &&
        i > currentPage + 2
      ) {
        pageElements.push(<Pagination.Ellipsis as={Button} key={i} />);
        rightEllipsisAdded = true;
        i += totalPages - i - 1;
      } else {
        pageElements.push(
          <Pagination.Item
            key={i}
            as={Button}
            active={currentPage === i}
            onClick={() => {
              onSelectPage(i);
            }}
          >
            {i}
          </Pagination.Item>
        );
      }
    }

    pageElements.push(
      <Pagination.Next
        key={"next"}
        as={Button}
        disabled={currentPage < 2}
        onClick={() => {
          onSelectPage(currentPage - 1);
        }}
      />
    );
    pageElements.push(
      <Pagination.Last
        key={"last"}
        as={Button}
        onClick={() => {
          onSelectPage(totalPages);
        }}
        disabled={currentPage === totalPages}
      />
    );

    return pageElements;
  }

  return <Pagination className="mb-0">{buildPageItems()}</Pagination>;
}

export default Paginator;
