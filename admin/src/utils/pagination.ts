import { Notify } from 'quasar';

type PaginationProperties = {
  pagination: PaginationOptions;
  filter?: string;
};
type PaginationRequestHandler = (props: PaginationProperties) => void;
type PaginationRequestFetcher = (
  startRow: number,
  fetchCount: number,
  sortBy: string,
  descending: boolean,
  filter?: string,
) => Promise<PaginationFetchResult>;
export type PaginationOptions = {
  sortBy: string;
  descending: boolean;
  page: number;
  rowsPerPage: number;
  rowsNumber?: number;
};
type PaginationFetchResult = {
  total: number;
};

export function makePaginationRequestHandler(
  fetchFromServer: PaginationRequestFetcher,
  pagination: Ref<PaginationOptions>,
): PaginationRequestHandler {
  return function (props) {
    const { page, rowsPerPage, sortBy, descending } = props.pagination;
    const filter = props.filter;

    // get all rows if "All" (0) is selected
    const fetchCount = rowsPerPage === 0 ? pagination.value.rowsNumber || 0 : rowsPerPage;

    // calculate starting row of data
    const startRow = (page - 1) * rowsPerPage;

    // fetch data from "server"
    fetchFromServer(startRow, fetchCount, sortBy, descending, filter)
      .then((result: PaginationFetchResult) => {
        pagination.value = { ...props.pagination, rowsNumber: result.total };
      })
      .catch((err: Error) => {
        // auth error will be handled in the layout component
        if (err.name !== 'NotAuthenticated') {
          Notify.create({
            message: err.message,
            type: 'negative',
          });
        }
      });
  };
}
