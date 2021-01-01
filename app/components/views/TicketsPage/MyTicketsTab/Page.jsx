import { FormattedMessage as T } from "react-intl";
import InfiniteScroll from "react-infinite-scroller";
import {
  LoadingMoreTicketsIndicator,
  NoMoreTicketsIndicator,
  NoTicketsIndicator
} from "indicators";
import { TxHistory, Subtitle, Tooltip } from "shared";
import { EyeFilterMenu, QRModalButton } from "buttons";
import style from "./MyTicketsTab.module.css";
import ReactPaginate from "react-paginate";

const subtitleMenu = ({
  sortTypes,
  ticketTypes,
  selectedSortOrderKey,
  selectedTicketTypeKey,
  onChangeSelectedType,
  onChangeSortType,
  qrs,
  loadingQR,
  qrPage,
  handlePageClick,
  getQR
}) => (
  <div className={style.ticketsButtons}>
    <Tooltip
      tipWidth={300}
      text={<T id="tickets.sortby.tooltip" m="Sort By" />}>
      <EyeFilterMenu
        labelKey="label"
        keyField="value"
        options={sortTypes}
        selected={selectedSortOrderKey}
        onChange={onChangeSortType}
        type="sortBy"
      />
    </Tooltip>
    <Tooltip
      tipWidth={300}
      text={<T id="tickets.tickettypes.tooltip" m="Ticket Status" />}>
      <EyeFilterMenu
        labelKey="label"
        keyField="key"
        options={ticketTypes}
        selected={selectedTicketTypeKey}
        onChange={onChangeSelectedType}
      />
    </Tooltip>
    <Tooltip
      tipWidth={300}
      text={<T id="tickets.qr.tooltip" m="Active Tickets QR" />}>
      <div className={style.menuButton}>
        <QRModalButton
          className={style.qrButton}
          modalTitle={ <T id="tickets.qr.button" m="Active Tickets QR Code" /> }
          pagesRemaining={ qrs.length > 1 ? qrPage + 1 + "/" + qrs.length : null }
          // TODO: Use translated phrase.
          modalContent={ qrs.length != 0 ? <img src={qrs[qrPage]}/> : loadingQR || "No active tickets in the current view." }
          onClick={getQR}
          pages={
            qrs.length > 1 ?
              <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                breakLabel={"..."}
                pageCount={qrs.length}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
              />
            : null
          }
        />
      </div>
    </Tooltip>
  </div>
);

const TicketListPage = ({
  tickets,
  noMoreTickets,
  getTickets,
  onChangeSortType,
  onChangeSelectedType,
  selectedSortOrderKey,
  selectedTicketTypeKey,
  sortTypes,
  ticketTypes,
  tsDate,
  loadingQR,
  qrPage,
  handlePageClick,
  qrs,
  getQR
}) => {
  const isOverview = window.innerWidth < 768; // small width
  return (
    <InfiniteScroll
      hasMore={!noMoreTickets}
      loadMore={() => getTickets(true)}
      initialLoad={!noMoreTickets}
      useWindow={false}
      threshold={90}>
      <Subtitle
        title={<T id="mytickets.subtitle" m="My Tickets" />}
        className={style.subtitle}
        children={subtitleMenu({
          sortTypes,
          ticketTypes,
          selectedSortOrderKey,
          selectedTicketTypeKey,
          onChangeSelectedType,
          onChangeSortType,
          loadingQR,
          qrPage,
          handlePageClick,
          qrs,
          getQR
        })}
      />
      {tickets.length > 0 && (
        <>
          <div className={style.tableHeader}>
            <div>
              <T id="tickets.table.header.status" m="Ticket Status" />
            </div>
            <div>
              <T id="tickets.table.header.price" m="Price" />
            </div>
            <div>
              <T id="tickets.table.header.reward" m="Reward" />
            </div>
            <div>
              <T id="tickets.table.header.votetime" m="Vote Time" />
            </div>
            <div>
              <T id="tickets.table.header.account" m="Account" />
            </div>
            <div>
              <T id="tickets.table.header.purchased" m="Voted" />
            </div>
          </div>
          <TxHistory
            {...{
              transactions: tickets,
              tsDate,
              mode: "stake",
              overview: isOverview
            }}
          />
        </>
      )}
      {!noMoreTickets ? (
        <LoadingMoreTicketsIndicator />
      ) : tickets.length > 0 ? (
        <NoMoreTicketsIndicator />
      ) : (
        <NoTicketsIndicator />
      )}
    </InfiniteScroll>
  );
};

export default TicketListPage;
