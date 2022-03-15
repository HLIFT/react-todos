// eslint-disable-next-line max-len
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events,jsx-a11y/label-has-associated-control,no-unused-vars */

import '../assets/style/todo.css';
import { useEffect, useState } from 'react';
import { Todo } from './Todo';
import { Filter } from './Filter';
import { updateTodo, deleteTodo, createTodo, getTodos, completeTodo, getLabels } from "../helpers/api";

export function App() {

  const getFreshTodo = () => ({
    id: null,
    title: '',
    description: '',
    labelId: '',
    dueDate: '',
    completed: false,
  });

  const [todos, setTodos] = useState({});
  const [newTodo, setNewTodo] = useState(getFreshTodo);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    getTodos().then(response => {
      if (response.success) {
        setTodos(response.todos)
      }
    })

    getLabels().then(response => {
      if (response.success) {
        setLabels(response.labels)
      }
    })
  }, []);

  const remaining = Object.values(todos).filter(
    (item) => !item.completed,
  ).length;

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
      title: newTodo.title !== '' ? undefined : 'Le titre est obligatoire'
    };

    setErrors(errorsSubmit);

    if (errorsSubmit.title !== undefined) {
      return;
    }

    if (newTodo.id) {
      updateTodo(newTodo).then(response => {
        if (response.success) {
          setTodos((currentTodos) => ({
            ...currentTodos,
            [response.todo.id]: response.todo
          }))
          setNewTodo(getFreshTodo);
          setInEdition(false);
        }
      })
    } else {
      createTodo(newTodo).then(response => {
        if (response.success) {
          setTodos((currentTodos) => ({
            ...currentTodos,
            [response.todo.id]: response.todo
          }))
          setNewTodo(getFreshTodo);
          setInEdition(false);
        }
      })
    }
  };

  const handleClickOnCompleted = (todo) => {
    completeTodo(todo).then(response => {
      if (response.success) {
        setTodos((currentTodos) => ({
          ...currentTodos,
          [response.todo.id]: response.todo,
        }));
      }
    })
  };

  const handleClickOnDelete = (todo) => {
    deleteTodo(todo).then(response => {
      console.log(response.success)
      if (response.success) {
        setTodos((currentTodos) => {
          // eslint-disable-next-line no-param-reassign
          delete currentTodos[todo.id];
          return { ...currentTodos };
        });
      }
    })
  };

  const handleClickOnDeleteDone = () => {
    for (const id in todos) {
      const todo = todos[id]
      if (todo.completed) {
        handleClickOnDelete(todo)
      }
    }
  };

  const handleClickOnFilter = (event) => {
    event.preventDefault();
    setFilter(event.target.name);
  };

  const markAllAsRead = () => {
    const currentTodosEntries = Object.entries(todos);
    const hasNotCompletedTodo = Boolean(
      currentTodosEntries.filter(([id, todo]) => !todo.completed).length,
    );

    for (const id in todos) {
      const todo = todos[id];
      todo.completed = hasNotCompletedTodo
      updateTodo(todo).then(response => {
        if (response.success) {
          setTodos((currentTodos) => ({
            ...currentTodos,
            [response.todo.id]: response.todo,
          }));
        }
      })
    }
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
            placeholder="Label"
          >
            <option value={''}>
              Non classé
            </option>
            {labels.map((label) => (
              <option key={label.id} value={label.id}>
                {label.name}
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
          <button type="submit"/>
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
        <input id="toggle-all" type="checkbox" className="toggle-all"/>
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
                case 'noLabel':
                  return !item.labelId;
                default:
                  // eslint-disable-next-line no-case-declarations
                  const label = labels.find(
                    (element) => element.id.toString() === filter,
                  );
                  if (label) {
                    console.log(item)
                    return item.labelId && item.labelId.toString() === label.id.toString();
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
          tâche(s) à faire
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
        <br/>
        <ul className="filters" style={{ marginTop: 8 }}>
          <Filter
            key="date"
            name="date"
            filter={filter}
            handleClickOnFilter={handleClickOnFilter}
            text="Date croissante"
          />
          <Filter
            key="noLabel"
            name="noLabel"
            filter={filter}
            handleClickOnFilter={handleClickOnFilter}
            text="Non classé"
          />
          {labels.map((el) => (
            <Filter
              key={el.id}
              name={el.id}
              filter={filter}
              handleClickOnFilter={handleClickOnFilter}
              text={el.name}
            />
          ))}
        </ul>
        <br/>
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
