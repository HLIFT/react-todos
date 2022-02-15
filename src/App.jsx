// eslint-disable-next-line max-len
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events,jsx-a11y/label-has-associated-control,no-unused-vars */

import './todo.css';
import { useEffect, useState } from 'react';
import { Todo } from './Todo';
import { Filter } from './Filter';

export function App() {
  const getFreshTodo = () => ({
    id: null,
    title: '',
    description: '',
    labelId: 0,
    dueDate: '',
    completed: false,
  });

  const [todos, setTodos] = useState({});
  const [newTodo, setNewTodo] = useState(getFreshTodo);

  useEffect(() => {
    if (localStorage.getItem('todos')) {
      setTodos(JSON.parse(localStorage.getItem('todos')));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const remaining = Object.values(todos).filter(
    (item) => !item.completed,
  ).length;

  const labels = [
    { id: 0, title: 'non classé', name: 'nc' },
    { id: 1, title: 'dev front', name: 'df' },
    { id: 2, title: 'dev back', name: 'db' },
  ];

  const getLabel = (id) => labels.filter((item) => item.id === id);

  const [filter, setFilter] = useState('all');

  const [inEdition, setInEdition] = useState(false);
  const [search, setSearch] = useState('');

  const [errors, setErrors] = useState({});

  const handleOnChangeInputs = (event) => {
    setNewTodo({ ...newTodo, [event.target.name]: event.target.value });
  };

  const handleOnEdit = (todo) => {
    setInEdition(true);
    setNewTodo(todo);
  };

  const exitEdition = () => {
    setInEdition(false);
    setNewTodo(getFreshTodo);
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const errorsSubmit = {
      title: newTodo.title ? undefined : 'Le titre est obligatoire',
      description: newTodo.description
        ? undefined
        : 'La description est obligatoire',
    };

    setErrors(errorsSubmit);

    const hasErrors = Object.values(errors).some(Boolean);

    if (hasErrors) {
      return;
    }

    setTodos((currentTodos) => {
      const hasTodos = Object.keys(currentTodos).length;
      const id = newTodo.id
        ?? (hasTodos ? Math.max(...Object.keys(currentTodos)) : 0) + 1;
      return { ...currentTodos, [id]: { ...newTodo, id } };
    });

    setNewTodo(getFreshTodo);
    setInEdition(false);
  };

  const handleClickOnCompleted = (todo) => {
    setTodos((currentTodos) => ({
      ...currentTodos,
      [todo.id]: { ...todo, completed: !todo.completed },
    }));
  };

  const handleClickOnDelete = (deleteTodo) => {
    setTodos((currentTodos) => {
      // eslint-disable-next-line no-param-reassign
      delete currentTodos[deleteTodo.id];
      return { ...currentTodos };
    });
  };

  const handleClickOnDeleteDone = () => {
    setTodos((currentTodos) => Object.fromEntries(
      Object.entries(currentTodos).filter(([id, todo]) => !todo.completed),
    ));
  };

  const handleClickOnFilter = (event) => {
    event.preventDefault();
    setFilter(event.target.name);
  };

  const markAllAsRead = () => {
    setTodos((currentTodos) => {
      const currentTodosEntries = Object.entries(currentTodos);
      const hasNotCompletedTodo = Boolean(
        currentTodosEntries.filter(([id, todo]) => !todo.completed).length,
      );

      return Object.fromEntries(
        currentTodosEntries.map(([id, todo]) => [
          id,
          {
            ...todo,
            completed: hasNotCompletedTodo,
          },
        ]),
      );
    });
  };

  return (
    <div className="todoapp">
      <header className="header">
        <h1>Todos</h1>
        <form onSubmit={handleOnSubmit}>
          <input
            name="title"
            type="text"
            className="new-todo"
            placeholder="Ajouter une tâche"
            value={newTodo.title}
            onChange={handleOnChangeInputs}
          />
          {errors.title && (
            <span className="error-required">{errors.title}</span>
          )}
          <input
            name="description"
            type="textarea"
            className="new-todo"
            placeholder="Description"
            value={newTodo.description}
            onChange={handleOnChangeInputs}
          />
          {errors.description && (
            <span className="error-required">{errors.description}</span>
          )}
          <select
            name="labelId"
            id="select-label"
            className="new-todo"
            onChange={handleOnChangeInputs}
            value={newTodo.labelId}
          >
            <option value={0} disabled>
              Définir un label
            </option>
            {labels.map((label) => (
              <option key={label.id} value={label.id}>
                {label.title}
              </option>
            ))}
          </select>
          <input
            name="dueDate"
            type="date"
            className="new-todo"
            value={newTodo.dueDate}
            onChange={handleOnChangeInputs}
          />
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button type="submit" />
        </form>
        {inEdition === true ? (
          <button type="button" className="edit" onClick={exitEdition}>
            Annuler la modification
          </button>
        ) : (
          ''
        )}
      </header>
      <div className="main">
        <input id="toggle-all" type="checkbox" className="toggle-all" />
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
        <label onClick={markAllAsRead}>Mark all as complete</label>
        <ul className="todo-list">
          {filter !== 'date'
            ? Object.values(todos)
              .filter((item) => {
                switch (filter) {
                  case 'todo':
                    return !item.completed;
                  case 'done':
                    return item.completed;
                  case 'all':
                    return item;
                  case 'search':
                    return (
                      item.title.includes(search)
                        || item.description.includes(search)
                    );
                  default:
                    // eslint-disable-next-line no-case-declarations
                    const label = labels.find(
                      (element) => element.name === filter,
                    );
                    if (label) {
                      return item.labelId.toString() === label.id.toString();
                    }
                    return item;
                }
              })
              .map((todo) => (
                <Todo
                  key={todo.id}
                  todo={todo}
                  handleClickOnCompleted={handleClickOnCompleted}
                  handleClickOnDelete={handleClickOnDelete}
                  getLabel={getLabel}
                  handleClickOnEdit={handleOnEdit}
                />
              ))
            : Object.values(todos)
              .sort((a, b) => {
                if ((a.dueDate && b.dueDate) || (a.dueDate && !b.dueDate)) {
                  return -1;
                }
                return 1;
              })
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .map((todo) => (
                <Todo
                  key={todo.id}
                  todo={todo}
                  handleClickOnCompleted={handleClickOnCompleted}
                  handleClickOnDelete={handleClickOnDelete}
                  getLabel={getLabel}
                  handleClickOnEdit={handleOnEdit}
                />
              ))}
        </ul>
      </div>
      <footer className="footer">
        <span className="todo-count">
          <strong>{remaining}</strong>
          {' '}
          tâches à faire
        </span>
        <ul className="filters">
          <Filter
            key="all"
            name="all"
            filter={filter}
            handleClickOnFilter={handleClickOnFilter}
            text="Toutes"
          />
          <Filter
            key="todo"
            name="todo"
            filter={filter}
            handleClickOnFilter={handleClickOnFilter}
            text="À faire"
          />
          <Filter
            key="done"
            name="done"
            filter={filter}
            handleClickOnFilter={handleClickOnFilter}
            text="Faites"
          />
        </ul>
        <button type="button" className="clear-completed" onClick={handleClickOnDeleteDone}>
          {' '}
          Supprimer tâches terminées
        </button>
        <br />
        <ul className="filters" style={{ marginTop: 8 }}>
          <Filter
            key="date"
            name="date"
            filter={filter}
            handleClickOnFilter={handleClickOnFilter}
            text="Date croissante"
          />
          {labels.map((el) => (
            <Filter
              key={el.id}
              name={el.name}
              filter={filter}
              handleClickOnFilter={handleClickOnFilter}
              text={el.title}
            />
          ))}
        </ul>
        <br />
        <form onSubmit={(event) => event.preventDefault()}>
          <input
            className="new-todo"
            name="search"
            type="text"
            placeholder="Rechercher"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setFilter('search');
            }}
            style={{ marginTop: 17 }}
          />
        </form>
      </footer>
    </div>
  );
}
