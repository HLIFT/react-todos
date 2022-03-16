import { format } from 'date-fns';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { OldFrontTodo, Label } from '../../back/commonTypes.ts';

type HandleFunction = (todo: OldFrontTodo) => void
type TodoProps = {
    todo: OldFrontTodo,
    handleClickOnCompleted: HandleFunction,
    handleClickOnDelete: HandleFunction,
    handleClickOnEdit: HandleFunction,
    getLabel: (id: number) => Label | undefined,
}

export function Todo({
  todo,
  handleClickOnCompleted,
  handleClickOnDelete,
  handleClickOnEdit,
  getLabel,
}: TodoProps) {
  const label = todo.labelId ? getLabel(todo.labelId) : null;

  return (
    <li key={todo.id} className={todo.completed ? 'todo completed' : 'todo'}>
      <div className="view" style={{ display: 'flex' }}>
        <div>
          <input
            id={`checkbox-${todo.id}`}
            type="checkbox"
            className="toggle"
            checked={todo.completed}
            readOnly
            onClick={() => handleClickOnCompleted(todo)}
          />
          {/* eslint-disable-next-line max-len */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
          <label onClick={() => handleClickOnEdit(todo)} htmlFor={`checkbox-${todo.id}`}>
            {todo.title}
            {todo.description && todo.description !== ''
              ? <div><span style={{ fontSize: 18 }}>{todo.description}</span></div> : null}
            {label ? (
              <div>
                <span
                  className="label"
                  style={{ backgroundColor: label ? label.color : 'gray' }}
                >
                  {label?.name}
                </span>
              </div>
            ) : (
              <div>
                <span
                  className="label"
                  style={{ backgroundColor: 'lightgrey' }}
                >
                  Non classé
                </span>
              </div>
            )}
            <span
              style={{
                fontSize: 20,
                fontStyle: 'italic',
              }}
            >
              {todo.dueDate
                ? format(todo.dueDate, 'dd/MM/yyyy')
                : ''}
            </span>
          </label>
        </div>
        <div>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            className="destroy"
            onClick={() => handleClickOnDelete(todo)}
          />
        </div>
      </div>
      <input type="text" className="edit" />
    </li>
  );
}
