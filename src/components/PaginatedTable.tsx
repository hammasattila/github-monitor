import { useState } from "react";
import {
	EuiBasicTable,
	EuiButtonIcon,
	EuiHorizontalRule,
	EuiScreenReaderOnly,
	EuiSpacer,
	EuiTablePagination,
	EuiText,
	RIGHT_ALIGNMENT
} from "@elastic/eui";
import { EuiBasicTableColumn } from "@elastic/eui/src/components/basic_table/basic_table";

export interface Page {
	index: number;
	size: number;
}

interface Props<T> {
	itemName: string
	totalItemCount: number,
	pageOfItems: T[],
	itemsPerPageOptions: number[],
	columns: EuiBasicTableColumn<T>[],
	loading: boolean,
	onChange: (newpage: Page, oldpage: Page) => Promise<boolean>,
	onExpand?: (item: T) => JSX.Element
}

export function PaginatedTable<T extends { id: string }>({
	itemName,
	totalItemCount,
	loading,
	pageOfItems,
	columns,
	onChange,
	onExpand,
	itemsPerPageOptions
}: Props<T>) {
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(itemsPerPageOptions.at(-1) ?? 10);
	const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState<{ [x: string]: JSX.Element | undefined }>({});
	
	const expandButton: EuiBasicTableColumn<T> = {
		align: RIGHT_ALIGNMENT,
		width: '40px',
		isExpander: true,
		name: (
			<EuiScreenReaderOnly>
				<span>Expand rows</span>
			</EuiScreenReaderOnly>
		),
		render: (item: T) => (
			<EuiButtonIcon
				onClick={() => toggleDetails(item)}
				aria-label={itemIdToExpandedRowMap[item.id] ? 'Collapse' : 'Expand'}
				iconType={itemIdToExpandedRowMap[item.id] ? 'arrowUp' : 'arrowDown'}
			/>
		)
	}
	
	const resultsCount =
		pageSize === 0 ? (
			<strong>All</strong>
		) : (
			<>
				<strong>
					{pageSize * pageIndex + 1}-{pageSize * pageIndex + pageSize}
				</strong>{' '}
				of {totalItemCount}
			</>
		);
	
	const toggleDetails = (item: T) => {
		const itemIdToExpandedRowMapValues = {...itemIdToExpandedRowMap};
		if (itemIdToExpandedRowMapValues[item.id]) {
			delete itemIdToExpandedRowMapValues[item.id];
		} else {
			itemIdToExpandedRowMapValues[item.id] = onExpand?.(item);
		}
		setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
		
	};
	
	const handleChangePage = (newindex: number) => {
		onChange({index: newindex, size: pageSize}, {index: pageIndex, size: pageSize}).then(r => {
			if (r) setPageIndex(newindex)
		});
	}
	
	const handleChangePageSize = (newsize: number) => {
		onChange({index: 0, size: newsize}, {index: pageIndex, size: pageSize}).then(r => {
			if (r) {
				setPageSize(newsize);
				setPageIndex(0);
			}
		});
	}
	
	return (
		<>
			<EuiText size="xs">
				Showing {resultsCount} <strong>{itemName}</strong>
			</EuiText>
			<EuiSpacer size="s"/>
			<EuiHorizontalRule margin="none" style={{height: 2}}/>
			<EuiBasicTable<T>
				items={pageOfItems}
				columns={onExpand ? [...columns, expandButton] : columns}
				itemId="id"
				itemIdToExpandedRowMap={onExpand && itemIdToExpandedRowMap}
				isExpandable={!!onExpand}
				loading={loading}
			/>
			{/*EuiBasicTable's pagination cannot be compressed :@*/}
			<EuiSpacer size="m"/>
			<EuiTablePagination
				compressed={true}
				itemsPerPageOptions={itemsPerPageOptions}
				itemsPerPage={pageSize}
				activePage={pageIndex}
				pageCount={Math.ceil(totalItemCount / pageSize)}
				onChangePage={handleChangePage}
				onChangeItemsPerPage={handleChangePageSize}
			/>
		</>
	);
}
