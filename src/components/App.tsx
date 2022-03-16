// eslint-disable-next-line max-len
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events,jsx-a11y/label-has-associated-control,no-unused-vars */

import '../assets/style/todo.css';
import {
  ChangeEventHandler, FormEventHandler, useEffect, useState,
} from 'react';
import { differenceInMilliseconds, format } from 'date-fns';
import { Todo } from './Todo';
import { Filter } from './Filter';
import {
  updateTodo, deleteTodo, createTodo, getTodos, completeTodo, getLabels,
} from '../helpers/api';
import {
  OldFrontTodo, FrontTodo, TodoList, Label, InputErrors,
} from '../../back/commonTypes';
import { Loader } from './Loader';

export function App() {
  const getFreshTodo = () => ({
    id: null,
    title: '',
    description: null,
    labelId: null,
    dueDate: null,
    completed: false,
  } as const);

  const [todos, setTodos] = useState<TodoList>({});
  const [newTodo, setNewTodo] = useState<FrontTodo>(getFreshTodo);
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([getTodos(), getLabels()]).then(([responseTodos, responseLabels]) => {
      if (responseTodos.success) {
        setTodos(responseTodos.todos);
      }

      if (responseLabels.success) {
        setLabels(responseLabels.labels);
      }

      setLoading(false);
    });
  }, []);

  const remaining = Object.values(todos).filter(
    (item) => !item.completed,
  ).length;

  const getLabel = (id: number) => labels.find((item) => item.id === id);

  const [filter, setFilter] = useState<string | number>('all');

  const [inEdition, setInEdition] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const [errors, setErrors] = useState<InputErrors>({});

  const handleOnChangeInputs: ChangeEventHandler<any> = (event) => {
    let value;
    console.log(event.target.value);
    if (event.target.name === 'labelId') {
      value = parseInt(event.target.value, 10);
    } else if (event.target.name === 'dueDate') {
      // eslint-disable-next-line no-unused-expressions
      event.target.value ? value = new Date(event.target.value) : value = null;
    } else {
      value = event.target.value;
    }
    console.log(value);
    setNewTodo({ ...newTodo, [event.target.name]: value });
  };

  const handleOnEdit = (todo: OldFrontTodo) => {
    setInEdition(true);
    setNewTodo(todo);
  };

  const exitEdition = () => {
    setInEdition(false);
    setNewTodo(getFreshTodo);
  };

  const handleOnSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const errorsSubmit = {
      title: newTodo.title !== '' ? undefined : 'Le titre est obligatoire',
    };

    setErrors(errorsSubmit);

    if (errorsSubmit.title !== undefined) {
      return;
    }

    setLoading(true);

    if (newTodo.id) {
      updateTodo(newTodo).then((response) => {
        if (response.success) {
          setTodos((currentTodos) => ({
            ...currentTodos,
            [response.todo.id]: response.todo,
          }));
          setNewTodo(getFreshTodo);
          setInEdition(false);
        }
      });
    } else if (newTodo.id === null) {
      createTodo(newTodo).then((response) => {
        if (response.success) {
          setTodos((currentTodos) => ({
            ...currentTodos,
            [response.todo.id]: response.todo,
          }));
          setNewTodo(getFreshTodo);
          setInEdition(false);
        }
      });
    }
    setLoading(false);
  };

  const handleClickOnCompleted = (todo: OldFrontTodo) => {
    setLoading(true);
    completeTodo(todo).then((response) => {
      if (response.success) {
        setTodos((currentTodos) => ({
          ...currentTodos,
          [response.todo.id]: response.todo,
        }));
      }
    });
    setLoading(false);
  };

  const handleClickOnDelete = (todo: OldFrontTodo) => {
    setLoading(true);
    deleteTodo(todo).then((response) => {
      console.log(response.success);
      if (response.success) {
        setTodos((currentTodos) => {
          // eslint-disable-next-line no-param-reassign
          delete currentTodos[todo.id];
          return { ...currentTodos };
        });
      }
    });
    setLoading(false);
  };

  const handleClickOnDeleteDone = () => {
    setLoading(true);
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const id in todos) {
      const todo = todos[id];
      if (todo.completed) {
        handleClickOnDelete(todo);
      }
    }
    setLoading(false);
  };

  const markAllAsRead = () => {
    setLoading(true);
    const currentTodosEntries = Object.entries(todos);
    const hasNotCompletedTodo = Boolean(
      currentTodosEntries.filter(([, todo]) => !todo.completed).length,
    );

    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const id in todos) {
      const todo = todos[id];
      todo.completed = hasNotCompletedTodo;
      updateTodo(todo).then((response) => {
        if (response.success) {
          setTodos((currentTodos) => ({
            ...currentTodos,
            [response.todo.id]: response.todo,
          }));
        }
      });
    }
    setLoading(false);
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
            value={newTodo.description || ''}
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
            value={newTodo.labelId || ''}
            placeholder="Label"
          >
            <option value="">
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
            value={newTodo.dueDate ? format(newTodo.dueDate, 'yyyy-MM-dd') : ''}
            onChange={handleOnChangeInputs}
          />
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button type="submit" />
        </form>
        {inEdition ? (
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
        {loading ? <Loader /> : (
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
                        || (item.description ? item.description.includes(search) : null)
                      );
                    case 'noLabel':
                      return !item.labelId;
                    default:
                      // eslint-disable-next-line no-case-declarations
                      const label = labels.find(
                        (element) => element.id === filter,
                      );
                      if (label) {
                        return item.labelId && item.labelId === label.id;
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
                  if ((a.dueDate && b.dueDate)) {
                    return differenceInMilliseconds(a.dueDate, b.dueDate);
                  }
                  if (a.dueDate && !b.dueDate) {
                    return -1;
                  }
                  return 1;
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
                ))}
          </ul>
        )}

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
            handleClickOnFilter={setFilter}
            text="Toutes"
          />
          <Filter
            key="todo"
            name="todo"
            filter={filter}
            handleClickOnFilter={setFilter}
            text="À faire"
          />
          <Filter
            key="done"
            name="done"
            filter={filter}
            handleClickOnFilter={setFilter}
            text="Faites"
          />
        </ul>
        <button type="button" className="clear-completed" onClick={handleClickOnDeleteDone}>
          Supprimer tâches terminées
        </button>
        <br />
        <ul className="filters" style={{ marginTop: 8 }}>
          <Filter
            key="date"
            name="date"
            filter={filter}
            handleClickOnFilter={setFilter}
            text="Date croissante"
          />
          <Filter
            key="noLabel"
            name="noLabel"
            filter={filter}
            handleClickOnFilter={setFilter}
            text="Non classé"
          />
          {labels.map(({ id, name }) => (
            <Filter
              key={id}
              name={id}
              filter={filter}
              handleClickOnFilter={setFilter}
              text={name}
            />
          ))}
        </ul>
        <br />
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
      </footer>
    </div>
  );
}
