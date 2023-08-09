import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTable, useFilters, useBlockLayout } from 'react-table'
import { FixedSizeList, VariableSizeList } from 'react-window'
import { Input } from 'semantic-ui-react'
import { handleKeyDown, handleKeyUp } from '../../common/components/handleKeyFunctions';


let allRows;
export const getAllRows = () => {
    return allRows;
};

export const TableListDiv = ({ props, columns, data, Actions, fn, setHeight, isListFetched, width, scrollWidth, getIndex, selectedRowIndex, setSelectedRowIndex, filterBoxNone, rightBox, centerBox, callHeightFunc, paddingShort, getWidth, actionClass }) => {
    // console.log("rightBox------------------", rightBox)
    // console.log("centerBox------------------", centerBox)
    // Use the state and functions returned from useTable to build your UI
    const defaultColumn = React.useMemo(() => ({ Filter: DefaultColumnFilter, }), [])
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
        }, useFilters,
        useBlockLayout
    )
    const [searching, setSearching] = useState(false);
    const listRef = useRef(null);
    const dispatch = useDispatch();

    const getItemSize = (index) => {
        let lineHeight = 40,
            rowHeight = 0;
        // if (shiftEnterId.indexOf(rows[index].original.vid.toString() + ";") > -1) {
        //     lineHeight = lineHeight + 30;
        // }
        rowHeight = lineHeight + rowHeight;
        return rowHeight;
    };

    const handleClick = (_event, row, index) => {
        let getId = document.getElementById("getRow" + index);
        if (getId !== undefined && getId !== null) {
            setSelectedRowIndex(index);
        }
    };

    const handleScroll = () => {
        let getId = document.getElementById("getRow" + selectedRowIndex);
        if (getId !== undefined && getId !== null) {
            var selectedRow = document.getElementsByClassName("selectedRow");
            while (selectedRow.length)
                selectedRow[0].className = selectedRow[0].className.replace(
                    /\bselectedRow\b/g,
                    ""
                );
            getId.classList.add("selectedRow");
            if (searching === false) {
                getId.focus();
            }
        } else {
            if (selectedRowIndex !== 0) {
                let newIndex = parseInt(selectedRowIndex, 10) - 1;
                setSelectedRowIndex(newIndex);
            }
        }
    };

    useEffect(() => {
        functionDoneyet("yes");
    }, [prepareRow, selectedRowIndex, rows]);

    const functionDoneyet = (focus) => {
        if (listRef.current) {
            listRef.current.resetAfterIndex(0);
        }
        let divGetPrev = document.getElementsByClassName("rowGroupContentChild");
        let getId = document.getElementById("getRow" + selectedRowIndex);
        if (getId !== undefined && getId !== null) {
            let selectedRowL = document.getElementsByClassName("selectedRow");
            while (selectedRowL.length)
                selectedRowL[0].className = selectedRowL[0].className.replace(
                    /\bselectedRow\b/g,
                    ""
                );
            getId.classList.add("selectedRow");
            let selectedRow = document.getElementsByClassName("selectedRow"),
                divGet = document.getElementsByClassName("rowGroupContentChild"),
                divHt = divGet[0].getBoundingClientRect().height,
                divTop = divGet[0].getBoundingClientRect().top,
                divScrollTopGet = divGetPrev[0].scrollTop,
                rowHt = selectedRow[0].getBoundingClientRect().height,
                rowTop = selectedRow[0].getBoundingClientRect().top,
                rowTotalHt = parseFloat(rowHt) + parseFloat(rowTop);
            if (parseFloat(rowTotalHt) >= parseFloat(divTop) + parseFloat(divHt)) {
                divGet[0].scrollTop =
                    parseFloat(rowTotalHt) +
                    parseFloat(divScrollTopGet) -
                    (parseFloat(divTop) + parseFloat(divHt));
            } else if (
                parseFloat(rowTotalHt) - parseFloat(rowHt) <=
                parseFloat(divTop)
            ) {
                divGet[0].scrollTop =
                    parseFloat(divScrollTopGet) +
                    parseFloat(rowTotalHt) -
                    (parseFloat(rowHt) + parseFloat(divTop));
            }
            if (focus === "yes") {
                if (document.activeElement.tagName !== "INPUT") {
                    getId.focus();
                }
            }
        }
    };

    useEffect(() => {
        allRows = rows;
    }, [rows]);
    
    function DefaultColumnFilter({
        column: { filterValue, preFilteredRows, setFilter, filteredRows },
    }) {
        if (callHeightFunc) {
            callHeightFunc();
        }
        const count = preFilteredRows.length
        return (
            <Input
                value={filterValue || ''}
                onChange={e => { setFilter(e.target.value || undefined) }}
                // placeholder={`Search ${count} records...`}
                style={{ width: '95%', height: "28px", fontSize: "12px" }}
            />
        )
    }
    const tbodyRef = React.useRef(null);
    const RenderRow = React.useCallback(
        ({ index, style }) => {
            const row = rows[index]
            prepareRow(row)
            let i = 0;
            return (
                <div
                    {...row.getRowProps({
                        style,
                    })}
                    className={'tr bodyRow getRowWise' + index}
                    id={'getRow' + index} tabIndex={1}
                    onKeyDown={(e) =>
                        handleKeyDown(
                            e,
                            row,
                            index,
                            data,
                            selectedRowIndex,
                            setSelectedRowIndex
                        )
                    }
                    onKeyUp={(e) =>
                        handleKeyUp(
                            e,
                            row,
                            index,
                            data,
                            selectedRowIndex,
                            dispatch
                        )
                    }
                    onClick={(e) => handleClick(e, row, index)}
                >
                    {row.cells.map(cell => {
                        i++;
                        return (
                            <>

                                <>
                                    <div {...cell.getCellProps()} className={'td ' + cell.render('classNameGet')}>
                                        {cell.render('Cell')}
                                    </div>
                                    {i === getIndex ?
                                        <div className={actionClass + " td centerBoxCol"}>
                                            <center>{Actions ? <Actions object={row.cells[0].row.original} fn={fn} /> : <></>}</center>
                                        </div>
                                        :
                                        null
                                    }
                                </>
                            </>
                        )
                    })}
                </div>
            )
        },
        [prepareRow, rows]
    )
    let k = 0;
    // Render the UI for your table
    return (
        <div {...getTableProps()} className="table reactTableComm" style={{ width: getWidth }}>
            {headerGroups.map(headerGroup => (
                <div
                    style={{
                        display: "flex",
                        width: `${rows.length > 11 ? "99.5%" : "100%"}`,
                        borderBottom: "1px solid #d1d1d1",
                    }}
                >
                    <div {...headerGroup.getHeaderGroupProps()} className={"t heightSet60"} style={{ width: '99.8%' }}>
                        {headerGroup.headers.map(column => {
                            k++;
                            return (
                                <>
                                    <div {...column.getHeaderProps()} className={(rightBox.toString().indexOf(" " + k.toString() + ",") >= 0 ? 'th ' + column.render('classNameGet') + ' rightBoxCol' : centerBox.toString().indexOf(" " + k.toString() + ",") >= 0 ? 'th ' + column.render('classNameGet') + ' centerBoxCol' : 'th ' + column.render('classNameGet'))} name={(parseInt(k, 10) === parseInt(paddingShort, 10)) ? 'paddingSort' : ''}>
                                        {column.render('Header')}
                                        <span>
                                            {
                                                filterBoxNone.toString().indexOf(k.toString() + ",") > -1 ? <></> :
                                                    column.canFilter ? column.render('Filter') : null
                                            }
                                        </span>
                                    </div>
                                    {k === getIndex ?
                                        <div className={"th likeTh centerBoxCol " + actionClass}>Action</div>
                                        : null}
                                </>
                            )
                        }
                        )}
                    </div>
                </div>
            ))}
            <div {...getTableBodyProps()} ref={tbodyRef} className="rowGroupContent">
                {(data.length === 0 && isListFetched) ? <div
                    className="rowGroupContentChild"
                    style={{
                        height: `${setHeight}px`,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "red",
                    }}
                    id="noData"
                    tabIndex={1}
                    onKeyUp={(e) =>
                        handleKeyUp(e, "", "", data, dispatch)
                    }
                >
                    No Data To Display
                </div> :
                    <VariableSizeList
                        height={parseFloat(setHeight)}
                        itemCount={rows.length}
                        itemSize={getItemSize}
                        ref={listRef}
                        className="rowGroupContentChild"
                        style={{ overflow: "hidden scroll" }}
                        onScroll={handleScroll}
                    >
                        {RenderRow}
                    </VariableSizeList>
                }
            </div>
            {footerGroups.map((footerGroup) => (
                <div
                    {...footerGroup.getFooterGroupProps()}
                    style={{
                        display: "flex",
                        width: `${rows.length > 10
                            ? scrollWidth
                            : width
                            }`,
                        height: "35px",
                        backgroundColor: "rgb(248, 246, 246)",
                    }}
                    className="footContentTb"
                >
                    {footerGroup.headers.map((column, index) => {
                        return (
                            <div
                                {...column.getHeaderProps()}
                                className={"th " + column.render("classNameGet")}
                            >
                                {column.render("Footer")}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    )
}

