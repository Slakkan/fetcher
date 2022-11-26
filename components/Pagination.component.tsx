
import Image from "next/image"
import { Children, FunctionComponent, PropsWithChildren, useCallback, useMemo, useState } from "react"
import useWindowSize from "../hooks/useWidth"
import styles from "./Pagination.module.scss"

interface Pagination {
    itemsPerPage: number
}

const Pagination: FunctionComponent<PropsWithChildren<Pagination>> = ({ itemsPerPage, children }) => {
    const itemCount = useMemo(() => Children.count((children)), [children])
    const [windowWidth] = useWindowSize()

    const [currentPage, setCurrentPage] = useState(1)
    const lastPage = useMemo(() => Math.ceil(itemCount / itemsPerPage), [itemCount, itemsPerPage])

    const getIsHiddenDesktop = useCallback((pageNumber: number) => {
        let isHidden = false
        if (currentPage === 1 || currentPage === 2) {
            isHidden = pageNumber > 5
        } else if (currentPage === lastPage || currentPage === lastPage - 1) {
            isHidden = pageNumber < (lastPage - 4)
        } else {
            isHidden = pageNumber < currentPage - 2 || pageNumber > currentPage + 2
        }
        return isHidden
    }, [currentPage, lastPage])

    const getIsHiddenMobile = useCallback((pageNumber: number) => {
        let isHidden = false
        if (currentPage === 1) {
            isHidden = pageNumber > 3
        } else if (currentPage === lastPage) {
            isHidden = pageNumber < (lastPage - 2)
        } else {
            isHidden = pageNumber !== currentPage - 1 && pageNumber !== currentPage && pageNumber !== currentPage + 1
        }
        return isHidden
    }, [currentPage, lastPage])

    const getPageClassName = useCallback((pageNumber: number, isGoTo?: boolean) => {
        const base = styles.pagination__page
        const selected = styles["pagination__page--selected"]
        const hidden = styles["pagination__page--hidden"]

        const isSelected = currentPage === pageNumber
        const isHidden = windowWidth < 768 ? getIsHiddenMobile(pageNumber) : getIsHiddenDesktop(pageNumber)

        return `${base} ${isSelected ? selected : ""} ${isHidden && !isGoTo ? hidden : ""} box p-2 mx-2`
    }, [currentPage, getIsHiddenDesktop, getIsHiddenMobile, windowWidth])


    const generateNumbers = useCallback(() => {
        const pageNumbers: JSX.Element[] = []
        for (let i = 1; i <= lastPage; i++) {
            pageNumbers.push(
                <button key={"Page-" + i} className={getPageClassName(i)} onClick={() => setCurrentPage(i)}>{i}</button>
            )
        }

        const goToFirstPage = <button key={"Page-first"} className={getPageClassName(1, true)} onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><Image src="/icons/angles-left-solid.svg" alt="<<" width={24} height={24} /></button>
        const goToPrevPage = <button key={"Page-prev"} className={getPageClassName(1, true)} onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}><Image src="/icons/angle-left-solid.svg" alt="<" width={24} height={24} /></button>
        pageNumbers.unshift(goToFirstPage, goToPrevPage)
        const goToNextPage = <button key={"Page-next"} className={getPageClassName(lastPage, true)} onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === lastPage}><Image src="/icons/angle-right-solid.svg" alt=">" width={24} height={24} /></button>
        const goToLastPage = <button key={"Page-last"} className={getPageClassName(lastPage, true)} onClick={() => setCurrentPage(lastPage)} disabled={currentPage === lastPage}><Image src="/icons/angles-right-solid.svg" alt=">>" width={24} height={24} /></button>
        pageNumbers.push(goToNextPage, goToLastPage)
        return pageNumbers
    }, [currentPage, getPageClassName, lastPage])

    const getPaginatedChildren = useCallback(() => {
        let childrenArray = Children.toArray(children)
        const startIndex = (currentPage - 1) * itemsPerPage
        const lastIndex = Math.min((currentPage - 1) * itemsPerPage + itemsPerPage, childrenArray.length)
        return childrenArray.slice(startIndex, lastIndex)
    }, [children, currentPage, itemsPerPage])

    return (
        <div className={styles.pagination}>
            <div className="background--alternating">
                {getPaginatedChildren()}
            </div>
            {lastPage !== 1 && (
                <div className="d-flex justify-content-center mt-5">
                    {generateNumbers()}
                </div>
            )}
        </div>
    )
}

export default Pagination