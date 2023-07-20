import React, { useEffect, useState, useMemo, FC } from 'react';
import { useTable, Column, CellProps, useGlobalFilter, useSortBy, TableState, TableInstance } from 'react-table';
import axios from 'axios';
import { Button, Input, Typography } from 'antd';

interface IUser {
  _id: string;
  username: string;
  role: string;
  tickets?: string[];
  currentSpace?: string;
  countTickets: number;
}

function truncateString(str : any, num: any) {
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + '...'
}

interface ICellPropsTickets extends CellProps<IUser, number> {}
interface ICellPropsSpace extends CellProps<IUser, string | undefined> {}
interface ICellPropsId extends CellProps<IUser, string> {}

const tokenId = localStorage.getItem('token');

  // Configurer les en-têtes de la requête
  let config = {
    headers: {
      'Authorization': 'Bearer ' + tokenId
    }
  }

const CustomCell: FC<ICellPropsTickets> = ({ value }) => <div className='text-sm'>{truncateString(String(value), 10)}</div>;

const CustomCellSpace: FC<ICellPropsSpace> = ({ value }) => <div className='text-sm'>{value || '-'}</div>;

const CustomCellId: FC<ICellPropsId> = ({ value }) => <div className='text-sm'>{truncateString(value, 30)}</div>;


interface ITableInstance extends TableInstance<IUser> {
  setGlobalFilter: (filterValue: string) => void;
}

interface ITableState extends TableState<IUser> {
  globalFilter: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`/users/${id}`, config);
      setUsers(users => users.filter(user => user._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const setUserRole = async (id: string, role: string) => {
    try {
      const newRole = role === 'admin' ? 'user' : 'admin';
      const response = await axios.patch(`/users/${id}/role`, { role: newRole }, config);
      setUsers(users =>
        users.map(user =>
          user._id === id ? { ...user, role: response.data.role } : user
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUserTickets = async (id: string) => {
    try {
      await axios.delete(`/tickets/${id}/deleteAll`, config);
      const updatedUsers = users.map(user => user._id === id ? { ...user, countTickets: 0 } : user);
      setUsers(updatedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  const columns: Column<IUser>[] = useMemo(
    () => [
      { Header: 'ID', accessor: '_id', Cell: CustomCellId },
      { Header: 'Username', accessor: 'username' },
      { Header: 'Role', accessor: 'role' },
      { Header: 'Tickets', accessor: 'countTickets', Cell: CustomCell },
      { Header: 'Current Space', accessor: 'currentSpace', Cell: CustomCellSpace },
      {
        Header: 'Actions',
        Cell: ({ row: { original } }: CellProps<IUser>) => (
          <div className="">
            <button className="px-2 py-2 mr-2 bg-red-500 text-xs text-white rounded" onClick={() => deleteUser(original._id)}>Supprimer</button>
            <button className="px-4 py-2 mx-2 bg-blue-500 text-xs text-white rounded" onClick={() => setUserRole(original._id, original.role)}>Changer de rôle</button>
            <Button type="primary" danger onClick={() => deleteUserTickets(original._id)}>Supprimer tous les tickets</Button>
          </div>
        )
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({ columns, data: users }, useGlobalFilter, useSortBy) as ITableInstance;

  const { globalFilter } = state as ITableState;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<IUser[]>('/users', config);
        const updatedUsers = response.data.map(user => ({
          ...user,
          countTickets: user.tickets ? user.tickets.length : 0
        }));
        setUsers(updatedUsers);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="h-screen pt-32 bg-base100">
      <div className='mx-32'>
        <h1 className="text-2xl font-bold mb-4 text-black">Liste des utilisateurs</h1>
        {users.length === 0 ? (
          <p className="text-gray-600">Aucun utilisateur trouvé.</p>
        ) : (
          <>
            <div className="mb-4">
              {/* <input 
                placeholder="Rechercher..."
                value={globalFilter || ''}
                onChange={(e) => setGlobalFilter(e.target.value || '')}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              /> */}
              <form>   
                <label  className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="search" 
                     value={globalFilter || ''}
                     onChange={(e) => setGlobalFilter(e.target.value || '')}
                    id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Rechercher utilisateur..." required/>
                    {/* <button type="submit" className="text-white absolute right-2.5 bottom-2.5  focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 bg-gray-900">Search</button> */}
                </div>
            
            </form>
            </div>
            
            <table {...getTableProps()} className="w-full border border-gray-300">
              <thead className='text-sm'>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()} className="px-4 py-2 bg-gray-200 font-medium text-left text-black">{column.render('Header')}</th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()} className="px-4 py-2 border-t border-gray-300 text-sm font-normal text-black">{cell.render('Cell')}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default Users;
