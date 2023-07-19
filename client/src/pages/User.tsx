import React, { useEffect, useState, useMemo, FC } from 'react';
import { useTable, Column, CellProps, useGlobalFilter, useSortBy, TableState, TableInstance } from 'react-table';
import axios from 'axios';

interface IUser {
  _id: string;
  username: string;
  role: string;
  tickets?: string[];
  currentSpace?: string;
  countTickets: number;
}

interface ICellPropsTickets extends CellProps<IUser, number> {}
interface ICellPropsSpace extends CellProps<IUser, string | undefined> {}
interface ICellPropsId extends CellProps<IUser, string> {}

const CustomCell: FC<ICellPropsTickets> = ({ value }) => <>{value}</>;

const CustomCellSpace: FC<ICellPropsSpace> = ({ value }) => <>{value || '-'}</>;

const CustomCellId: FC<ICellPropsId> = ({ value }) => <>{value}</>;

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
      await axios.delete(`/users/${id}`);
      setUsers(users => users.filter(user => user._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const setUserRole = async (id: string, role: string) => {
    try {
      const newRole = role === 'admin' ? 'user' : 'admin';
      const response = await axios.patch(`/users/${id}/role`, { role: newRole });
      setUsers(users =>
        users.map(user =>
          user._id === id ? { ...user, role: response.data.role } : user
        )
      );
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
          <div>
            <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => deleteUser(original._id)}>Supprimer</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setUserRole(original._id, original.role)}>Changer de rôle</button>
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Liste des utilisateurs</h1>
      {users.length === 0 ? (
        <p className="text-gray-600">Aucun utilisateur trouvé.</p>
      ) : (
        <>
          <div className="mb-4">
            <input 
              placeholder="Rechercher..."
              value={globalFilter || ''}
              onChange={(e) => setGlobalFilter(e.target.value || '')}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>
          <table {...getTableProps()} className="w-full border border-gray-300">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} className="px-4 py-2 bg-gray-200 font-bold text-left">{column.render('Header')}</th>
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
                      <td {...cell.getCellProps()} className="px-4 py-2 border-t border-gray-300">{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Users;
