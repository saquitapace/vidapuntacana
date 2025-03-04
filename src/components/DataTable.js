'use client';
import { useMemo } from 'react';
import Spinner from './Spinner';

const DataTable = ({
  columns,
  data,
  isLoading,
  emptyMessage = 'No data found',
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useMemo(() => {
      return {
        getTableProps: () => ({}),
        getTableBodyProps: () => ({}),
        headerGroups: columns.length
          ? [{ id: 'main-header', headers: columns }]
          : [],
        rows: data || [],
        prepareRow: (row) => {},
      };
    }, [columns, data]);

  if (isLoading) {
    return (
      <div className='loading-container'>
        <Spinner />
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className='empty-container'>
        <div className='empty-message'>{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className='data-table-container'>
      <table className='data-table' {...getTableProps()}>
        <thead className='table-header'>
          {headerGroups.map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  key={column.id || column.accessorKey}
                  className='table-header-cell'
                >
                  {column.header}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className='table-body' {...getTableBodyProps()}>
          {rows.map((row, i) => (
            <tr key={row.id || i} className='table-row'>
              {columns.map((column, j) => {
                let content;
                if (column.accessorKey) {
                  content = row[column.accessorKey];
                } else if (column.accessorFn) {
                  content = column.accessorFn(row);
                } else if (column.cell) {
                  content = column.cell({ row: { original: row } });
                }
                return (
                  <td
                    key={column.id || column.accessorKey || j}
                    className='table-cell'
                  >
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
