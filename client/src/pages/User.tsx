import React, { useEffect, useState, useMemo, FC } from 'react';
import { useTable, Column, CellProps, useGlobalFilter, useSortBy, TableState, TableInstance } from 'react-table';
import axios from 'axios';
import './User.css';

interface IUser {
  _id: string;
  username: string;
  role: string;
  tickets?: string[];
  currentSpace?: string;
}


// Updated ICellProps to accept string[] or string | undefined
interface ICellPropsTickets extends CellProps<IUser, string[] | undefined> {}
interface ICellPropsSpace extends CellProps<IUser, string | undefined> {}

const CustomCell: FC<ICellPropsTickets> = ({ value }) => <>{value?.join(', ') || '-'}</>;

const CustomCellSpace: FC<ICellPropsSpace> = ({ value }) => <>{value || '-'}</>;

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

    const columns: Column<IUser>[] = useMemo(
      () => [
        { Header: 'Username', accessor: 'username' },
        { Header: 'Role', accessor: 'role' },
        { Header: 'Tickets', accessor: 'tickets', Cell: CustomCell },
        { Header: 'Current Space', accessor: 'currentSpace', Cell: CustomCellSpace },
        { 
          Header: 'Actions', 
          Cell: ({ row: { original } }: CellProps<IUser>) => (
            <div>
                <button className="button" onClick={() => deleteUser(original._id)}>Supprimer</button>
                <button className="button" onClick={() => setUserRole(original._id, original.role)}>Changer de rôle</button>
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
          const response = await axios.get('/users');
          setUsers(response.data);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchUsers();
    }, []);
  
    return (
    <div className="users-container">
    <h1 className="users-heading">User List</h1>
    {users.length === 0 ? (
      <p className="empty-users">No users found.</p>
    ) : (
      <>
        <div className="search-container">
        <input 
      placeholder="Search..."
      value={globalFilter || ''}
      onChange={(e) => setGlobalFilter(e.target.value || '')}
    />
        </div>
        <table {...getTableProps()} className="users-table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
}

export default Users;
