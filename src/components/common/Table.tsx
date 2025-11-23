import React from 'react';

interface TableProps<T> {
	headers: { key: keyof T | string; label: string; sortable?: boolean }[]
	data: T[]
	onSort?: (columnKey: keyof T) => void
	sortColumn?: keyof T
	sortDirection?: 'asc' | 'desc'
	renderRow: (item: T) => React.ReactNode
}

export const Table = <T,>({ headers, data, onSort, sortColumn, sortDirection, renderRow }: TableProps<T>) => {
	return (
		<div className='table-wrapper'>
			<table className='table'>
				<thead>
					<tr>
						{headers.map((header) => (
							<th
								key={String(header.key)}
								onClick={() => header.sortable && onSort && onSort(header.key as keyof T)}
								className={header.sortable ? 'sortable' : ''}
							>
								{header.label}
								{sortColumn === header.key && <span className={`sort-icon ${sortDirection}`}></span>}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.length > 0 ? (
						data.map((item, index) => (
							<React.Fragment key={index}>{renderRow(item)}</React.Fragment>
						))
					) : (
						<tr>
							<td colSpan={headers.length} className='no-results'>
								No data found.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
