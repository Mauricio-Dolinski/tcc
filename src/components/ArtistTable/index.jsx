
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useTable, usePagination, useSortBy } from 'react-table';
import './styles.css'
import Box from "@mui/material/Box";
import { toast} from "react-toastify";
import { LuEdit} from "react-icons/lu";
import {BsFillTrashFill} from "react-icons/bs";
import Button from "@mui/material/Button";

export function ArtistTable() {

  const [posts, setPosts] = useState([]);
  
  const GetArtistsInfo = async () => {
    await axios.get('https://jsonplaceholder.typicode.com/users').then(response => {
        const users = response.data;
        for (const user of users) {
          setPosts([...posts, { ...user }]);
          posts.push({ ...user });
        };
        posts.length = 0
        
      }).catch(error => { 
		toast.error("e: " + error, {
      	toastId: "networkError"
    	});
      });
  };
  const data = useMemo(() => [...posts], [posts]);
  const columns = useMemo(() => [
      {
        Header: 'ID',
        accessor: 'id'
      },
      {
        Header: 'Nome',
        accessor: 'name'
      },
      {
        Header: 'Usuário',
        accessor: 'username',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Editar',
        Cell: <div className='div_acoes'>
        		<LuEdit className="edit-btn" />
        	  </div>
      },
      {
        Header: 'Excluir',
        Cell: <div className='div_acoes'>
        		<BsFillTrashFill className="delete-btn" />
        	  </div>
      }
  ], []
  );
  
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 8 }
    },
    useSortBy,
    usePagination
  )
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = tableInstance;

  useEffect(() => {
    GetArtistsInfo(); 
  }, []);

  return (
      <Box sx={{ marginX: '25px', p: 2, bgcolor: "#ffffff", borderRadius: 5, boxShadow: "2px 2px 10px -3px"}}>
	      <table {...getTableProps()}>
	        <thead>
	          {headerGroups.map(headerGroup => (
	            <tr {...headerGroup.getHeaderGroupProps()}>
	              {headerGroup.headers.map((column) => (
	                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
	                  {column.render('Header')}
	                  <span>
	                    {column.isSorted
	                      ? column.isSortedDesc
	                        ? ' 🔽'
	                        : ' 🔼'
	                      : ''}
	                  </span>
	                </th>
	              ))}
	            </tr>
	          ))}
	        </thead>
	        <tbody {...getTableBodyProps()}>
	          {page.map((row, i) => {
	            prepareRow(row)
	            return (
	              <tr {...row.getRowProps()}>
	                {row.cells.map(cell => {
	                  return (
						  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
					  )
	                })}
	              </tr>
	            )
	          })}
	        </tbody>
	      </table>
	      <div className="pagination">
	        <Button variant="outlined" onClick={() => previousPage()} disabled={!canPreviousPage}>
	          {'Voltar'}
	        </Button>{' '}
	        <div class="page-info">
	          <span>
	            Página{' '}
	            <strong>
	              {pageIndex + 1} de {pageOptions.length}
	            </strong>{' '}
	          </span>
	          <span>
	            Ir para página:{' '}
	            <input
	              type="number"
	              defaultValue={pageIndex + 1}
	              onChange={e => {
	                const page = e.target.value ? Number(e.target.value) - 1 : 0
	                gotoPage(page)
	              }}
	              style={{ width: '100px' }}
	            />
	          </span>{' '}
	        </div>
	        <Button variant="outlined" onClick={() => nextPage()} disabled={!canNextPage}>
	          {'Próximo'}
	        </Button>{' '}
	      </div>
	    </Box>
  );
}