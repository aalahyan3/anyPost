"use client"

import React from 'react'

export type FilterType = {
    query: string,
    orderBy: string | null,
    orderDirection: "asc" | "desc"
    pageSize: number
}

type FilterSystemProps = {
    columns: string[]
    initialFilter: FilterType,

    onApply: (filter: FilterType) => void
    onReset: () => void
}


function FilterSystem({
    columns,
    initialFilter,

    onApply,
    onReset
}:  FilterSystemProps) {

    const [query, setQuery] = React.useState(initialFilter.query)
    const [orderBy, setOrderBy] = React.useState<string | null>(initialFilter.orderBy)
    const [orderDirection, setOrderDirection] = React.useState<"asc" | "desc">(initialFilter.orderDirection)
    const [pageSize, setPageSize] = React.useState(initialFilter.pageSize)

  return (
    <div>FilterSystem</div>
  )
}

export default FilterSystem