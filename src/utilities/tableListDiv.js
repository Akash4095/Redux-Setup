import React from 'react';
import { useTable, useFilters, useBlockLayout } from 'react-table'
import { FixedSizeList } from 'react-window'
import { Input } from 'semantic-ui-react'


export const TableListDiv = ({ props, columns, data, Actions, fn , setHeight, getIndex, filterBoxNone, rightBox, centerBox, callHeightFunc, paddingShort, getWidth, actionClass}) => {
    // console.log("rightBox------------------", rightBox)
    // console.log("centerBox------------------", centerBox)
// Use the state and functions returned from useTable to build your UI
    const defaultColumn = React.useMemo(() => ({Filter: DefaultColumnFilter,}),[])
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
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
    function DefaultColumnFilter({
        column: { filterValue, preFilteredRows, setFilter, filteredRows},        
      }) {
        if(callHeightFunc){
            callHeightFunc();
        }
        const count = preFilteredRows.length
        return (
          <Input
            value={filterValue || ''}
            onChange={e => { setFilter(e.target.value || undefined) }}
            placeholder={`Search ${count} records...`}
            style={{width: '95%'}}
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
                    style,})}
                className={'tr bodyRow getRowWise'+index}
                id={'getRow'+index} tabIndex={1}
            >
                {row.cells.map(cell => {
                    i++;
                    return (
                        <>
                        <div {...cell.getCellProps()} className={'td '+cell.render('classNameGet')}>
                            {cell.render('Cell')}
                        </div>
                        {i === getIndex ? 
                            <div className={actionClass+" td centerBoxCol"}>
                                <center>{Actions ?<Actions object={row.cells[0].row.original} fn={fn}/> : <></>  }</center>
                            </div>
                            :
                            null
                        }                
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
    <div {...getTableProps()} className="table reactTableComm" style={{width: getWidth}}>
        {headerGroups.map(headerGroup => (
            <div {...headerGroup.getHeaderGroupProps()} className={"t heightSet65"} style={{width: '99.8%'}}>
            {headerGroup.headers.map(column => {
                k++;
               return(
                   <> 
                        <div {...column.getHeaderProps()} className={(rightBox.toString().indexOf(" "+k.toString()+",") >= 0 ? 'th '+column.render('classNameGet')+' rightBoxCol' : centerBox.toString().indexOf(" "+k.toString()+",") >= 0 ? 'th '+column.render('classNameGet')+' centerBoxCol' : 'th '+column.render('classNameGet'))} name={(parseInt(k, 10) === parseInt(paddingShort, 10)) ? 'paddingSort' : ''}>
                            {column.render('Header')}
                            <span> 
                            {
                                filterBoxNone.toString().indexOf(k.toString()+",") > -1 ? <></> : 
                                    column.canFilter ? column.render('Filter') : null
                            }
                            </span>     
                        </div>
                        {k === getIndex ? 
                            <div className={"th likeTh centerBoxCol "+actionClass}>Action</div>
                        : null}
                    </>
                )}
            )}
            </div>
        ))}
        <div {...getTableBodyProps()} ref={tbodyRef} className="rowGroupContent">
            <FixedSizeList
                height={parseFloat(setHeight)}
                itemCount={rows.length}
                itemSize={50}
                width={'100%'}
                className="rowGroupContentChild"
            >
                {RenderRow}
            </FixedSizeList>
        </div>
    </div>
    )    
}

