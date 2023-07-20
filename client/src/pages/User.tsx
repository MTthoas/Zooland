import React, { useEffect, useState, useMemo, FC } from 'react';
import { useTable, Column, CellProps, useGlobalFilter, useSortBy, TableState, TableInstance } from 'react-table';
import axios from 'axios';
import './User.css';
import { Button, Input, Typography } from 'antd';

interface IUser {
  _id: string;
  username: string;
  role: string;
  tickets?: string[];
  currentSpace?: string;
  countTickets: number;
}


// Updated ICellProps to accept string[] or string | undefined
interface ICellPropsTickets extends CellProps<IUser, string[] | undefined> {}
interface ICellPropsSpace extends CellProps<IUser, string | undefined> {}
interface ICellPropsId extends CellProps<IUser, string> {}

const tokenId = localStorage.getItem('token');

  // Configurer les en-têtes de la requête
  let config = {
    headers: {
      'Authorization': 'Bearer ' + tokenId
    }
  }

const CustomCell: FC<ICellPropsTickets> = ({ value }) => <>{value?.join(', ') || '-'}</>;

const CustomCellSpace: FC<ICellPropsSpace> = ({ value }) => <>{value || '-'}</>;

const CustomCellId: FC<ICellPropsId> = ({ value }) => <>{value}</>;

// Create an extended interface of TableInstance to include 'setGlobalFilter'
interface ITableInstance extends TableInstance<IUser> {
  setGlobalFilter: (filterValue: string) => void;
}

// Extend TableState to include 'globalFilter'
interface ITableState extends TableState<IUser> {
  globalFilter: string;
}

function Users() {
  const [users, setUsers] = useState<IUser[]>([]);

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const setUserRole = async (id: string, role: string) => {
    try {
      const newRole = role === 'admin' ? 'user' : 'admin';
      const response = await axios.patch(`/users/${id}/role`, { role: newRole });
      setUsers(users.map(user => user._id === id ? { ...user, role: response.data.role } : user));
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
      { Header: 'Tickets', accessor: 'countTickets', Cell:  ({ value }) => <>{value}</> },
      { Header: 'Current Space', accessor: 'currentSpace', Cell: CustomCellSpace },
      { 
        Header: 'Actions', 
        Cell: ({ row: { original } }: CellProps<IUser>) => (
          <div>
            <Button type="primary" danger onClick={() => deleteUser(original._id)}>Supprimer</Button>
            <Button type="primary" onClick={() => setUserRole(original._id, original.role)}>Changer de rôle</Button>
            <Button type="primary" danger onClick={() => deleteUserTickets(original._id)}>Supprimer tous les tickets</Button>
          </div>

        )
      },
    ],
    [users] // Mettez users dans le tableau des dépendances pour vous assurer que la colonne est mise à jour chaque fois que les users changent.
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
        const response = await axios.get<IUser[]>('/users');
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
    <div className="flex flex-col pt-24">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <Typography.Title level={1} className="users-heading" style={{ color: 'white' }}>Liste des utilisateurs</Typography.Title>
          {users.length === 0 ? (
            <p className="empty-users">Aucun utilisateur trouvé.</p>
          ) : (
            <>
              <div className="shadow overflow-hidden sm:rounded-lg mb-4 flex items-center justify-center">
                <Input
                  placeholder="Rechercher..."
                  value={globalFilter || ''}
                  onChange={(e) => setGlobalFilter(e.target.value || '')}
                  style={{ width: 200, marginRight: 10 }}
                />
              </div>

              <div className="shadow overflow-hidden sm:rounded-lg mb-4">
                <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th {...column.getHeaderProps()} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {column.render('Header')}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                    {rows.map((row) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map((cell) => (
                            <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap">
                              {cell.render('Cell')}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Users;
